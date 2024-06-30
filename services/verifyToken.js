const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

exports.verifyToken = asyncHandler(async (req, res) => {
  const token = req.body.token;
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  let verified;
  try {
    // Verify the token
    verified = jwt.verify(token, JWT_SECRET_KEY);

    // token = decoded; // Add the decoded payload to the request object
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  res.status(201).json(verified);
  // res.status(401).send("Invalid Token");
  // res.send("This is a protected route and you are authenticated");

  return next();
});
