const { Router } = require("express");

const router = Router();

// Routes under /routes
const userRoutes = require("./user");
const magicRoutes = require("./magic");
const postRoutes = require("./post");
const multer = require('multer');

// Registering Routes
router.use("/api", userRoutes);
router.use("/api", magicRoutes);
router.use("/api", postRoutes);


module.exports = router;