const { Router } = require("express");

const router = Router();

// Routes under /routes
const userRoutes = require("./user");
const magicRoutes = require("./magic");

// Registering Routes
router.use("/api", userRoutes);
router.use("/api", magicRoutes);


module.exports = router;