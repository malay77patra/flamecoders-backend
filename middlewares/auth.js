const jwt = require("jsonwebtoken");
const User = require("@models/user");

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized request blocked.",
                error: {
                    code: "UNAUTHORIZED",
                    details: "Missing authentication token."
                }
            });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id);

        if (!user) {
            return res.status(401).json({
                status: 401,
                message: "User not found.",
                error: {
                    code: "USER_NOT_FOUND",
                    details: "The token does not match any registered user."
                }
            });
        }

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                status: 401,
                message: "Session expired, please login.",
                error: {
                    code: "TOKEN_EXPIRED",
                    details: "Your authentication token has expired."
                }
            });
        } else if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized request blocked.",
                error: {
                    code: "INVALID_TOKEN",
                    details: "The provided token is invalid or not active yet."
                }
            });
        }

        return res.status(500).json({
            status: 500,
            message: "An unexpected error occurred. Please try again later.",
            error: {
                code: "SERVER_ERROR",
                details: "An internal server error occurred while verifying the token."
            }
        });
    }
};

module.exports = { verifyJWT };
