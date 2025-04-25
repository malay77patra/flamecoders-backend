const { Router } = require("express");

const router = Router();

// Routes under /user
const authRoutes = require("./auth.route");
const updateRoutes = require("./update.route");

// Registering
router.use("/user", authRoutes);
router.use("/user", updateRoutes);


module.exports = router;

