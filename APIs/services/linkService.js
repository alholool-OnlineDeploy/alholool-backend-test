// services/linkService.js
const crypto = require('crypto');
const { secretKey, domain } = require('../utils/constants');

// Generate a secure token using email and a secret key
function generateToken(email) {
  return crypto
    .createHmac('sha256', secretKey)
    .update(email)
    .digest('hex');
}

// Generate the full confirmation link with the token
function generateConfirmationLink(email) {
  const token = generateToken(email);
  return `${domain}/email/confirm/${token}?email=${encodeURIComponent(email)}`;
}

module.exports = {
  generateToken,
  generateConfirmationLink
};
