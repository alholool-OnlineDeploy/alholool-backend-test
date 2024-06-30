const express = require("express");
const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  signup,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../services/authService");

const { verifyToken } = require("../services/verifyToken");
const { verifyEmailToken } = require("../services/verifyEmailToken");
const { createInvoice } = require("../services/createInvoice");
const { verifyPurchase } = require("../services/verifyPurchase");
// const { createUserInvoice } = require("../services/createUserInvoice");

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.put("/resetPassword", resetPassword);
router.post("/verifyToken", verifyToken);
router.get("/confirmationEmail/:token", verifyEmailToken);
router.post("/createInvoice", createInvoice);
router.get("/verifyPurchase", verifyPurchase);
// router.post("/createUserInvoice", createUserInvoice);

module.exports = router;
