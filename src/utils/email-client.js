const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, htmlMessage) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: subject,
    html: htmlMessage
  });
  console.log("email sent successfully");
};

module.exports = {sendEmail};
