const jwt = require('jsonwebtoken');
const Company = require('../models/company');

// Protect routes - verify JWT token for companies
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

      // Get company from token - check both id and companyId
      const companyId = decoded.companyId || decoded.id;
      if (!companyId) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token - no company ID found'
        });
      }

      const company = await Company.findById(companyId);

      if (!company) {
        return res.status(401).json({
          success: false,
          message: 'Token is valid but company no longer exists'
        });
      }

      if (!company.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Company account is deactivated'
        });
      }

      req.company = company;
      req.company.id = company._id.toString(); // Ensure id is available
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Company protect middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  protect
};

