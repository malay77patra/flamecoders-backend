const { Router } = require("express");
const { loginAdmin } = require("@controllers/admin");
const { verifyJWTAdmin } = require("@middlewares/admin.middleware");
const { verifyJWTUser } = require("@middlewares/user.middleware");

const router = Router();

// ---------------------- Public Routes ----------------------


// ---------------------- Protected Routes ----------------------
router.route("/login").post(verifyJWTUser, verifyJWTAdmin, loginAdmin);


module.exports = router;