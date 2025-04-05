const jwt = require("jsonwebtoken");
const User = require("@models/user");
const Admin = require("@models/admin");


const verifyJWTAdmin = async (req, res, next) => {
    try {
        // You are expected to use the verifyUserJWT() middleware before using verifyJWTAdmin() always.

        const user = req.user;
        const admin = await Admin.findOne({ email: user.email });

        if (!admin) {
            return res.status(401).json({
                status: 401,
                message: "Not an admin.",
                error: {
                    code: "NOT_AN_ADMIN",
                    details: "User is not an admin."
                }
            });
        }

        user.isAdmin = true;
        req.user = user;
        next();

    } catch (error) {
        console.error("Error occurred:", {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
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

module.exports = { verifyJWTAdmin };
