const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Helper to sign JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'admitwise_dev_jwt_secret_key_bsc_it_project_2026_super_safe',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Helper to set HTTP-only cookie
const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('admitwise_token', token, {
    httpOnly: true,
    secure: isProduction || process.env.COOKIE_SECURE === 'true',
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

// Clear cookie on logout
const clearAuthCookie = (res) => {
  res.cookie('admitwise_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
};

// Protect middleware (Student or Admin)
const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header first (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check HTTP-only cookie next
    else if (req.cookies && req.cookies.admitwise_token) {
      token = req.cookies.admitwise_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in to access this resource.',
      });
    }

    const secret = process.env.JWT_SECRET || 'admitwise_dev_jwt_secret_key_bsc_it_project_2026_super_safe';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or session has expired.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact the administrator.',
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your session has expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
    });
  }
};

// Require Administrator role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrator privileges are required for this action.',
    });
  }
  next();
};

// Optional auth - populates req.user if token is present, does not fail otherwise
const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.admitwise_token) {
      token = req.cookies.admitwise_token;
    }

    if (token) {
      const secret = process.env.JWT_SECRET || 'admitwise_dev_jwt_secret_key_bsc_it_project_2026_super_safe';
      const decoded = jwt.verify(token, secret);
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch {
    // Silently continue for optional auth
  }
  next();
};

module.exports = {
  generateToken,
  setAuthCookie,
  clearAuthCookie,
  requireAuth,
  requireAdmin,
  optionalAuth,
};
