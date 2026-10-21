const { User } = require('../models');
const { generateToken, setAuthCookie, clearAuthCookie } = require('../middleware/auth');

/**
 * Register a new student
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Check existing email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Public registration strictly creates 'student' role. Admin role cannot be created via public registration.
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'student',
      academicProfile: {
        sscPercentage: null,
        hscPercentage: null,
        board: 'Maharashtra State Board',
        passingYear: 2024,
        hscStream: 'Science',
        mathsMarks: null,
        entranceExam: 'None / Merit Based',
        entranceScore: null,
        category: 'Open/General',
        preferredCity: 'Mumbai',
        annualFeeBudget: 200000,
        collegeTypePreference: 'Any',
      },
    });

    const token = generateToken(user._id, user.role);
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'Student account created successfully.',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user (Student or Admin)
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact support.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id, user.role);
    setAuthCookie(res, token);

    // Remove password before sending
    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  clearAuthCookie(res);
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

/**
 * Forgot password development handler
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required.' });
  }

  // Safe development explanation per project specification:
  // Since external SMTP is not configured in local environment, we document this limitation cleanly.
  return res.status(200).json({
    success: true,
    message:
      'Password reset request received. In this development / demonstration environment, external SMTP delivery is disabled. To reset credentials, contact your local database administrator or use the npm run create-admin script.',
  });
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
};
