// Controllers/emails/emailControllerConfirm.js
const express = require("express");
const router = express.Router();
const { generateToken } = require("../../services/linkService");
const leadService = require("../../services/leadService");
const userService = require("../../services/userService");
const { LAYOUT_ID } = require("../../utils/constants");

// Endpoint to confirm the email address and create the lead
router.get("/confirm/:token", async (req, res) => {
  const { token } = req.params;
  const { email, redirect } = req.query;

  // Re-generate the expected token using the email provided
  const expectedToken = generateToken(email);

  if (token === expectedToken) {
    // Token is valid - confirm the email and create the lead in Zoho
    console.log(`Email ${email} confirmed successfully.`);

    // Retrieve the user data from temporary storage
    const leadData = global.tempLeads && global.tempLeads[email];
    if (!leadData) {
      console.error(`No lead data found for email: ${email}`);
      return res
        .status(404)
        .send("No lead data found. Please submit the form again.");
    }

    leadData.Layout = LAYOUT_ID;

    // Save user credentials to MongoDB before creating the lead
    const { Email, Password } = leadData;

    if (!Email || !Password) {
      console.error(`Missing email or password for lead creation: ${email}`);
      return res
        .status(400)
        .send("Invalid data. Email and password are required.");
    }

    try {
      await userService.saveUserCredentials(Email, Password);

      // Attempt to create the lead in Zoho CRM
      const result = await leadService.createLead(leadData);
      if (result.success) {
        console.log(`Lead created successfully for ${email}`);
        delete global.tempLeads[email];

        // Redirect to hello.html after email confirmation
        const redirectPage = redirect || "hello.html";
        return res.redirect(`/${redirectPage}`);
      } else {
        console.error(`Failed to create lead for ${email}:`, result.error);
        return res
          .status(500)
          .send("Email confirmed, but failed to create lead.");
      }
    } catch (error) {
      console.error(`Error creating lead for ${email}:`, error);
      return res
        .status(500)
        .send(
          "Email confirmed, but an error occurred while creating the lead."
        );
    }
  } else {
    console.error("Invalid confirmation token provided.");
    return res.status(400).send("Invalid confirmation token.");
  }
});

module.exports = router;
