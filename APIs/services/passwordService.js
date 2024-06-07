// Services/passwordService.js
const crypto = require('crypto');
const userService = require('./userService');
const emailService = require('./emailService');
const { domain, secretKey } = require('../utils/constants');

// Generate a random token for password reset
function generateResetToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Send the password reset link to the user's email
async function sendPasswordResetLink(email) {
    const user = await userService.findUserByEmail(email);

    if (!user) {
        console.error(`User with email ${email} not found`);
        return false;
    }

    // Generate a unique token
    const token = generateResetToken();

    // Save the reset token to the user's record
    await userService.savePasswordResetToken(email, token);

    // Construct the reset link
    const resetLink = `${domain}/password-reset?token=${token}&email=${encodeURIComponent(email)}`;

    // Email content
    const content = `
        <p>Hello,</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
    `;

    // Send the email
    await emailService.sendEmail(email, 'Password Reset Request', content);

    return true;
}

module.exports = {
    sendPasswordResetLink
};
