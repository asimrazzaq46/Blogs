const express = require("express");
const router = express.Router();

// Imported Controllers functions
const {
  createTag,
  allTags,
  oneTag,
  deleteTag,
} = require("../../controllers/tags/tagsController");

//Validatators middleware
const { runValidation } = require("../../validators");
const { tagsCreateValidator } = require("../../validators/tagsValidator");

// Authentication middleware
const { requireSignin } = require("../../middlewares/signinRequire");
const {isAdmin} = require("../../middlewares/isAdmin");

// const signinRequire = require("../../middlewares/signinRequire");
// const isAdmin = require("../../middlewares/isAdmin");

router
  .route("/tag")
  .post(tagsCreateValidator, runValidation, requireSignin, isAdmin, createTag);
router.route("/tags").get(allTags);
router.route("/tag/:slug").get(oneTag);
router.route("/tag/:slug").delete(requireSignin, isAdmin, deleteTag);

module.exports = router;
