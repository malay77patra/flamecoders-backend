const { Router } = require("express");

const router = Router();

// Routes under /magic
const imageRoutes = require("./image.routes");

// Registering
router.use("/img", imageRoutes);


module.exports = router;

