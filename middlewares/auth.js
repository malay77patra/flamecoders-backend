const jwt = require("jsonwebtoken");
const User = require("@models/user");

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                error: {
                    message: "Unauthorized request blocked."
                }
            });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id);

        if (!user) {
            return res.status(401).json({
                error: {
                    message: "User not found."
                }
            });
        }

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                error: {
                    message: "Session expired, please login."
                }
            });
        } else if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
            return res.status(401).json({
                error: {
                    message: "Unauthorized request blocked."
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

module.exports = { verifyJWT };
