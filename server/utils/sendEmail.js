const sgMail = require("@sendgrid/mail");

const sendEmail = (msg) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendEmail;
