const jwt = require('jsonwebtoken');
const CA = require('../models/ca');

// Protect routes - verify JWT token for CA
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check for token in cookies
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    // Clean token if exists
    if (token) {
      token = token.trim().replace(/^["']|["']$/g, '');
    }

    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Get CA from token - check both id and caId
      const caId = decoded.caId || decoded.id;
      if (!caId) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token - no CA ID found'
        });
      }

      const ca = await CA.findById(caId);

      if (!ca) {
        return res.status(401).json({
          success: false,
          message: 'Token is valid but CA no longer exists'
        });
      }

      if (!ca.isActive) {
        return res.status(401).json({
          success: false,
          message: 'CA account is inactive'
        });
      }

      req.ca = ca;
      req.ca.id = ca._id.toString(); // Ensure id is available
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('CA protect middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  protect
};

