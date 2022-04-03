const express = require("express");
const router = express.Router();

// Imported Controllers functions
const {
  preSignUp,
  signUp,
  signIn,
  signOut,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

//Validatators middleware
const { runValidation } = require("../validators");
const {
  userSignupValidator,
  userSigninValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
} = require("../validators/authValidators");

// Authentication middleware
const { requireSignin } = require("../middlewares/signinRequire");
const { isAdmin } = require("../middlewares/isAdmin");

// const signinRequire = require("../middlewares/signinRequire");
// const isAdmin = require("../middlewares/isAdmin");

router.route("/pre-signup").post(userSignupValidator, runValidation, preSignUp);
router.route("/signup").post(userSignupValidator, runValidation, signUp);
router.route("/signin").post(userSigninValidator, runValidation, signIn);
router.route("/signout").get(signOut);
router
  .route("/forgot-password")
  .put(forgetPasswordValidator, runValidation, forgotPassword);
router
  .route("/reset-password")
  .put(resetPasswordValidator, runValidation, resetPassword);

module.exports = router;
