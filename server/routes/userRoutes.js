const express = require("express");
const router = express.Router();

// Imported Controllers functions
const { profile, publicProfile } = require("../controllers/userController");

// Authentication middleware
const { requireSignin } = require("../middlewares/signinRequire");
const { authMiddleware } = require("../middlewares/isAdmin");

// const signinRequire = require("../middlewares/signinRequire");

router.route("/profile").get(requireSignin, authMiddleware, profile);
router.route("/profile/:username").get(publicProfile);

module.exports = router;
