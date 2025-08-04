const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  console.log("=== AUTHENTICATION DEBUG ===");
  console.log("All headers:", req.headers);
  console.log("Authorization header:", req.headers['authorization']);
  console.log("Authorization header (lowercase):", req.headers['authorization']);
  console.log("Authorization header (uppercase):", req.headers['Authorization']);
  console.log("Request URL:", req.url);
  console.log("Request method:", req.method);
  
  const token = req.headers['authorization'];
  console.log("token--", token);
  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  // Remove Bearer from string if provided
  const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

  const jwtSecret = "123"; // Use consistent secret

  jwt.verify(actualToken, jwtSecret, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });

    req.user = decoded; // Attach decoded token to request object
    next(); // Proceed to the next middleware/route
  });
};

module.exports = { authenticateToken };
