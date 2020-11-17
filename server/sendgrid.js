require("dotenv").config();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMail(email, verificationToken) {
  await sgMail
    .send({
      to: email,
      from: process.env.MAIL_SENDER,
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: `<strong>Please verificate your email http://localhost:3000/api/auth/verify/${verificationToken}</strong>`,
    })
    .then(() => {
      console.log("Email sent");
    })
    .catch(error => {
      console.error(error);
    });
}
module.exports = sendMail;
