require("dotenv").config();
const jwt = require("jsonwebtoken");
const Pending = require("@models/pending");
const User = require("@models/user");


const verifyMagicLink = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "Oops! This Link Seems Invalid.",
                details: "No token is provided."
            });
        }

        const decodedToken = jwt.verify(token, process.env.MAGIC_SECRET);
        const { name, email, password } = decodedToken;
        const pending = await Pending.findOne({ email });

        if (!pending) {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(200).json({
                    message: "Your Email Is Already Verified!",
                });
            } else {
                return res.status(404).json({
                    message: "User not found.",
                    details: "No user found with the provided token."
                });
            }
        }

        await User.create({ name, email, password });
        await Pending.deleteOne({ email });

        return res.status(200).json({
            message: "Email Verification Successful 🎉",
        });

    } catch (error) {

        // Token errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "The verification link has expired. Please register again.",
                details: "verification link has been expired"
            });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "The verification link is invalid. Please check your email and try again.",
                details: "verification link is invalid"
            });
        } else if (error.name === "NotBeforeError") {
            return res.status(401).json({
                message: "The verification link is not active yet. Please try again later.",
                details: "verification link is not active yet."
            });
        }

        throw error;
    }
};

module.exports = { verifyMagicLink };
