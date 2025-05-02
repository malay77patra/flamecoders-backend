const { Router } = require("express");
const { updateUser, uploadImage } = require("@/controllers/user/update.controller");
const { verifyJWTUser } = require("@/middlewares/user.middleware");

const router = Router();

// ---------------------- Public Routes ----------------------

// ---------------------- Protected Routes ----------------------
router.route("/update").patch(verifyJWTUser, uploadImage, updateUser);



module.exports = router;