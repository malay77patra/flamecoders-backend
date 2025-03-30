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
    MAGIC_LINK_VERIFICATION_ENDPOINT,
    MAX_REGISTRATION_TRIES,
    REFRESH_TOKEN_OPTIONS
} = require("@config");

const registerUser = async (req, res) => {
    try {
        await registerSchema.validate(req.body, { abortEarly: false });

        const { name, email, password } = req.body;

        const createMagicLink = () => {
            const magicToken = jwt.sign(
                { name, email, password },
                process.env.MAGIC_SECRET,
                { expiresIn: getJwtFormat(MAX_MAGIC_LINK_AGE) }
            );

            return `${req.protocol}://${req.get("host")}${MAGIC_LINK_VERIFICATION_ENDPOINT}?token=${magicToken}`;
        };

        const sendMagicLink = async () => {
            const magicLink = createMagicLink();
            const subject = "Magic Link for Registration";
            const text = `Click the link to register: ${magicLink}`;
            const html = `<p>Click the link to register:</p><a href="${magicLink}">Register</a>`;

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
                        return { status: 429, message: "Too many attempts. Try again later." };
                    }
                    pending.attempts = 1;
                } else if (pending.attemptAt > smallCoolDown) {
                    return { status: 429, message: "Please wait before trying again." };
                } else {
                    pending.attempts += 1;
                }

                pending.attemptAt = now;
                await pending.save();
            } else {
                await Pending.create({ email, attempts: 1, attemptAt: now });
            }

            return { status: 200 };
        };

        const existingUser = await User.findOne({ email }).lean();
        if (existingUser) {
            return res.status(400).json({ error: { message: "This email is already in use." } });
        }

        const pendingResult = await handlePendingRegistration();

        if (pendingResult.status !== 200) {
            return res.status(pendingResult.status).json({ error: { message: pendingResult.message } });
        }

        await sendMagicLink();

        return res.status(200).json({
            success: { message: "Verification link has been sent to your email. Please check your inbox." }
        });

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: { message: error.inner[0]?.message || "Validation failed." } });
        }
        console.error("Error in registerUser:", error);
        return res.status(500).json({
            error: { message: "An unexpected error occurred. Please try again later." }
        });
    }
};



const loginUser = async (req, res) => {
    try {
        await loginSchema.validate(req.body, { abortEarly: false });

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                error: {
                    message: "User not found, please enter correct email."
                }
            });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: {
                    message: "Please enter the correct password."
                }
            });
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, REFRESH_TOKEN_OPTIONS)
            .json({
                success: {
                    accessToken,
                    message: "Logged in successfully."
                }
            });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: {
                    message: error.inner[0]?.message || "Validation failed."
                }
            });
        }

        return res.status(500).json({
            error: {
                message: "An unexpected error occurred. Please try again later."
            }
        });
    }
};

const logoutUser = async (req, res) => {
    try {

        await User.findByIdAndUpdate(
            req.user._id,
            { $unset: { refreshToken: 1 } },
            { new: true }
        );

        // Remove the maxAge since its depreacted from clearCookie.
        //
        // express deprecated res.clearCookie: Passing "options.maxAge" is deprecated.
        // In v5.0.0 of Express, this option will be ignored, as res.clearCookie will automatically set cookies to expire immediately.
        //
        const REFRESH_TOKEN_OPTIONS_FOR_DELETION = { ...REFRESH_TOKEN_OPTIONS };
        delete REFRESH_TOKEN_OPTIONS_FOR_DELETION.maxAge;

        res.clearCookie("refreshToken", REFRESH_TOKEN_OPTIONS_FOR_DELETION);

        return res.status(200).json({
            success: {
                message: "Logged out successfully."
            }
        });
    } catch (error) {
        return res.status(500).json({
            error: {
                message: "An unexpected error occurred. Please try again later."
            }
        });
    }
};

const refreshUser = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({
                error: {
                    message: "No refresh token provided."
                }
            });
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return res.status(401).json({
                error: {
                    message: "User not found."
                }
            });
        }

        if (!user.refreshToken) {
            return res.status(401).json({
                error: {
                    message: "User is not authenticated."
                }
            });
        }

        if (user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json({
                error: {
                    message: "Invalid refresh token."
                }
            });
        }

        const accessToken = user.generateAccessToken();
        await User.findByIdAndUpdate(user._id, { accessToken }, { new: true });

        return res.status(200).json({
            success: {
                accessToken,
                message: "Access token refreshed successfully."
            }
        });

    } catch (error) {

        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(401).json({
                error: {
                    message: "Invalid or expired refresh token."
                }
            });
        }

        return res.status(500).json({
            error: {
                message: "An unexpected error occurred. Please try again later."
            }
        });
    }
};

module.exports = { registerUser, loginUser, logoutUser, refreshUser };
