const User = require("../models/users");
const Blog = require("../models/blog");
const shortId = require("shortid");
const catchAsynError = require("../middlewares/catchAsncError");
const sendEmail = require("../utils/sendEmail");

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
dotenv.config();

/////////////////// Confirm the user before saving into the database  /////////////////////
exports.preSignUp = catchAsynError(async (req, res) => {
  const { name, email, password } = req.body;
  email = email.toLowerCase();
  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ error: "This Email has already exist." });
  } else {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_CONFIRM_EMAIL_EXPIRE_TIME,
    });
  }
});

/////////////////// Creating new User Route/////////////////////

exports.signUp = catchAsynError(async (req, res) => {
  const { name, email, password, role } = req.body;
  //if email is already exist then returning with an error
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(404).json({ error: "Email is already exist" });
  }

  //capitalize the First letter of name
  const nameCap = name.split(" ");

  const newName =
    nameCap[0].charAt(0).toUpperCase() +
    nameCap[0].slice(1) +
    " " +
    nameCap[1].charAt(0).toUpperCase() +
    nameCap[1].slice(1);

  // creating unique username everytime and saving them into database for every new users
  let username = shortId.generate();
  let profile = `${process.env.CLIENT_URL}/profile/${username}`;

  await User.create({
    name: newName,
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
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
    ),
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

/////////////////// FORGOT PASSWORD /////////////////////

exports.forgotPassword = catchAsynError(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ success: false, error: "Email is not valid!" });
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_FORGOT_PASSWORD_EXPIRE_TIME,
  });

  const msg = {
    to: email, // Change to your recipient
    from: process.env.Email_FROM, // Change to your verified sender
    subject: `Password Reset Link.`,
    html: `
    <h3>Please click on this following link to reset your password.</h3>
    <a>${process.env.CLIENT_URL}/auth/password/reset/${token}</a>
    <p>Sender Email: ${process.env.Email_FROM}</p>
    <p>alert: if you not asked for the password don't click.</p>
    <hr/>
    <p>This email may contain sensitive information</p>
    `,
  };
  const updateResetPassword = await user.updateOne({
    resetPasswordLink: token,
  });

  if (!updateResetPassword) {
    return res.status(400).json({ error: "Password has not been updated." });
  } else {
    sendEmail(msg);
    return res.status(200).json({
      success: true,
      message: `Email has been sent to ${email}. Follow the instructions to reset your password.
      Link expires in 10 minutes.`,
      user,
    });
  }
});

/////////////////// RESET PASSWORD /////////////////////

exports.resetPassword = catchAsynError(async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  let user;

  if (!resetPasswordLink) {
    return res.status(400).json({ error: "link is expired, try again." });
  }

  // resetPasswordLink is the link we sent on the forget-password controller
  if (resetPasswordLink) {
    //verifying the token we recived is still valid or not

    jwt.verify(
      resetPasswordLink,
      process.env.JWT_SECRET_KEY,
      async function (err, decoded) {
        //if it's not valid than throw an error otherwise find the user in database
        if (err) {
          return res.status(401).json({
            error: "Expired link. Try again",
          });
        }
        user = await User.findOne({ resetPasswordLink });

        if (!user) {
          return res.status(403).json({ error: "User not found" });
        } else {
          const updatedFields = {
            password: newPassword,
            resetPasswordLink: "",
          };
          user = _.extend(user, updatedFields);
          user.save((err, result) => {
            if (err) {
              return res
                .status(400)
                .json({ error: "something went wrong. please try later." });
            } else {
              return res.status(200).json({
                message: "password is changed, Signin with new password.",
              });
            }
          });
        }
      }
    );
  }
});
