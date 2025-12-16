const jwt = require('jsonwebtoken');
const Mentor = require('../models/mentor');

// Protect routes - verify JWT token for mentors
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

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Get mentor from token - check both id and mentorId
      const mentorId = decoded.mentorId || decoded.id;
      if (!mentorId) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token - no mentor ID found'
        });
      }

      const mentor = await Mentor.findById(mentorId);

      if (!mentor) {
        return res.status(401).json({
          success: false,
          message: 'Token is valid but mentor no longer exists'
        });
      }

      if (!mentor.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Mentor account is deactivated'
        });
      }

      if (mentor.isBlocked) {
        return res.status(401).json({
          success: false,
          message: 'Mentor account is blocked'
        });
      }

      req.mentor = mentor;
      req.mentor.id = mentor._id.toString(); // Ensure id is available
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Mentor protect middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  protect
};

