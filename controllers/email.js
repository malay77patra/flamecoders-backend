require("dotenv").config();
const jwt = require("jsonwebtoken");
const Pending = require("@models/pending");
const User = require("@models/user");


const verifyMagicLink = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            status: 400,
            message: "Oops! This Link Seems Invalid.",
            error: { code: "INVALID_TOKEN", details: "Missing magic link token." }
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.MAGIC_SECRET);
        const { name, email, password } = decodedToken;
        const pending = await Pending.findOne({ email });

        if (!pending) {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(200).json({
                    status: 200,
                    message: "Your Email Is Already Verified!",
                });
            } else {
                throw new Error("USER_NOT_FOUND");
            }
        }

        await User.create({ name, email, password });
        await Pending.deleteOne({ email });

        return res.status(200).json({
            status: 200,
            message: "Email Verified Successfully 🎉",
        });

    } catch (error) {
        console.error("Error occurred:", {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        
        let status = 500;
        let message = "An unexpected error occurred. Please try again later.";
        let errorCode = "SERVER_ERROR";

        if (error.name === "TokenExpiredError") {
            status = 401;
            message = "The verification link has expired. Please register again.";
            errorCode = "TOKEN_EXPIRED";
        } else if (error.name === "JsonWebTokenError") {
            status = 401;
            message = "The verification link is invalid. Please check your email and try again.";
            errorCode = "INVALID_JWT";
        } else if (error.name === "NotBeforeError") {
            status = 401;
            message = "This verification link is not active yet. Please try again later.";
            errorCode = "TOKEN_NOT_ACTIVE";
        } else if (error.message === "USER_NOT_FOUND") {
            status = 404;
            message = "User not found. Please register first.";
            errorCode = "USER_NOT_FOUND";
        }

        return res.status(status).json({
            status: status,
            message: message,
            error: { code: errorCode, details: message }
        });
    }
};

module.exports = { verifyMagicLink };
