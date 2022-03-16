const express = require("express");
const router = express.Router();

// Imported Controllers functions
const { profile } = require("../controllers/userController");

// Authentication middleware
const signinRequire = require("../middlewares/signinRequire");
const isAdmin = require("../middlewares/isAdmin");

router.route("/profile").get(signinRequire, profile);

module.exports = router;
