const isAdmin = (req, res, next) => {
  //assigned req.profile on signinrequire middleware...if the user is authenticated then req.profile = Loggedin user
  if (req.profile.role !== 1) {
    //if logged in user's role is not equal to 1 then he is not an admin...by default it's 0 which means (user)
    return res.status(404).json({ error: "Not Admin! , access denied" });
  }
  next();
};

module.exports = isAdmin;
