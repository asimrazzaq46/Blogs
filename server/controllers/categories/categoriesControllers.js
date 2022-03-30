const Category = require("../../models/category");
const Blog = require("../../models/blog");
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
    const blogs = await Blog.find({ categories: category })
      .populate("categories", "_id name slug")
      .populate("tags", "_id name slug")
      .populate("postedBy", "_id name")
      .select(
        "_id title slug excerpt categories slug postedBy createdAt updatedAt"
      );

    if (!blogs || !blogs.length) {
      return res.status(404).json({ error: "No blog is found!", category });
    }

    res.status(200).json({ category, blogs });
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
