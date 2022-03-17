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
const { requireSignin } = require("../middlewares/signinRequire");
const { isAdmin } = require("../middlewares/isAdmin");

// const signinRequire = require("../middlewares/signinRequire");
// const isAdmin = require("../middlewares/isAdmin");

router.route("/signup").post(userSignupValidator, runValidation, signUp);
router.route("/signin").post(userSigninValidator, runValidation, signIn);
router.route("/signout").get(signOut);

router.route("/admin").get(requireSignin, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

router.route("/test").get(requireSignin, (req, res) => {
  console.log(req.user);
});

module.exports = router;
