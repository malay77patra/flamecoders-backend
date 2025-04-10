const { Router } = require("express");
const { registerUser, loginUser, logoutUser, refreshUser } = require("@controllers/user");
const { verifyJWTUser } = require("@middlewares/user.middleware");

const router = Router();

// ---------------------- Public Routes ----------------------

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.post("/refresh", refreshUser);

// ---------------------- Protected Routes ----------------------
router.route("/logout").post(verifyJWTUser, logoutUser);



module.exports = router;