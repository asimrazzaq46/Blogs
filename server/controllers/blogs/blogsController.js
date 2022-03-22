const Blog = require("../../models/blog");
const Category = require("../../models/category");
const Tags = require("../../models/blog");

//external libraries
const formidable = require("formidable");
const slugify = require("slugify");
const { stripHtml } = require("string-strip-html");
const _ = require("lodash");
const fs = require("fs");

//catching errors
const catchAsynError = require("../../middlewares/catchAsncError");
const { errorHandler } = require("../../utils/dbErrorHandlers");
const { smartTrim } = require("../../utils/blog");

// //Create Blog
exports.createBlog = catchAsynError(async (req, res) => {
  // handling the form with formidable package
  let form = new formidable.IncomingForm();
  //   keeping the extensions example jpg pdf png
  form.keepExtensions = true;
  try {
    // parsing the data and handling them
    form.parse(req, async (err, fields, files) => {
      //   handling error in case if there is any
      if (err) {
        return res.status(400).json({
          error: "Image could not upload",
        });
      }

      // handling fields
      const { title, body, categories, tags } = fields;

      if (!title || !title.length) {
        return res.status(404).json({ error: "Title is required" });
      }
      if (!body || body.length < 200) {
        return res.status(404).json({ error: "content is too short" });
      }
      if (!categories || categories.length === 0) {
        return res
          .status(404)
          .json({ error: "Atleast 1 category is required" });
      }

      if (!tags || tags.length === 0) {
        return res.status(404).json({ error: "Atleast 1 tag is required" });
      }
      let arrayCategories = categories && categories.split(",");
      let arrayTags = tags && tags.split(",");

      const slug = slugify(title).toLowerCase();
      const mtitle = `${title} | ${process.env.APP_NAME}`;
      const mdesc = stripHtml(body.substring(0, 160)).result;
      const excerpt = smartTrim(body, 320, " ", " ...");
      const postedBy = req.user._id;
      let photo = {};
      // handling files / photos
      if (files.photo) {
        //if size is bigger than 1 mb
        if (files.photo.size > 10000000) {
          return res.status(400).json({
            error: "image size should be less than 1mb.",
          });
        }

        photo.data = fs.readFileSync(files.photo.filepath);
        photo.contentType = files.photo.mimetype;
      }

      const blog = await Blog.create({
        title,
        body,
        postedBy,
        slug,
        mdesc,
        mtitle,
        excerpt,
        photo,
      });

      const newBlog = await Blog.findOneAndUpdate(
        { _id: blog._id },
        { $push: { categories: arrayCategories, tags: arrayTags } },
        { new: true }
      );

      res.status(201).json(newBlog);
    });
  } catch (err) {
    res.status(404).json({
      error: errorHandler(err),
    });
  }
});
