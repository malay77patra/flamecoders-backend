const { Router } = require("express");

const router = Router();

// Routes under /image
const imageRoutes = require("./image.route");

// Registering
router.use("/image", imageRoutes);

module.exports = router;
