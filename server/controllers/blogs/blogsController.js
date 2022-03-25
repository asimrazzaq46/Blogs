const Blog = require("../../models/blog");
const Category = require("../../models/category");
const Tags = require("../../models/tags");

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

////////////////////////////////// CREATE BLOG /////////////////////////
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

////////////////////////////////// LIST OF ALL BLOGS /////////////////////////

exports.getAllBlog = catchAsynError(async (req, res) => {
  const blog = await Blog.find()
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username")
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    );

  if (!blog) {
    res.status(404).json({ error: "No Blog is Found" });
  }
  res.status(200).json({ blog });
});

////////////////////////////////// LIST BLOGS WITH CATEGORIES AND TAGS /////////////////////////

exports.getAllBlogsCategoriesTags = catchAsynError(async (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  const blogs = await Blog.find()
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username profile")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(
      "_id title slug excerpt categories tags postedBy createdAt updatedAt"
    );
  if (!blogs) {
    res.status(404).json({ error: "No Blog is Found" });
  }

  const categories = await Category.find();
  if (!categories) {
    res.status(404).json({ error: "No category is Found!" });
  }

  const tags = await Tags.find();

  if (!tags) {
    res.status(404).json({ error: "No Tags Found!" });
  }

  res.status(200).json({ blogs, categories, tags, size: blogs.length });
});

////////////////////////////////// GET SINGLE BLOG  /////////////////////////

exports.getSingleBlog = catchAsynError(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug.toLowerCase() })
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name username profile")
    .select(
      "_id title body slug excerpt mtitle mdesc categories tags postedBy createdAt updatedAt"
    );
  if (!blog) {
    res.status(404).json("No blog found!");
  }
  res.status(200).json(blog);
});

////////////////////////////////// DELETE SINGLE BLOG  /////////////////////////

exports.deleteBlog = catchAsynError(async (req, res) => {
  const blog = await Blog.findOneAndDelete({
    slug: req.params.slug.toLowerCase(),
  });
  if (!blog) {
    res.status(404).json({ error: "blog is already removed." });
  }
  res.status(200).json({
    message: "Deleted Successfuly",
  });
});

////////////////////////////////// UPDATE SINGLE BLOG  /////////////////////////

exports.updateBlog = catchAsynError(async (req, res) => {
  const slug = req.params.slug.toLowerCase();

  let oldBlog = await Blog.findOne({ slug });
  if (!oldBlog) {
    res.status(404).json({ error: "No Blog is found!" });
  }

  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  //parsing the forms
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(404).json({ error: "Image could not uploaded" });
    }

    // saving the slug before modified because we don't want to change the slug for SEO purpose
    let slug = oldBlog.slug;
    oldBlog = _.merge(oldBlog, fields);
    oldBlog.slug = slug; // saving old slug again in database

    const { body, title, categories, tags } = fields;

    // if we modify the body then we will create new excerpt and meta description
    if (body) {
      oldBlog.excerpt = smartTrim(body, 320, " ", " ...");
      oldBlog.mdesc = stripHtml(body.substring(0, 160)).result;
    }

    //Updating the categories
    if (categories) {
      oldBlog.categories = categories.split(",");
    }

    //Updating the Tags
    if (tags) {
      oldBlog.tags = tags.split(",");
    }

    if (title) {
      oldBlog.title = title;
    }

    if (files.photo) {
      if (files.photo.size > 10000000) {
        res
          .status(400)
          .json({ error: "Image size cannot be greater than 1mb." });
      }
      oldBlog.photo.data = fs.readFileSync(files.photo.filepath);
      oldBlog.photo.contentType = files.photo.mimetype;
    }
    oldBlog.save();

    res.status(200).json(oldBlog);
  });
});

exports.getBlogPhoto = catchAsynError(async (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const blog = await Blog.findOne({ slug }).select("photo");
  if (!blog) {
    res.status(404).json({ error: "Blog not found!" });
  }
  res
    .status(200)
    .set("Content-Type", blog.photo.contentType)
    .send(blog.photo.data);
});
