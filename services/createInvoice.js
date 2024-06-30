const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const axios = require("axios");

exports.createInvoice = asyncHandler(async (req, res) => {
  const token = req.body.token;
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, JWT_SECRET_KEY);

    // token = decoded; // Add the decoded payload to the request object
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  // res.send("This is a protected route and you are authenticated");

  const response = await axios.post(
    "https://api.moyasar.com/v1/payments",
    // '{\n    "amount": 100,\n    "currency": "SAR",\n    "description": "Payment for order #",\n    "callback_url": "https://example.com/thankyou",\n    "source": {\n        "type": "creditcard",\n        "name": "Mohammed Ali",\n        "number": "4111111111111111",\n        "cvc": "123",\n        "month": "12",\n        "year": "26"\n    }\n}',
    {
      amount: 100,
      currency: "SAR",
      description: "Payment for order #",
      callback_url: "https://example.com/thankyou",
      source: {
        type: "creditcard",
        name: "Mohammed Ali",
        number: "4111111111111111",
        cvc: "123",
        month: "12",
        year: "26",
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username: "sk_test_6ZGiNUi9g5WXyDa3qto2tmiUyd5rAAbsdas4g6Ev",
      },
    }
  );
  res.status(201).json(response.data);
  return next();
});
