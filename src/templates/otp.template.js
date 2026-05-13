export const otpTemplate = ({
  username,
  otp,
  expiryMinutes = 15,
  purpose = "ACCOUNT VERIFICATION",
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
        background-color: #ffffff;
      "
    >
      <h2 style="color: #333; text-align:center;">
        ${purpose}
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
          text-align: center;
          letter-spacing: 5px;
        "
      >
        ${otp}
      </div>

      <p>
        This OTP will expire in
        <b>${expiryMinutes} minutes</b>.
      </p>

      <p style="color: #777;">
        If you did not request this, please ignore this email.
      </p>
    </div>
  `;
};