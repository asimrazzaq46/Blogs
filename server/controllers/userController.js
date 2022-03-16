exports.profile = (req, res) => {
    
  console.log(req);
  res.status(200).json({ user: req.profile });
};
