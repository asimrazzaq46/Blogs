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
const signinRequire = require("../../middlewares/signinRequire");
const isAdmin = require("../../middlewares/isAdmin");

router
  .route("/tag")
  .post(tagsCreateValidator, runValidation, signinRequire, isAdmin, createTag);
router.route("/tags").get(allTags);
router.route("/tag/:slug").get(oneTag);
router.route("/tag/:slug").delete(signinRequire, isAdmin, deleteTag);

module.exports = router;
