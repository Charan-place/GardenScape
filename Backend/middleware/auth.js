// const jwt = require('jsonwebtoken');
// const JWT_SECRET = 'HiGuys'; // Use the same secret as in your server.js

// // Authentication Middleware
// function authenticateToken(req, res, next) {
//   const token = req.headers['authorization'];
//   if (!token) {
//     console.error('No token provided');
//     return res.status(401).send('Token required');
//   }

//   jwt.verify(token.split(' ')[1], JWT_SECRET, (err, decoded) => {
//     if (err) {
//       console.error('Token verification failed:', err.message);
//       return res.status(403).send('Invalid token');
//     }
//     req.user = decoded; // Attach the decoded token to the request object
//     next();
//   });
// }


// module.exports = authenticateToken;

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'HiGuys'; // Your JWT secret

// function authenticateToken(req, res, next) {
//     const token = req.headers['authorization']; // Get the token from the authorization header
//     if (!token) return res.status(401).send('Token must be provided'); // Return if no token

//     jwt.verify(token, JWT_SECRET, (err, user) => {
//         if (err) return res.status(403).send('Token verification failed');
//         req.user = user; // Attach the user info to the request
//         next(); // Continue to the next middleware
//     });
// }
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token

  if (!token) return res.status(401).send('Token must be provided.');

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Token verification failed'); // Handle verification failure
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;


