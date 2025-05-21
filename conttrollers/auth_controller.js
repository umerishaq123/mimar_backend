const User = require('../models/user');
const bcrypt = require('bcryptjs');
const asyncWrapper = require("../middlewares/async");
const { generateToken } = require('../utils/jwt');

exports.signup = asyncWrapper(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    data: createdUser,
    success: true,
    message: "User created successfully",
  });
});



exports.login= asyncWrapper(async (req, res,next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomErrorHandling(`User not found with email: ${email}`, 404));

  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const token = generateToken({ userId: user._id, email: user.email });

  user.jwtToken = token;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Login successful",
    user,
  });
});