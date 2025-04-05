const { Router } = require("express");

const router = Router();

// Routes under /routes
const userRoutes = require("./user");
const magicRoutes = require("./magic");
const adminRoutes = require("./admin");

// Registering Routes
router.use("/api", userRoutes);
router.use("/api", magicRoutes);
router.use("/api", adminRoutes);


module.exports = router;