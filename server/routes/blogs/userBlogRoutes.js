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
  searchBlog,
} = require("../../controllers/blogs/blogsController");

// Authentication middleware
const { requireSignin } = require("../../middlewares/signinRequire");
const { authMiddleware } = require("../../middlewares/isAdmin");

router.route("/user/blog").post(requireSignin, authMiddleware, createBlog);
router
  .route("/user/blog/:slug")
  .delete(requireSignin, authMiddleware, deleteBlog);
router.route("/user/blog/:slug").put(requireSignin, authMiddleware, updateBlog);

module.exports = router;
