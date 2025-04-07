

const loginAdmin = (req, res) => {
    // Checking for admin credentials are expected to be handled
    // by middlewares

    return res.status(200).json({
        message: "Admin access granted.",
        isAdmin: true
    });
}

module.exports = { loginAdmin };
