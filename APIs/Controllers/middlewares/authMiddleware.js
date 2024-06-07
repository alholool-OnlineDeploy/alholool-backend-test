const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Get token from headers
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, 'your_secret_key');
        req.user = decoded; // Attach user info to request object
        console.log('Token verified, user:', decoded); // Add log here
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
