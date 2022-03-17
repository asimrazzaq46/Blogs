const express = require("express");
const router = express.Router();

// Imported Controllers functions
const { profile } = require("../controllers/userController");

// Authentication middleware
const { requireSignin } = require("../middlewares/signinRequire");
const { authMiddleware } = require("../middlewares/isAdmin");

// const signinRequire = require("../middlewares/signinRequire");

router.route("/profile").get(requireSignin, authMiddleware, profile);

module.exports = router;
