const express = require("express");
const router = express.Router();

// Imported Controllers functions
const {
  createBlog,
  getAllBlog,
  getAllBlogsCategoriesTags,
  getSingleBlog,
  deleteBlog,
  updateBlog,
  getBlogPhoto,
  relatedBlogs,
} = require("../../controllers/blogs/blogsController");

// Authentication middleware
const { requireSignin } = require("../../middlewares/signinRequire");
const { isAdmin } = require("../../middlewares/isAdmin");

router.route("/blog").post(requireSignin, isAdmin, createBlog);
router.route("/blogs").get(getAllBlog);
router.route("/blogs-categories-tags").post(getAllBlogsCategoriesTags);
router.route("/blog/:slug").get(getSingleBlog);
router.route("/blog/:slug").delete(requireSignin, isAdmin, deleteBlog);
router.route("/blog/:slug").put(requireSignin, isAdmin, updateBlog);
router.route("/blog/photo/:slug").get(getBlogPhoto);
router.route("/blog/related").post(relatedBlogs);

module.exports = router;
