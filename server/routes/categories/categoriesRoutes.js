const express = require("express");

const router = express.Router();

// Imported Controllers functions
const {
  createCategory,
  allCategories,
  singleCategory,
  deleteCategory,
} = require("../../controllers/categories/categoriesControllers");

//Validatators middleware
const { runValidation } = require("../../validators");
const {
  categoryCreateValidator,
} = require("../../validators/categoryValidator");

// Authentication middleware
const { requireSignin } = require("../../middlewares/signinRequire");
const { isAdmin } = require("../../middlewares/isAdmin");



router.route("/category").post(
  categoryCreateValidator,
  runValidation,
  requireSignin,
  isAdmin,
  createCategory
);

router.route("/categories").get(allCategories);
router.route("/category/:slug").get(singleCategory);
router.route("/category/:slug").delete(requireSignin, isAdmin, deleteCategory);

module.exports = router;
