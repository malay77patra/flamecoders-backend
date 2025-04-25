const { Router } = require("express");
const { updateUser } = require("@/controllers/user/update.controller");
const { verifyJWTUser } = require("@/middlewares/user.middleware");

const router = Router();

// ---------------------- Public Routes ----------------------

// ---------------------- Protected Routes ----------------------
router.route("/update").patch(verifyJWTUser, updateUser);



module.exports = router;