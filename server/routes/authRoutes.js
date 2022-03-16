const express = require("express");
const router = express.Router();

// Imported Controllers functions
const { signUp, signIn, signOut } = require("../controllers/authController");

//Validatators middleware
const { runValidation } = require("../validators");
const {
  userSignupValidator,
  userSigninValidator,
} = require("../validators/authValidators");

// Authentication middleware
const signinRequire = require("../middlewares/signinRequire");
const isAdmin = require("../middlewares/isAdmin");

router.route("/signup").post(userSignupValidator, runValidation, signUp);
router.route("/signin").post(userSigninValidator, runValidation, signIn);
router.route("/signout").get(signOut);

router.route("/admin").get(signinRequire, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

module.exports = router;
