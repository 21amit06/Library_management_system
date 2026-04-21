const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
     to: "student@gmail.com",
  subject: "Book Borrowed",
  text: "You borrowed a book successfully"
    });
  } catch (err) {
    console.log("Email error:", err.message);
  }
};