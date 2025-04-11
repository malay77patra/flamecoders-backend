const { Router } = require("express");

const router = Router();

// Routes under /routes
const userRoutes = require("./user");
const magicRoutes = require("./magic");
const adminRoutes = require("./admin");
const postRoutes = require("./post");
const imageRoutes = require("./img");

// Registering Routes
router.use("/api", userRoutes);
router.use("/api", magicRoutes);
router.use("/api", adminRoutes);
router.use("/api", postRoutes);
router.use("/api", imageRoutes);


module.exports = router;