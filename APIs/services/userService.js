// Services/userService.js
const bcrypt = require("bcryptjs");
const User = require("../../Models/UserModel");
const saltRounds = 10;

async function saveUserCredentials(email, password) {
  if (!password) {
    throw new Error("Password is missing or undefined.");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    console.log(`User credentials saved for ${email}`);
  } catch (error) {
    console.error(`Error saving user credentials for ${email}:`, error);
    throw error;
  }
}

module.exports = {
  saveUserCredentials,
};
