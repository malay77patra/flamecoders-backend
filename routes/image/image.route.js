const { Router } = require("express");
const { verifyJWTUser } = require("@/middlewares/user.middleware");
const { uploadImgHandler, uploadNewImage, getAllImage, deleteImage } = require("@/controllers/image/image.controller");

const router = Router();

// ---------------------- Public Routes ----------------------

// ---------------------- Protected Routes ----------------------
router.route("/upload").post(verifyJWTUser, uploadImgHandler, uploadNewImage);
router.route("/all").get(verifyJWTUser, getAllImage);
router.route("/delete/:imageId").delete(verifyJWTUser, deleteImage);



module.exports = router;