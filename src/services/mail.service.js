const nodemailer = require("nodemailer");

const { otpTemplate , welcomeTemplate} = require("../templates");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
//template router
const getTemplate = (type, data) => {
  switch (type) {
    case "OTP_VERIFICATION":
      return {
        subject: "Verify Your Email",
        html: otpTemplate(data),
      };

    case "WELCOME_EMAIL":
      return {
        subject: "Welcome to Our Platform 🎉",
        html: welcomeTemplate(data),
      };

    default:
      throw new Error(`Unknown email type: ${type}`);
  }
};


const sendEmail = async ({ to, type, data }) => {
  const { subject, html } = getTemplate(type, data);
console.log("MAIL DATA:", data);
  await transporter.sendMail({
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = {
  sendEmail,
};