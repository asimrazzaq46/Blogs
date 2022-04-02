const express = require("express");
const router = express.Router();

// Imported Controllers functions
const {
  contactForm,
  contactBlogAuthor,
} = require("../controllers/formController");

//Validatators middleware
const { runValidation } = require("../validators");
const { contactFormValidator } = require("../validators/formValidator");

// Authentication middleware
const { requireSignin } = require("../middlewares/signinRequire");
const { authMiddleware } = require("../middlewares/isAdmin");

router.route("/contact").post(contactFormValidator, runValidation, contactForm);
router
  .route("/contact-blog-author")
  .post(contactFormValidator, runValidation, contactBlogAuthor);

module.exports = router;
