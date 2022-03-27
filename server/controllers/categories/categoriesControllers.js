const Category = require("../../models/category");
const catchAsynError = require("../../middlewares/catchAsncError");
const { errorHandler } = require("../../utils/dbErrorHandlers");

const slugify = require("slugify");

// CREATE CATEGORY

exports.createCategory = catchAsynError(async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name).toLowerCase();
  try {
    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (err) {
    res.status(404).json({
      error: errorHandler(err),
    });
  }
});

//ALL CATEGORY
exports.allCategories = catchAsynError(async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(404).json({ error: errorHandler(error) });
  }
});

//Single CATEGORY
exports.singleCategory = catchAsynError(async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug.toLowerCase(),
    });
    if (!category) {
      return res.status(404).json({ error: "Category not exist." });
    }
    console.log(`backend `, category);
    res.status(200).json(category);
  } catch (error) {
    res.status(404).json({ error: errorHandler(error) });
  }
});

// DELETE CATEGORY
exports.deleteCategory = catchAsynError(async (req, res) => {
  try {
    const category = await Category.find({
      slug: req.params.slug.toLowerCase(),
    });
    if (!category.length) {
      return res.status(404).json({ error: "Category not exist." });
    }
    await Category.findOneAndDelete({ slug: req.params.slug.toLowerCase() });
    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {
    res.status(404).json({ error: errorHandler(error) });
  }
});
