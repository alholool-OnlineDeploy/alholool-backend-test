const express = require("express");
const router = express.Router();
const path = require("path");
const authMiddleware = require("../Controllers/middlewares/authMiddleware"); // Import the middleware

// Existing controllers
const leadsControllerSignup = require("../Controllers/leads/leadsControllerSignup");
const leadsControllerHomeB = require("../Controllers/leads/leadsControllerHomeB");
const leadsControllerHomeI = require("../Controllers/leads/leadsControllerHomeI");
const emailControllerConfirm = require("../Controllers/emails/emailControllerConfirm");
const {
  loginIndividual,
  loginBusiness,
} = require("../Controllers/login/loginController");
const paymentController = require("../Controllers/payments/paymentController"); // Correctly import paymentController

// Route to serve the sign-up page
router.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Individual", "sign-up.html"));
});

// Route to handle submissions from the sign-up form
router.post("/submit-form", leadsControllerSignup.handleSubmitForm);

// Other routes...
router.post("/submit-lead", leadsControllerHomeB.createleadsBusForm);
router.post("/submit-lead2", leadsControllerHomeI.createleadsIndForm);

// Add the email confirmation controller routes
router.use("/email", emailControllerConfirm);

// Add login routes
console.log("Registering login routes...");
router.post("/api/login-individual", loginIndividual);
router.post("/api/login-business", loginBusiness);

router.post(
  "/api/payments/session",
  authMiddleware,
  paymentController.createPaymentSession
); // Protect route with authMiddleware
router.get(
  "/api/payments/details",
  authMiddleware,
  paymentController.getPaymentDetails
); // Protect route with authMiddleware
router.post("/api/payments/callback", paymentController.handlePaymentCallback);
router.get(
  "/api/payments/callback",
  paymentController.handlePaymentCallbackGet
);

console.log("index.js loaded and routes defined");

// Add a test route to verify authMiddleware
router.get("/api/protected-route", authMiddleware, (req, res) => {
  console.log("Received request for /api/protected-route"); // Add log here
  res.json({
    success: true,
    message: "This is a protected route.",
    user: req.user,
  });
});

module.exports = router;
