const User = require("../models/users");
const Blog = require("../models/blog");
const shortId = require("shortid");
const catchAsynError = require("../middlewares/catchAsncError");
const sendEmail = require("../utils/sendEmail");

const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
dotenv.config();

/////////////////// Confirm the user before saving into the database  /////////////////////
exports.preSignUp = catchAsynError(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (user) {
    return res.status(400).json({ error: "This Email has already exist." });
  } else {
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_CONFIRM_EMAIL_EXPIRE_TIME,
      }
    );

    const msg = {
      to: email, // Change to your recipient
      from: process.env.Email_FROM, // Change to your verified sender
      subject: `Account Acctivation Link.`,
      html: `
      <h3>Please click on this following link to activate your account.</h3>
      <a>${process.env.CLIENT_URL}/auth/account/activate/${token}</a>
      <p>Sender Email: ${process.env.Email_FROM}</p>
      <hr/>
      <p>This email may contain sensitive information</p>
      `,
    };
    sendEmail(msg);
    res.status(200).json({
      success: true,
      message: `Email has been sent to your ${email}.\nclick on the link to activate your account.\nLink expires in 10 minutes`,
    });
  }
});

/////////////////// Creating new User Route/////////////////////

// exports.signUp = catchAsynError(async (req, res) => {
//   const { name, email, password, role } = req.body;
//   //if email is already exist then returning with an error
//   const userExist = await User.findOne({ email });
//   if (userExist) {
//     return res.status(404).json({ error: "Email is already exist" });
//   }

//   //capitalize the First letter of name
//   const nameCap = name.split(" ");

//   const newName =
//     nameCap[0].charAt(0).toUpperCase() +
//     nameCap[0].slice(1) +
//     " " +
//     nameCap[1].charAt(0).toUpperCase() +
//     nameCap[1].slice(1);

//   // creating unique username everytime and saving them into database for every new users
//   let username = shortId.generate();
//   let profile = `${process.env.CLIENT_URL}/profile/${username}`;

//   await User.create({
//     name: newName,
//     email,
//     password,
//     profile,
//     username,
//     role,
//   });
//   res.status(201).json({
//     success: true,
//     message: "congratulation,User is created successfully.",
//   });
// });

exports.signUp = catchAsynError(async (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      async function (err, decoded) {
        if (err) {
          return res
            .status(400)
            .json({ error: "Your Link is expired! please try again." });
        } else {
          const { name, email, password } = jwt.decode(token);
          const nameCap = name.split(" ");
          const newName =
            nameCap[0].charAt(0).toUpperCase() +
            nameCap[0].slice(1) +
            " " +
            nameCap[1].charAt(0).toUpperCase() +
            nameCap[1].slice(1);
          let username = shortId.generate();
          let profile = `${process.env.CLIENT_URL}/profile/${username}`;
          await User.create({
            name: newName,
            email,
            password,
            profile,
            username,
          });
          res.status(201).json({
            success: true,
            message:
              "congratulation,User is created successfully. please signin.",
          });
        }
      }
    );
  }
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
    <p>Warning: if you not asked for the password then ignore.</p>
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

///////////////////////// GOOGLE LOGIN (O'Auth) ///////////////////////

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);
exports.googleSignin = catchAsynError(async (req, res) => {
  // On google login we pass the idTOken to the backend from frontend

  const idToken = req.body.tokenId;

  //then with verifyIdToken function we are going to verify if the token is valid or not

  const response = await client.verifyIdToken({
    idToken,
    audience: process.env.OAUTH_CLIENT_ID,
  });

  //  if it0s valid then destructrue the properties we need from the payload

  const { email_verified, name, email, jti } = response.payload;

  //then checking the email is verified or not ===> response will be true or false

  if (email_verified) {
    // if email is verified then check do we have this user already in our database?

    const user = await User.findOne({ email });

    if (user) {
      //if we do then destructure the properties we need to send back to the frontend

      const { _id, email, name, role, username } = user;

      // Generate the JWT token on login

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
      });

      const options = {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: false,
      };
      // and set the token in cookies and then send the token and user back as a json payload

      res
        .status(200)
        .cookie("token", token, options)
        .json({ token, user: { _id, email, name, role, username } });
    } else {
      //in case if it's first time and the user is not saved in our database then create the user in database

      //Capitalize the first letter of name
      const nameCap = name.split(" ");
      const newName =
        nameCap[0].charAt(0).toUpperCase() +
        nameCap[0].slice(1) +
        " " +
        nameCap[1].charAt(0).toUpperCase() +
        nameCap[1].slice(1);
      //create username and profile
      let username = shortId.generate();
      let profile = `${process.env.CLIENT_URL}/profile/${username}`;
      let password = jti;
      const user = await User.create({
        name: newName,
        email,
        password,
        profile,
        username,
      });

      await user.save((err, data) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "something went wrong! please try again." });
        } else {
          const { _id, email, name, role, username } = data;
          // Generate the JWT token on login
          const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: process.env.JWT_EXPIRE_TIME,
            }
          );

          const options = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
            secure: false,
          };
          // and set the token in cookies and then send the token and user back as a json payload
          return res
            .status(200)
            .cookie("token", token, options)
            .json({ token, user: { _id, email, name, role, username } });
        }
      });
    }
  } else {
    return res.status(404).json({ error: "Google login failed." });
  }
});
