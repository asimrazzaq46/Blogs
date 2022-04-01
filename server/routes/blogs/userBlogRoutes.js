const express = require("express");
const router = express.Router();

// Imported Controllers functions
const {
  createBlog,
  getAllBlogByUser,
  deleteBlog,
  updateBlog,
} = require("../../controllers/blogs/blogsController");

// Authentication middleware
const { requireSignin } = require("../../middlewares/signinRequire");
const { authMiddleware } = require("../../middlewares/isAdmin");
const { canUpdateAndDelete } = require("../../controllers/authController");
//create
router.route("/user/blog").post(requireSignin, authMiddleware, createBlog);

//LIST
router.route("/:username/blogs").get(getAllBlogByUser);

//update
router
  .route("/user/blog/:slug")
  .put(requireSignin, authMiddleware, canUpdateAndDelete, updateBlog);

//delete
router
  .route("/user/blog/:slug")
  .delete(requireSignin, authMiddleware, canUpdateAndDelete, deleteBlog);
module.exports = router;
