const Admin = require("@models/admin");


const verifyJWTAdmin = async (req, res, next) => {
    //
    // You are expected to use the verifyUserJWT() 
    // middleware before using verifyJWTAdmin() always.
    //

    const user = req.user;
    const admin = await Admin.findOne({ email: user.email });

    if (!admin) {
        return res.status(401).json({
            message: "Not an admin.",
            details: "user is not an admin"
        });
    }

    req.user.isAdmin = true;
    next();
};

module.exports = { verifyJWTAdmin };
