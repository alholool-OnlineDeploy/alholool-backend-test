const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const http = require("https");
require("dotenv").config();
const axios = require("axios");

const User = require("../models/userModel");

// Load environment variables
const {
  JWT_SECRET_KEY,
  ZOHO_BOOKS_ACCESS_TOKEN,
  ZOHO_ORGANIZATION_ID,
  ZOHO_BOOKS_REFRESH_TOKEN,
  ZOHO_BOOKS_CLIENT_ID,
  ZOHO_BOOKS_CLIENT_SECRET,
} = process.env;

async function refreshToken() {
  const response = await axios.post(
    "https://accounts.zoho.com/oauth/v2/token",
    null,
    {
      params: {
        refresh_token: ZOHO_BOOKS_REFRESH_TOKEN,
        client_id: ZOHO_BOOKS_CLIENT_ID,
        client_secret: ZOHO_BOOKS_CLIENT_SECRET,
        grant_type: "refresh_token",
      },
    }
  );

  let accessToken;

  if (response.data.access_token) {
    accessToken = response.data.access_token;
    console.log("New access token:", accessToken);
  } else {
    console.error("Failed to refresh access token:", response.data);
  }

  return accessToken;
}

async function registerCustomer(user) {
  const customerData = {
    contact_name: user.firstName + " " + user.lastName,
    company_name: "",
    contact_type: "customer",
    currency_id: "2969006000000074087",
    payment_terms: 0,
    payment_terms_label: "Cash on Delivery",
    credit_limit: 0,
    billing_address: {},
    shipping_address: {},
    contact_persons: [
      {
        first_name: user.firstName,
        last_name: user.lastName,
        mobile: user.phone,
        email: user.email,
        is_primary_contact: true,
      },
    ],
    default_templates: {},
    custom_fields: [
      { customfield_id: "2969006000005524009", value: "" },
      { customfield_id: "2969006000005524025", value: "" },
    ],
    country_code: "",
    language_code: "en",
    tags: [
      { tag_id: "2969006000000000333", tag_option_id: "" },
      { tag_id: "2969006000000000335", tag_option_id: "" },
    ],
    tax_treatment: "non_gcc",
    tax_reg_no: "",
    customer_sub_type: "individual",
    opening_balances: [
      {
        opening_balance_amount: "",
        exchange_rate: 1,
        branch_id: "2969006000000775135",
      },
    ],
    contact_name_sec_lang: user.firstName + " " + user.lastName,
    documents: [],
  };

  const REFRESH_ZOHO_BOOKS_ACCESS_TOKEN = await refreshToken();

  const options = {
    method: "POST",
    hostname: "www.zohoapis.com",
    port: null,
    path: `/books/v3/contacts?organization_id=${ZOHO_ORGANIZATION_ID}`,
    headers: {
      Authorization: `Zoho-oauthtoken ${REFRESH_ZOHO_BOOKS_ACCESS_TOKEN}`,
      "content-type": "application/json",
    },
  };

  const req = http.request(options, function (res) {
    const chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", async function () {
      const dataReceiving = Buffer.concat(chunks);

      let charToRemove = '"';
      let regex = new RegExp(charToRemove, "g");
      const data = dataReceiving.toString().replace(regex, "");

      let dataID = data
        .slice(data.indexOf("contact_id:"), data.indexOf(",contact_name"))
        .replace("contact_id:", "");

      try {
        await User.findByIdAndUpdate({ _id: user._id }, { zohoID: dataID });
      } catch (err) {
        return res.status(401).send("Zoho ID was not added to the database");
      }
    });
  });

  req.write(JSON.stringify(customerData));
  req.end();
}

exports.verifyEmailToken = asyncHandler(async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, JWT_SECRET_KEY);

    if (JSON.stringify(verified.id)) {
      const user = await User.findByIdAndUpdate(
        { _id: verified.id },
        { confirmed: true }
      );

      //Register a Zoho Customer
      const userData = await User.findOne({ _id: verified.id });
      // if (userData.zohoID === "none")
      registerCustomer(userData);
    }

    // token = decoded; // Add the decoded payload to the request object
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  //   res.status(201).json("Token Verified");
  res
    .status(201)
    .redirect("https://alholool-frontend-test.netlify.app/sign-in.html");
  // res.send("This is a protected route and you are authenticated");

  return next();
});
