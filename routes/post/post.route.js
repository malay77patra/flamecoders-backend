const { Router } = require("express");
const { verifyJWTAdmin } = require("@middlewares/admin.middleware");
const { verifyJWTUser } = require("@middlewares/user.middleware");
const {
    createNewPostAdmin,
    getPost, getPostAdmin,
    publishPostAdmin,
    updatePostAdmin,
    deletePostAdmin
} = require("@controllers/post")
const router = Router();

// ---------------------- Public Routes ----------------------
router.route("/get/:id").get(getPost);


// ---------------------- Protected Routes ----------------------
router.route("/new").post(verifyJWTUser, verifyJWTAdmin, createNewPostAdmin);
router.route("/get-admin/:id").get(verifyJWTUser, verifyJWTAdmin, getPostAdmin);
router.route("/publish").post(verifyJWTUser, verifyJWTAdmin, publishPostAdmin);
router.route("/update").post(verifyJWTUser, verifyJWTAdmin, updatePostAdmin);
router.route("/delete").post(verifyJWTUser, verifyJWTAdmin, deletePostAdmin);

module.exports = router;