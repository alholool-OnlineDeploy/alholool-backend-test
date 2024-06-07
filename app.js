const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./APIs/routes/index"); // Import the main router file
const { initializeApp } = require("./APIs/services/tokenService");
const emailConfirmRouter = require("./APIs/Controllers/emails/emailControllerConfirm");

const app = express();
const port = 5500;

// MongoDB connection URL
// const mongoDBUrl = "mongodb://localhost:27017/Alholool";
const mongoDBUrl = process.env.DATABSE;

// Connect to MongoDB
mongoose
  .connect(mongoDBUrl)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Enable CORS for all requests
app.use(cors({ origin: "*" })); // Allow all origins for debugging

// Middleware to parse JSON and urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'Individual' directory
app.use(express.static(path.join(__dirname, "Individual")));

// Apply main routes
console.log("Importing main routes into app.js");
app.use("/", routes);

// Apply email confirmation routes
app.use("/api", emailConfirmRouter);

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Initialize the application
initializeApp(app, port);

module.exports = app;
