const welcomeTemplate = ({ username }) => {
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
      <h2 style="color: #16a34a;">
        Welcome to Our Platform 🎉
      </h2>

      <p>
        Hello ${username},
      </p>

      <p>
        Your account has been successfully created.
      </p>

      <p>
        We're excited to have you onboard.
      </p>

      <p>
        Thank you for joining us.
      </p>
    </div>
  `;
};

module.exports = welcomeTemplate;