const { Router } = require("express");
const { verifyJWTAdmin } = require("@/middlewares/admin.middleware");
const { verifyJWTUser } = require("@/middlewares/user.middleware");
const { uploadEditorImage } = require("@/controllers/upload")
const router = Router();

// ---------------------- Public Routes ----------------------


// ---------------------- Protected Routes ----------------------
router.route("/upload").post(verifyJWTUser, verifyJWTAdmin, uploadEditorImage);

module.exports = router;