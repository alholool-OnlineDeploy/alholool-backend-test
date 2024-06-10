const crypto = require("crypto");

// Generate a secure random string for the secret key
const secretKey = crypto.randomBytes(64).toString("hex");
console.log(`Generated JWT Secret Key: ${secretKey}`);
