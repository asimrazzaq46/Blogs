const User = require("../models/users");

// const isAdmin = (req, res, next) => {
//   //assigned req.profile on signinrequire middleware...if the user is authenticated then req.profile = Loggedin user
//   if (req.profile.role !== 1) {
//     //if logged in user's role is not equal to 1 then he is not an admin...by default it's 0 which means (user)
//     return res.status(404).json({ error: "Not Admin! , access denied" });
//   }
//   next();
// };

// module.exports = isAdmin;

exports.authMiddleware = async (req, res, next) => {
  const authUserId = req.user._id;
  const user = await User.findById({ _id: authUserId });

  if (err || !user) {
    return res.status(400).json({
      error: "User not found",
    });
  }
  req.profile = user;
  next();
};

exports.isAdmin = async (req, res, next) => {
  const adminUserId = req.user._id;
  const user = await User.findOne({ _id: adminUserId });

  if (!user) {
    return res.status(400).json({
      error: "User not found",
    });
  }

  if (user.role !== 1) {
    return res.status(400).json({
      error: "Admin resource. Access denied",
    });
  }

  req.profile = user;
  next();
};
