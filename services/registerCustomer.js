exports.registerCustomer = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    // Verify the token
    const verified = jwt.verify(token, JWT_SECRET_KEY);

    if (JSON.stringify(verified.id)) {
      const user = await User.findByIdAndUpdate(
        { _id: verified.id },
        { confirmed: true }
      );

      await registerCustomer(verified.id);
    }

    // token = decoded; // Add the decoded payload to the request object
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  //   res.status(201).json("Token Verified");
  res
    .status(201)
    .redirect("https://alholool-frontend-test.netlify.app/sign-in.html");
  // res.send("This is a protected route and you are authenticated");

  return next();
});
