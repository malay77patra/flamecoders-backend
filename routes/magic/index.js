const { Router } = require("express");

const router = Router();

// Routes under /magic
const authRoutes = require("./auth.route");

// Registering
router.use("/magic", authRoutes);


module.exports = router;

