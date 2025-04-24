const { Router } = require("express");

const router = Router();

// Routes under /user
const authRoutes = require("./auth.route");

// Registering
router.use("/user", authRoutes);


module.exports = router;

