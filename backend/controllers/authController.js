const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/ErrorResponse');

// Get JWT secret with fallback for development
const JWT_SECRET = process.env.JWT_SECRET || "verysecurekey123456";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Helper function to validate JWT config
const validateJWTConfig = () => {
  if (!JWT_SECRET) {
    console.error('❌ JWT Configuration Error:');
    console.error('1. Check your .env file exists in backend/ folder');
    console.error('2. Verify it contains JWT_SECRET=your_secret_key');
    console.error('3. Ensure dotenv is configured in server.js');
    throw new Error('JWT_SECRET is not configured');
  }
};

// Signup Controller
exports.signup = async (req, res, next) => {
  try {
    validateJWTConfig(); // Check config before proceeding
    
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return next(new ErrorResponse('Please provide name, email and password', 400));
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('Email already registered', 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Send response
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    next(err);
  }
};

// Login Controller
exports.login = async (req, res, next) => {
  try {
    validateJWTConfig(); // Check config before proceeding
    
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return next(new ErrorResponse('Please provide email and password', 400));
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Send response
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    next(err);
  }
};