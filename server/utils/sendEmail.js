const sgMail = require("@sendgrid/mail");

const sendEmail = (req, res, msg) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      res.status(200).json({ success: true });
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendEmail;
