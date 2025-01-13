export const emailTemplate = (otp, username) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .email-container {
      font-family: Arial, sans-serif;
      color: #333;
      max-width: 600px;
      margin: auto;
      border: 1px solid #ddd;
      padding: 20px;
      border-radius: 10px;
    }
    .header {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #007BFF;
    }
    .footer {
      font-size: 12px;
      margin-top: 20px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <p class="header">Hello ${username},</p>
    <p>Thank you for signing up! Please verify your email address using the OTP below:</p>
    <p class="otp">${otp}</p>
    <br/><br/>
    <p>It is valid only for 15 min.</p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <p class="footer">Best regards,<br>Confession App </p>
  </div>
</body>
</html>
`;
