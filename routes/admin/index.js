const { Router } = require("express");

const router = Router();

// Routes under /admin
const authRoutes = require("./auth.route");

// Registering
router.use("/admin", authRoutes);


module.exports = router;

