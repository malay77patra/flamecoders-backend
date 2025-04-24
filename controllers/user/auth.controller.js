require("dotenv").config();
const User = require("@/db/models/user");
const Pending = require("@/db/models/pending");
const jwt = require("jsonwebtoken");
const { getJwtFormat } = require("@/utils/helpers");
const { sendEmail } = require("@/utils/smtp");
const { loginSchema, registerSchema } = require("@/utils/validations");
const {
  SMALL_COOL_DOWN,
  BIG_COOL_DOWN,
  MAX_MAGIC_LINK_AGE,
  MAX_REGISTRATION_TRIES,
  REFRESH_TOKEN_OPTIONS,
} = require("@/config");
const ejs = require('ejs');
const path = require("path");


//  Register user //

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    await registerSchema.validate(
      { name, email, password },
      { abortEarly: false }
    );

    const sendMagicLink = async () => {
      const magicToken = jwt.sign(
        { name, email, password },
        process.env.MAGIC_SECRET,
        { expiresIn: getJwtFormat(MAX_MAGIC_LINK_AGE) }
      );

      const magicLink = `${req.protocol}://${req.get('host')}/api/magic/verify?token=${magicToken}`;
      const subject = "Verify Your Email.";

      const html = await ejs.renderFile(path.join(__root, "views", "emails", "verification-email.ejs"), {
        magicLink
      });

      await sendEmail(email, subject, html);
    };

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "This email is already in use.",
        details: "The provided email is already registered."
      });
    }

    const now = new Date();
    const bigCoolDown = new Date(now.getTime() - BIG_COOL_DOWN);
    const smallCoolDown = new Date(now.getTime() - SMALL_COOL_DOWN);

    const pending = await Pending.findOne({ email });

    if (pending) {
      if (pending.attempts >= MAX_REGISTRATION_TRIES) {
        if (pending.attemptAt > bigCoolDown) {
          return res.status(429).json({
            message: "Too many attempts. Try again later.",
            details: "wait 30mins before trying again"
          });
        }
        pending.attempts = 1;
      } else if (pending.attemptAt > smallCoolDown) {
        return res.status(429).json({
          message: "Please wait before trying again.",
          details: "wait 2 mins before trying again",
        });
      } else {
        pending.attempts += 1;
      }

      pending.attemptAt = now;
      await pending.save();
    } else {
      await Pending.create({ email, attempts: 1, attemptAt: now });
    }

    await sendMagicLink();

    return res.status(200).json({
      message: "Verification link has been sent to your email. Please check your inbox."
    });
  } catch (error) {

    // Validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.inner[0]?.message || "Input registration data is invalid.",
        details: "provided registration data is invalid"
      });
    }

    throw error;
  }
};


// Login User //

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    await loginSchema.validate({ email, password }, { abortEarly: false });

    const user = await User.findOne({ email });
    console.log("user:", user)

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please register first.",
        details: "no user registered with this email",
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(403).json({
        message: "Incorrect password.",
        details: "entered password is incorrect",
      });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await User.findOneAndUpdate(
      { email: user.email },
      { refreshToken },
      { new: true }
    );

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, REFRESH_TOKEN_OPTIONS)
      .json({
        message: "Logged in.",
        user: { name: user.name, email: user.email },
        accessToken,
      });
  } catch (error) {

    // Validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.inner[0]?.message || "Input login data is invalid.",
        details: "provided login data is invalid"
      });
    }

    throw error;
  }
};


// Logout user //

const logoutUser = async (req, res) => {

  await User.findOneAndUpdate(
    { email: req.user.email },
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  const REFRESH_TOKEN_OPTIONS_FOR_DELETION = { ...REFRESH_TOKEN_OPTIONS };
  delete REFRESH_TOKEN_OPTIONS_FOR_DELETION.maxAge;

  // Remove the maxAge property since its depreacted from clearCookie.
  //
  // express deprecated res.clearCookie: Passing "options.maxAge" is deprecated.
  // In v5.0.0 of Express, this option will be ignored, as res.clearCookie will automatically set cookies to expire immediately.
  //
  res.clearCookie("refreshToken", REFRESH_TOKEN_OPTIONS_FOR_DELETION);

  return res.status(200).json({
    message: "Logged out.",
  });
};

// Refresh user

const refreshUser = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        redirect: true,
        message: "Please login first.",
        details: "no refresh token is found in request cookies",
      });
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findOne({ email: decodedToken.email });

    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({
        redirect: true,
        message: "Invalid refresh token.",
        details: "user refresh token doesnt match any user",
      });
    }

    const accessToken = user.generateAccessToken();
    await User.findOneAndUpdate(
      { email: user.email },
      { accessToken },
      { new: true }
    );

    return res.status(200).json({
      message: "Refreshed successfully.",
      accessToken,
    });
  } catch (error) {

    // Token errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        redirect: true,
        message: "Session expired, Please login.",
        details: "refresh token has been expired"
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        redirect: true,
        message: "Invalid credentials, Please login.",
        details: "invalid refresh token is provided"
      });
    } else if (error.name === "NotBeforeError") {
      return res.status(401).json({
        redirect: true,
        message: "The session is not active yetv Please wait.",
        details: "refresh token is not active yet."
      });
    }

    throw error;
  }
};

module.exports = { registerUser, loginUser, logoutUser, refreshUser };
