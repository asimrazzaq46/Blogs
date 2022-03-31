const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

const User = require("../models/users");
const Blog = require("../models/blog");
const catchAsncError = require("../middlewares/catchAsncError");

exports.profile = (req, res) => {
  const user = req.profile;
  if (!user) {
    return res.status(404).json({ error: "No User Found!" });
  }
  return res.status(200).json(user);
};

////////////////////////////// PUBLIC PROFILE /////////////////////

exports.publicProfile = catchAsncError(async (req, res) => {
  let { username } = req.params;
  const user = await User.findOne({ username }).select(
    "-hashed_password -salt"
  );
  if (!user) {
    return res.status(404).json({ error: "No User Found!" });
  }
  user.photo = undefined;
  const blogs = await Blog.find({ postedBy: user._id })
    .populate("categories", "_id name slug")
    .populate("tags", "_id name slug")
    .populate("postedBy", "_id name")
    .limit(10)
    .select(
      "_id title slug excerpt postedBy categories tags createdAt updatedAt"
    );

  if (!blogs || !blogs.length) {
    return res
      .status(200)
      .json({ user, error: "This user have not created any blog." });
  }

  res.status(200).json({ user, blogs });
});

////////////////////////////// UPDATE PROFILE /////////////////////

exports.updateProfile = catchAsncError(async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.keepExtension = true;

    form.parse(req, async (error, fields, files) => {
      if (error) {
        return res.status(404).json({ error: "image cannot be upload" });
      }
      let user = req.profile;

      user = _.extend(user, fields);

      if (fields.password && fields.password.length < 6) {
        return res
          .status(400)
          .json({ error: "password must be 6 charecters long!" });
      }

      if (files.photo) {
        if (files.photo.size > 10000000) {
          return res
            .status(404)
            .json({ error: "image size cannot be greater than 1mb." });
        }
        user.photo.data = fs.readFileSync(files.photo.filepath);
        user.photo.contentType = files.photo.mimetype;
        console.log(user.photo.contentType);
      }
      user.save((err, result) => {
        if (err) {
          res.status(400).json({ error: "All fields are required" });
        }
        user.hashed_password = undefined;
        user.photo = undefined;
        user.salt = undefined;
        res.status(200).json(user);
      });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

////////////////////////////// GET PROFILE PHOTO /////////////////////

exports.profilePhoto = catchAsncError(async (req, res) => {
  let { username } = req.params;

  const user = await User.findOne({ username }).select("photo");
  if (!user) {
    return res.status(404).json({ error: "user is not found!" });
  }
  console.log(user.photo.contentType);
  res
    .status(200)
    .set("Content-Type", user.photo.contentType)
    .send(user.photo.data);
});
