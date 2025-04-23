

const verifyJWTAdmin = async (req, res, next) => {
    //
    // You are expected to use the verifyUserJWT() 
    // middleware before using verifyJWTAdmin() always.
    //

    const user = req.user;

    if (!user || admin.role !== "admin") {
        return res.status(401).json({
            message: "Not an admin.",
            details: "user is not an admin"
        });
    }

    next();
};


module.exports = { verifyJWTAdmin };
