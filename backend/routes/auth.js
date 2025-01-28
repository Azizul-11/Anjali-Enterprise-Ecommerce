const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP, sendPasswordResetEmail } = require('../utils/email'); // Ensure sendOTP is imported here
const router = express.Router();
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const secret = process.env.JWT_SECRET;


// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      address, 
      username, 
      password, 
      phone,
      agreedTerms,
      agreedRefund,
      agreedShipping,
      agreedPrivacy 
    } = req.body;

    // Validate agreements
    if (!agreedTerms || !agreedRefund || !agreedShipping || !agreedPrivacy) {
      return res.status(400).json({ message: 'All agreements are required' });
    }

    const user = new User({ 
      name, 
      email, 
      address, 
      username, 
      password, 
      phone,
      agreedTerms,
      agreedRefund,
      agreedShipping,
      agreedPrivacy
    });

    await user.save();

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    // Send OTP
    await sendOTP(email, otp);

    res.status(201).json({ message: 'User created. OTP sent to email.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body; // Changed from username to identifier
  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid, clear the OTP field
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Forgot Password Request
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No account with that email exists' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending reset email' });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password' });
  }
});

module.exports = router;