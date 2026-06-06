const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

// REGISTER user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'Email already registered',
        message: 'An account with this email already exists'
      });
    }

    const newUser = new User({
      name,
      email,
      password,
      phone
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({
      error: 'Error registering user',
      message: error.message
    });
  }
});

// LOGIN user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'email and password are required'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error logging in',
      message: error.message
    });
  }
});

// GET user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        status: 404
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching profile',
      message: error.message
    });
  }
});

// UPDATE user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
        status: 404
      });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      error: 'Error updating profile',
      message: error.message
    });
  }
});

// CHANGE password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'currentPassword and newPassword are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        status: 404
      });
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid current password',
        message: 'The current password you provided is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Error changing password',
      message: error.message
    });
  }
});

// GET all users (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.status(200).json({
      data: users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching users',
      message: error.message
    });
  }
});

// GET user by ID (admin only)
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        status: 404
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching user',
      message: error.message
    });
  }
});

// UPDATE user (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { name, phone, address, role, isActive } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, phone, address, role, isActive, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User not found',
        status: 404
      });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      error: 'Error updating user',
      message: error.message
    });
  }
});

// DELETE user (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        error: 'User not found',
        status: 404
      });
    }

    res.status(200).json({
      message: 'User deleted successfully',
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting user',
      message: error.message
    });
  }
});

module.exports = router;

