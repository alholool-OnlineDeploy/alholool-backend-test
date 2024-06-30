const axios = require("axios");
const qs = require("qs");
const jwt = require("jsonwebtoken");

// Your Zoho OAuth credentials
const client_id = process.env.ZOHO_CLIENT_ID;
const client_secret = process.env.ZOHO_CLIENT_SECRET;
const refresh_token = process.env.ZOHO_REFRESH_TOKEN;
const redirect_uri = process.env.ZOHO_REDIRECT_URI;
const account_id = process.env.ZOHO_ACCOUNT_ID;
const zoho_email = process.env.ZOHO_EMAIL_ADDRESS;

// Function to get access token using the refresh token
async function getAccessToken() {
  const tokenUrl = "https://accounts.zoho.com/oauth/v2/token";
  const data = qs.stringify({
    client_id,
    client_secret,
    refresh_token,
    grant_type: "refresh_token",
    redirect_uri,
  });

  const config = {
    method: "post",
    url: tokenUrl,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error.response.data);
    throw new Error("Failed to get access token");
  }
}

// Function to get confirmation token
function getConfirmationToken(payload) {
  const token = jwt.sign({ id: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  return token;
}

// Function to send email
async function confirmEmail(user_id, user_email) {
  const accessToken = await getAccessToken();
  const confirmationToken = await getConfirmationToken(user_id);
  url = `https://alholool-backend-test.onrender.com/api/v1/auth/confirmationEmail/${confirmationToken}`;
  data = `
<main
  style="
    display: flex;
    justify-content: center;

    flex-direction: column;
  "
>
  <style>
    main {
      font-family: "Poppins", sans-serif;
    }
  </style>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      flex-direction: row;
    "
  >
    <h1 style="text-align: center; color: #2b94fd; font-size: 17px">
      Click the button below to br confirm your registration at
    </h1>
    <div style="width: 70px; height: fit-content">
      <img
        src="https://alholool.com.sa/test_site/assets/img/logo/333.png"
        alt="logo"
        style="width: 100%; display: block"
      />
    </div>
  </div>
  <div style="display: flex; justify-content: center">
    <a
      href="${url}"
      style="
        padding: 10px;
        background-color: #2b94fd;
        color: white;
        text-decoration: none;
        border-radius: 10px;
      "
      >Confirm Email</a
    >
  </div>
  <div style="display: flex; justify-content: center">
    <img
      src="https://alholool.com.sa/test_site/assets/img/confirm-email.svg"
      alt="confirm email"
      style="width: 40%;"
    />
  </div>
</main>
`;
  const emailUrl = `https://mail.zoho.com/api/accounts/${account_id}/messages`;
  const emailData = {
    fromAddress: zoho_email,
    toAddress: user_email,
    subject: "Test Email from Zoho API",
    content: data,
  };

  const config = {
    method: "post",
    url: emailUrl,
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    data: emailData,
  };

  try {
    const response = await axios(config);
    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending email:", error.response.data);
  }
}

module.exports = confirmEmail;
