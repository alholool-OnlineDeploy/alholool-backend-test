// APIs/Controllers/login/loginController.js
const User = require("../../../Models/UserModel");
const jwt = require("jsonwebtoken");

const loginIndividual = async (req, res) => {
  const { email, password } = req.body;
  console.log("Received individual login request:", { email, password });

  try {
    const user = await User.findOne({ email });
    console.log("User found:", user ? user.email : "Not Found");

    if (!user) {
      console.log("Email not registered");
      return res.status(401).json({
        success: false,
        message: "This email is not registered. Please sign up first.",
      });
    }

    const match = await user.comparePassword(password);
    console.log("Password match result:", match);

    if (!match) {
      console.log("Incorrect password");
      return res.status(401).json({
        success: false,
        message: "The password you entered is incorrect. Please try again.",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "your_secret_key",
      { expiresIn: "1h" }
    );
    console.log("Token generated:", token);

    res.json({ success: true, token });
  } catch (error) {
    console.error("Error in individual login controller:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const loginBusiness = async (req, res) => {
  const { email, password } = req.body;
  console.log("Received business login request:", { email, password });

  try {
    const user = await User.findOne({ email });
    console.log("User found:", user ? user.email : "Not Found");

    if (!user) {
      console.log("Email not registered");
      return res.status(401).json({
        success: false,
        message: "This email is not registered. Please sign up first.",
      });
    }

    const match = await user.comparePassword(password);
    console.log("Password match result:", match);

    if (!match) {
      console.log("Incorrect password");
      return res.status(401).json({
        success: false,
        message: "The password you entered is incorrect. Please try again.",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "your_secret_key",
      { expiresIn: "1h" }
    );
    console.log("Token generated:", token);

    res.json({ success: true, token });
  } catch (error) {
    console.error("Error in business login controller:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { loginIndividual, loginBusiness };
