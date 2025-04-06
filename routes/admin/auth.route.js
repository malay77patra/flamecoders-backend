const { Router } = require("express");
const { loginAdmin } = require("@controllers/admin");
const { verifyJWTAdmin } = require("@middlewares/auth.admin");
const { verifyJWTUser } = require("@middlewares/auth.user");

const router = Router();

// ---------------------- Public Routes ----------------------


// ---------------------- Protected Routes ----------------------
router.use(verifyJWTUser, verifyJWTAdmin);
router.route("/login").post(loginAdmin);


module.exports = router;