const { Router } = require("express");

const router = Router();

// Routes under /post
const postRoutes = require("./post.route");

// Registering
router.use("/post", postRoutes);

module.exports = router;
