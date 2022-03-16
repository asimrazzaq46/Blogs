const User = require("../models/users");
const shortId = require("shortid");
const catchAsynError = require("../middlewares/catchAsncError");

const dotenv = require("dotenv");
dotenv.config();

/////////////////// Creating new User Route/////////////////////

exports.signUp = catchAsynError(async (req, res) => {
  const { name, email, password, role } = req.body;
  //if email is already exist then returning with an error
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(404).json({ error: "Email is already exist" });
  }

  // creating unique username everytime and saving them into database for every new users
  let username = shortId.generate();
  let profile = `${process.env.CLIENT_URL}/profile/${username}`;

  await User.create({
    name,
    email,
    password,
    profile,
    username,
    role,
  });
  res.status(201).json({
    success: true,
    message: "congratulation,User is created successfully.",
  });
});

/////////////////// SignIn User Route/////////////////////

exports.signIn = catchAsynError(async (req, res) => {
  const { email, password } = req.body;

  // checking if email or password is provided in login form or not
  if (!email || !password) {
    return res.status(404).json({
      error: "Email and Password is required.",
    });
  }

  // checking if provided email is exist in database or not
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      error: "Email or Password is incorrect.",
    });
  }

  // checking if the provided password is matched or not P.S( authenticate is a method we created in user models )
  const passwordIsMatched = await user.authenticate(password);
  if (!passwordIsMatched) {
    return res.status(404).json({
      error: "Email or Password is incorrect.",
    });
  }

  const token = await user.getJwtToken();
  //TO-DO httpOnly:true
  const options = {
    expireIn: "1d",
    httpOnly: true,
    secure: false,
  };

  const { _id, username, name, role } = user;

  res
    .status(200)
    .cookie("token", token, options)
    .json({ user: { _id, username, name, role, email: user.email }, token });
});

/////////////////// SignOut User Route/////////////////////

exports.signOut = catchAsynError(async (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Succefully." });
});
