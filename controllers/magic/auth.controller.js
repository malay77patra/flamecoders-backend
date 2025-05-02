require("dotenv").config();
const jwt = require("jsonwebtoken");
const Pending = require("@/db/models/pending");
const User = require("@/db/models/user");
const path = require("path");
const { getRandomAvatar } = require("@/utils/helpers");

const verifyMagicLink = async (req, res) => {
    try {
        const { token } = req.query

        if (!token) {
            return res.status(400).render(path.join("pages", "verify-email"), {
                error: "Invalid or missing token."
            })
        }

        const decodedToken = jwt.verify(token, process.env.MAGIC_SECRET)
        const { name, email, password } = decodedToken
        const avatar = getRandomAvatar()

        const pending = await Pending.findOne({ email })

        if (!pending) {
            const existingUser = await User.findOne({ email })

            if (existingUser) {
                return res.render(path.join("pages", "verify-email"), {
                    success: true
                })
            } else {
                return res.status(404).render(path.join("pages", "verify-email"), {
                    error: "User not found for this token."
                })
            }
        }

        await User.create({ name, email, password, avatar })
        await Pending.deleteOne({ email })

        return res.render(path.join("pages", "verify-email"), {
            error: ""
        })

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).render(path.join("pages", "verify-email"), {
                error: "This link has expired. Please request a new one."
            })
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).render(path.join("pages", "verify-email"), {
                error: "Invalid verification link."
            })
        } else if (error.name === "NotBeforeError") {
            return res.status(401).render(path.join("pages", "verify-email"), {
                error: "This link is not active yet. Try again later."
            })
        }

        throw error;
    }
}

module.exports = { verifyMagicLink }
