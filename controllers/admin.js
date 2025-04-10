

// ------------------IMPORTANT------------------
//
// Checking for admin credentials are expected to be handled
// by middlewares

// Login admin

const loginAdmin = (req, res) => {
    return res.status(200).json({
        message: "Admin access granted.",
        isAdmin: true
    });
}


module.exports = {
    loginAdmin,
};
