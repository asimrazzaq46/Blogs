const User = require("../models/users");
const Blog = require("../models/blog");
const catchAsncError = require("../middlewares/catchAsncError");

exports.profile = (req, res) => {
  console.log(`user profile`, req.profile);
  res.status(200).json({ user: req.profile });
};

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
