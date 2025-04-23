const { Router } = require("express");
const { verifyMagicLink } = require("@/controllers/email");

const router = Router();

// ---------------------- Public Routes ----------------------

router.route("/verify").post(verifyMagicLink);

// ---------------------- Protected Routes ----------------------


module.exports = router;