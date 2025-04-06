require("dotenv").config();
const User = require("@models/user");
const Pending = require("@models/pending");
const jwt = require("jsonwebtoken");
const { getJwtFormat } = require("@utils");
const { sendEmail } = require("@utils/smtp");
const { loginSchema, registerSchema } = require("@utils/validations");
const {
  SMALL_COOL_DOWN,
  BIG_COOL_DOWN,
  MAX_MAGIC_LINK_AGE,
  MAX_REGISTRATION_TRIES,
  REFRESH_TOKEN_OPTIONS,
} = require("@config");
const { EMAIL } = require("@utils/template");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    await registerSchema.validate(
      { name, email, password },
      { abortEarly: false }
    );

    const createMagicLink = () => {
      const magicToken = jwt.sign(
        { name, email, password },
        process.env.MAGIC_SECRET,
        { expiresIn: getJwtFormat(MAX_MAGIC_LINK_AGE) }
      );

      return `${process.env.CLIENT_URL}/verify?token=${magicToken}`;
    };

    const sendMagicLink = async () => {
      const magicLink = createMagicLink();
      const subject = "Magic Link for Registration";
      const text = EMAIL.verify.text.replace("{{link}}", magicLink);
      const html = EMAIL.verify.html.replace("{{link}}", magicLink);

      await sendEmail(email, subject, text, html);
    };

    const handlePendingRegistration = async () => {
      const now = new Date();
      const bigCoolDown = new Date(now.getTime() - BIG_COOL_DOWN);
      const smallCoolDown = new Date(now.getTime() - SMALL_COOL_DOWN);

      const pending = await Pending.findOne({ email });

      if (pending) {
        if (pending.attempts >= MAX_REGISTRATION_TRIES) {
          if (pending.attemptAt > bigCoolDown) {
            return {
              status: 429,
              message: "Too many attempts. Try again later.",
            };
          }
          pending.attempts = 1;
        } else if (pending.attemptAt > smallCoolDown) {
          return {
            status: 429,
            message: "Please wait before trying again.",
          };
        } else {
          pending.attempts += 1;
        }

        pending.attemptAt = now;
        await pending.save();
      } else {
        await Pending.create({ email, attempts: 1, attemptAt: now });
      }

      return {
        status: 200,
      };
    };

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: "This email is already in use.",
        error: {
          code: "EMAIL_TAKEN",
          details: "The provided email is already registered.",
        },
      });
    }

    const pendingResult = await handlePendingRegistration();

    if (pendingResult.status !== 200) {
      return res.status(pendingResult.status).json({
        status: pendingResult.status,
        message: pendingResult.message,
        error: {
          code: "RATE_LIMIT",
          details: "Too many registration attempts.",
        },
      });
    }

    await sendMagicLink();

    return res.status(200).json({
      status: 200,
      message:
        "Verification link has been sent to your email. Please check your inbox.",
      error: null,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: 400,
        message: error.inner[0]?.message || "Validation failed.",
        error: {
          code: "VALIDATION_ERROR",
          details: "Invalid registration input.",
        },
      });
    }

    console.error("Error occurred:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      error: { code: "SERVER_ERROR", details: "Internal server error." },
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    await loginSchema.validate({ email, password }, { abortEarly: false });

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found. Please register first.",
        error: {
          code: "USER_NOT_FOUND",
          details: "No user registered with this email.",
        },
      });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(403).json({
        status: 403,
        message: "Incorrect password.",
        error: {
          code: "INVALID_CREDENTIALS",
          details: "The entered password is incorrect.",
        },
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
        status: 200,
        message: "Logged in successfully.",
        user: { name: user.name, email: user.email },
        accessToken,
      });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: 400,
        message: error.inner[0]?.message || "Validation failed.",
        error: {
          code: "VALIDATION_ERROR",
          details: "Invalid registration input.",
        },
      });
    }

    console.error("Error occurred:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      error: { code: "SERVER_ERROR", details: "Internal server error." },
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { email: req.user.email },
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    const REFRESH_TOKEN_OPTIONS_FOR_DELETION = { ...REFRESH_TOKEN_OPTIONS };
    delete REFRESH_TOKEN_OPTIONS_FOR_DELETION.maxAge;

    res.clearCookie("refreshToken", REFRESH_TOKEN_OPTIONS_FOR_DELETION);

    return res.status(200).json({
      status: 200,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Error occurred:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    return res.status(500).json({
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      error: { code: "SERVER_ERROR", details: "Internal server error." },
    });
  }
};

const refreshUser = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    console.log("ref:", incomingRefreshToken);

    if (!incomingRefreshToken) {
      return res.status(401).json({
        status: 401,
        message: "No refresh token provided.",
        error: {
          code: "NO_TOKEN",
          details: "Missing refresh token in request.",
        },
      });
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    console.log("decoded:", decodedToken);
    const user = await User.findOne({ email: decodedToken.email });

    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({
        status: 401,
        message: "Invalid refresh token.",
        error: {
          code: "INVALID_REFRESH_TOKEN",
          details: "Refresh token does not match records.",
        },
      });
    }

    const accessToken = user.generateAccessToken();
    await User.findOneAndUpdate(
      { email: user.email },
      { accessToken },
      { new: true }
    );

    return res.status(200).json({
      status: 200,
      message: "Access token refreshed successfully.",
      accessToken,
    });
  } catch (error) {
    console.error("Error occurred:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      error: { code: "SERVER_ERROR", details: "Internal server error." },
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, refreshUser };
