exports.profile = (req, res) => {
    console.log(`user profile`,req.profile);
  res.status(200).json({ user: req.profile });
};
