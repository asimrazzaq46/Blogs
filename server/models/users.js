const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      max: 32,
      unique: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    profile: {
      type: String,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true,
      trim: true,
    },
    salt: String,
    about: {
      type: String,
    },
    role: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  { timestamps: true }
);
// creating virual field of "password" in user Document
userSchema
  .virtual("password")
  .set(function (password) {
    const user = this;

    // Create a variable _password
    user._password = password;

    // create salt
    user.salt = user.genrateSalt();

    //create Hashed password
    user.hashed_password = user.encryptedPassword(password);
  })
  .get(function () {
    const user = this;
    return user._password;
  });

userSchema.methods = {
  encryptedPassword: function (password) {
    if (!password) return "";
    try {
      const user = this;
      return crypto
        .createHmac("sha1", user.salt)
        .update(password)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
  genrateSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },

  //compare Passwords on Sign In

  authenticate: function (password) {
    const user = this;
    // return true or false
    return user.encryptedPassword(password) === user.hashed_password;
  },

  // CREATING JSON WEB TOKENS (JWT)
  getJwtToken: function () {
    const user = this;
  
    return jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
  },
};



module.exports = mongoose.model("User", userSchema);
