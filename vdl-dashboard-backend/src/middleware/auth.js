// src/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = payload.userId;
    next();
  });
}

module.exports = authenticateToken;
