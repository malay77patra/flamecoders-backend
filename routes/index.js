const { Router } = require("express");

const router = Router();

// Routes under /routes
const userRoutes = require("./user");
const magicRoutes = require("./magic");
const postRoutes = require("./post");
const imageRoutes = require("./image");

// Registering Routes
router.use("/api", userRoutes);
router.use("/api", magicRoutes);
router.use("/api", postRoutes);
router.use("/api", imageRoutes);


module.exports = router;