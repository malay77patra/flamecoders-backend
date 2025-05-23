const { Router } = require("express");
const { updateUser, uploadAvtHandler } = require("@/controllers/user/update.controller");
const { verifyJWTUser } = require("@/middlewares/user.middleware");

const router = Router();

// ---------------------- Public Routes ----------------------

// ---------------------- Protected Routes ----------------------
router.route("/update").patch(verifyJWTUser, uploadAvtHandler, updateUser);



module.exports = router;