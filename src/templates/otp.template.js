const otpTemplate = ({
  username,
  otp,
  expiryMinutes = 15,
}) => {
  return `
    <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 20px;
        border: 1px solid #e5e5e5;
        border-radius: 10px;
      "
    >
      <h2 style="color: #333;">
        OTP Verification
      </h2>

      <p>Hello ${username || "User"},</p>

      <p>
        Your verification code is:
      </p>

      <div
        style="
          font-size: 32px;
          font-weight: bold;
          color: #2563eb;
          margin: 20px 0;
        "
      >
        ${otp}
      </div>

      <p>
        This OTP will expire in
        ${expiryMinutes} minutes.
      </p>

      <p>
        If you did not request this,
        please ignore this email.
      </p>
    </div>
  `;
};

module.exports = otpTemplate;