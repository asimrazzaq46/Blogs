const express = require("express");
const router = express.Router();

// Imported Controllers functions
const { createBlog } = require("../../controllers/blogs/blogsController");

// Authentication middleware
const { requireSignin } = require("../../middlewares/signinRequire");
const { isAdmin } = require("../../middlewares/isAdmin");

router.route("/blog").post(requireSignin, isAdmin, createBlog);

module.exports = router;
