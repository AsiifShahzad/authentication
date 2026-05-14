import nodemailer from "nodemailer";
import {
  otpTemplate,
  welcomeTemplate,
} from "../templates/index.js";

console.log("EMAIL USER:", process.env.EMAIL_USER);
console.log("EMAIL PASS EXISTS:", !!process.env.EMAIL_PASS);

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

/**
 * TEMPLATE ROUTER
 */
const getTemplate = (type, data) => {
  switch (type) {
    // SIGNUP OTP
    case "OTP_VERIFICATION":
      return {
        subject: "Verify Your Email",
        html: otpTemplate({
          ...data,
          purpose: "ACCOUNT VERIFICATION",
        }),
      };

    // FORGOT PASSWORD OTP (NEW)
    case "PASSWORD_RESET":
      return {
        subject: "Reset Your Password 🔐",
        html: otpTemplate({
          ...data,
          purpose: "PASSWORD RESET",
        }),
      };

    // WELCOME EMAIL
    case "WELCOME_EMAIL":
      return {
        subject: "Welcome to Our Platform 🎉",
        html: welcomeTemplate(data),
      };

    default:
      throw new Error(
        `Unknown email type: ${type}`
      );
  }
};


 //SEND EMAIL
export const sendEmail = async ({
  to,
  type,
  data,
}) => {
  const { subject, html } = getTemplate(
    type,
    data
  );

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};