// Controllers/leads/leadsControllerSignup.js
const axios = require("axios");
const leadService = require("../../services/leadService");
const emailService = require("../../services/emailService");
const { generateConfirmationLink } = require("../../services/linkService");
const { userTypeMapping, LAYOUT_ID } = require("../../utils/constants");

exports.handleSubmitForm = async (req, res) => {
  console.log("Received data:", req.body);

  try {
    const { firstName, lastName, email, mobile, city, userType, password } =
      req.body;

    // Ensure all required fields are present
    if (
      !firstName ||
      !lastName ||
      !email ||
      !mobile ||
      !city ||
      !userType ||
      !password
    ) {
      return res.status(400).send("All fields are required.");
    }

    // Generate the confirmation link
    const confirmationLink = generateConfirmationLink(email);

    // Create the confirmation button
    const confirmationButton = `
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
          href="${confirmationLink}"
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

    // Send the confirmation email
    await emailService.sendConfirmationEmail(email, confirmationButton);
    console.log(`Confirmation email sent to: ${email}`);

    // Prepare lead data but don't create it yet
    const leadData = {
      First_Name: firstName,
      Last_Name: lastName,
      Email: email,
      Password: password, // Keep password for later MongoDB storage
      Mobile: mobile,
      City: city,
      Customer_Type: userTypeMapping[userType] || "Default Type",
      Layout: LAYOUT_ID,
      Lead_Source: "Sign up Form",
    };

    // Temporarily store lead data until the user confirms their email
    global.tempLeads = global.tempLeads || {};
    global.tempLeads[email] = leadData;

    // Respond to the user that the confirmation email was sent
    res.status(200).send("Confirmation email sent successfully.");
  } catch (error) {
    console.error("Error in handleSubmitForm:", error);
    res.status(500).send("Internal Server Error");
  }
};
