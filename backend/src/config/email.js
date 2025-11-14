const nodemailer = require("nodemailer");

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify email configuration
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email service is ready");
  } catch (error) {
    console.error("❌ Email service error:", error);
  }
};

module.exports = { transporter, verifyEmailConfig };
