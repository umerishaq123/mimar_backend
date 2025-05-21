const User = require('../models/user');
const jwt = require('jsonwebtoken');
const asyncWrapper = require('../middlewares/async');

// Use asyncWrapper to handle promise rejections
exports.signup = asyncWrapper(async (req, res) => {
  const { name, email, password } = req.body;
  
  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email and password'
    });
  }
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already exists'
    });
  }
  
  // Create new user
  const user = await User.create({ name, email, password });
  
  // Generate token
  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET || 'your-default-secret',
    { expiresIn: '30d' }
  );
  
  res.status(201).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    token
  });
});

exports.login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  
  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }
  
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Check password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // Generate token
  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET || 'your-default-secret',
    { expiresIn: '30d' }
  );
  
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    token
  });
});