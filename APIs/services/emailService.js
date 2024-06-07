// services/emailService.js
const axios = require('axios');
const tokenService = require('../services/tokenService'); // Ensure the path to your token service is correct
const { accountId, domain } = require('../utils/constants'); // Ensure the path to your constants is correct

const zohoConfig = {
  apiUrl: `https://mail.zoho.com/api/accounts/${accountId}/messages`,
  fromAddress: 'support@alholool.com.sa'
};

async function sendConfirmationEmail(toAddress, confirmationButton) {
  const authToken = await tokenService.getAccessToken(); // Get the current access token from your token service

  console.log(`API URL: ${zohoConfig.apiUrl}`);
  console.log('Sending email with the following details:');
  console.log(`From: ${zohoConfig.fromAddress}`);
  console.log(`To: ${toAddress}`);
  console.log(`Subject: Confirm Your Email Address`);
  console.log(`Content: ${confirmationButton}`);
  console.log(`Using authToken: ${authToken.substring(0, 15)}...`); // Logs part of the token for security

  try {
    const emailData = {
      fromAddress: zohoConfig.fromAddress,
      toAddress: toAddress,
      subject: 'Confirm Your Email Address',
      content: confirmationButton  // Set the content to the confirmation button
    };

    console.log("Prepared to send email with payload:", JSON.stringify(emailData, null, 2));

    const response = await axios.post(zohoConfig.apiUrl, emailData, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${authToken}`,
        'Content-Type': 'application/json' // Ensure content type is set correctly
      }
    });

    // Check if the response status indicates success
    if (response.status === 200 || response.status === 201) {
      console.log('Email sent successfully:', response.data);
      return response.data;
    } else {
      console.error('Email sending failed with status:', response.status, 'and response:', response.data);
      throw new Error('Failed to send email due to non-success response status.');
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    if (error.response) {
      console.error('HTTP Status:', error.response.status);
      console.error('HTTP Headers:', error.response.headers);
      console.error('HTTP Response Body:', error.response.data);
    } else {
      console.error('Error details:', error.message);
    }
    throw error; // Rethrow the error for further handling if necessary
  }
}

module.exports = {
  sendConfirmationEmail
};
