// utils/jwtUtils.js
require('dotenv').config(); // Load .env
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET; // Access secret

const generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error('Invalid token');
  }
};

module.exports = { generateToken, verifyToken };