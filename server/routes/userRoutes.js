const express = require("express");
const router = express.Router();

// Imported Controllers functions
const {
  profile,
  publicProfile,
  updateProfile,
  profilePhoto,
} = require("../controllers/userController");

// Authentication middleware
const { requireSignin } = require("../middlewares/signinRequire");
const { authMiddleware } = require("../middlewares/isAdmin");

// const signinRequire = require("../middlewares/signinRequire");

router.route("/profile").get(requireSignin, authMiddleware, profile);
router.route("/profile/:username").get(publicProfile);
router
  .route("/profile/update")
  .put(requireSignin, authMiddleware, updateProfile);
router.route("/profile/photo/:username").get(profilePhoto);

module.exports = router;
