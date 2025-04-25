const { Router } = require("express");
const { newPost, getPost, updatePost } = require("@/controllers/post/post.controller");
const { verifyJWTUser, verifyJWTOptionalUser } = require("@/middlewares/user.middleware");

const router = Router();

// ---------------------- Public Routes ----------------------

// ---------------------- Protected Routes ----------------------
router.route("/new").post(verifyJWTUser, newPost);
router.route("/get/:id").get(verifyJWTOptionalUser, getPost);
router.route("/update").post(verifyJWTUser, updatePost);



module.exports = router;