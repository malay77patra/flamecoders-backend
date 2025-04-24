const { Router } = require("express");
const { verifyMagicLink } = require("@/controllers/magic/auth.controller");

const router = Router();

// ---------------------- Public Routes ----------------------

router.route("/verify").get(verifyMagicLink);

// ---------------------- Protected Routes ----------------------


module.exports = router;