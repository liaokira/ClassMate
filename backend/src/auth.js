// auth.js
const jwt = require('jsonwebtoken');
const secrets = require('./secrets'); // wherever your JWT secret is stored

exports.checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, secrets.accessToken, (err, user) => {
    if (err) {
      // invalid or expired token
      return res.status(403).json({ message: 'Invalid token' });
    }
    // token is valid, attach user to request object
    req.user = user;
    next();
  });
};
