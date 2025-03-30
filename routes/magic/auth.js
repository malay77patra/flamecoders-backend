const { Router } = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const Pending = require("@models/pending");
const User = require("@models/user");

dotenv.config();
const router = Router();

router.get("/verify", async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.json({
            error: {
                message: "Oops! This Link Seems Invalid."
            }
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.MAGIC_SECRET);
        const { name, email, password } = decodedToken;
        const pending = await Pending.findOne({ email });

        if (!pending) {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.json({
                    success: {
                        message: "Your Email Is Already Verified!"
                    }
                });
            } else {
                throw "User not found!";
            }
        }

        await User.create({ name, email, password });
        await Pending.deleteOne({ email });
        return res.json({
            success: {
                message: "Email Verified Successfully 🎉"
            }
        });

    } catch (error) {
        let message = "An unexpected error occurred. Please try again later.";

        if (error.name === "TokenExpiredError") {
            message = "The verification link has expired. Please register again.";
        } else if (error.name === "JsonWebTokenError") {
            message = "The verification link is invalid. Please check your email and try again.";
        } else if (error.name === "NotBeforeError") {
            message = "This verification link is not active yet. Please try again later.";
        }

        console.error(error);
        return res.json({
            error: {
                message: message
            }
        });
    }
});

module.exports = router;
