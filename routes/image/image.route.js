const { Router } = require("express");
const { verifyJWTUser } = require("@/middlewares/user.middleware");
const { uploadImgHandler, uploadNewImage } = require("@/controllers/image/image.controller");

const router = Router();

// ---------------------- Public Routes ----------------------

// ---------------------- Protected Routes ----------------------
router.route("/upload").post(verifyJWTUser, uploadImgHandler, uploadNewImage);



module.exports = router;