module.exports = {
  API_URL: "https://www.zohoapis.com/crm/v2/Leads",
};

/// Config/config.js
const mongoose = require("mongoose");

async function connectToDatabase() {
  // const mongoURI = 'mongodb://localhost:27017/Alholool'; // Replace with your actual database URI
  const mongoURI = process.env.DATABSE;

  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connectToDatabase;
