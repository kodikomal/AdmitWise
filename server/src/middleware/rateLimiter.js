const rateLimit = require('express-rate-limit');

// Sensitive auth limiter (login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 auth requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

// Prediction API limiter
const predictionLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 60, // 60 predictions per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Prediction rate limit reached. Please wait a few moments before running another prediction.',
  },
});

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

module.exports = {
  authLimiter,
  predictionLimiter,
  apiLimiter,
};
