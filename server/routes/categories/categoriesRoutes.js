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
const signinRequire = require("../../middlewares/signinRequire");
const isAdmin = require("../../middlewares/isAdmin");

router
  .route("/category")
  .post(
    categoryCreateValidator,
    runValidation,
    signinRequire,
    isAdmin,
    createCategory
  );

router.route("/categories").get(allCategories);
router.route("/category/:slug").get(singleCategory);
router.route("/category/:slug").delete(signinRequire, isAdmin, deleteCategory);

module.exports = router;
