const jwt = require("jsonwebtoken");
const User = require("../models/users");
const catchAsyncError = require("./catchAsncError");

const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(404).json({
      error: "please Login!",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.profile = await User.findById(decoded._id);

  next();
});

module.exports = isAuthenticated;
