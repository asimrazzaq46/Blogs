const User = require("../models/users");
const Blog = require("../models/blog");
const sendEmail = require("../utils/sendEmail");
const catchAsncError = require("../middlewares/catchAsncError");

exports.contactForm = catchAsncError(async (req, res) => {
  const { name, email, message } = req.body;
  console.log(`${process.env.Email_TO}`);
  const msg = {
    to: process.env.Email_TO, // Change to your recipient
    from: process.env.Email_FROM, // Change to your verified sender
    subject: `Contact from ${process.env.APP_NAME}`,
    text: `Email recived from contact form \n Sender Name: ${name} \n Sender Email: ${process.env.Email_FROM} \nSender message: ${message}`,
    html: `
    <h4>Email recived from contact form:</h4>
    <p>Sender Name: ${name}</p>
    <p>Sender Email: ${process.env.Email_FROM}</p>
    <p>Sender Message: ${message}</p>
    <hr/>
    <p>This email may contain sensitive information</p>
    `,
  };
  sendEmail(msg);
  res.status(200).json({ success: true });
});

exports.contactBlogAuthor = catchAsncError(async (req, res) => {
  const { AuthorEmail, name, email, message } = req.body;
  console.log(`${process.env.Email_TO}`);
  const msg = {
    to: AuthorEmail, // Change to your recipient
    from: process.env.Email_FROM, // Change to your verified sender
    subject: `Someone messaged you from ${process.env.APP_NAME}`,
    text: `Email recived from contact form \n Sender Name: ${name} \n Sender Email: ${process.env.Email_FROM} \nSender message: ${message}`,
    html: `
      <h4>Message recived from:</h4>
      <p>Name: ${name}</p>
      <p>Email: ${process.env.Email_FROM}</p>
      <p>Message: ${message}</p>
      <hr/>
      <p>This email may contain sensitive information</p>
      `,
  };
  sendEmail(msg);
  res.status(200).json({ success: true });
});
