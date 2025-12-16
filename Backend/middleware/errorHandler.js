const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  const requestId = req?.requestId || 'N/A';
  const statusCode = error.statusCode || 500;
  const url = req?.originalUrl || '';

  // List of common bot/scanner paths that should be logged at lower level
  const botPaths = [
    '/cgi-bin/',
    '/wp-admin/',
    '/wp-login.php',
    '/.env',
    '/.git/',
    '/phpmyadmin/',
    '/admin/',
    '/administrator/',
    '/.well-known/',
    '/favicon.ico',
    '/robots.txt'
  ];

  // Don't filter API routes - they might legitimately return 404
  const isApiRoute = url.startsWith('/api/');
  const isBotRequest = !isApiRoute && botPaths.some(path => url.toLowerCase().includes(path.toLowerCase()));
  const is404 = statusCode === 404;

  // Only log 404s for bot requests at debug level, not as errors
  if (is404 && isBotRequest) {
    // Silently handle bot/scanner requests - don't log as errors
    return res.status(404).json({
      success: false,
      message: 'Not Found'
    });
  }

  // Log actual errors (non-404 or non-bot 404s)
  if (statusCode >= 500 || (!is404 && statusCode >= 400)) {
    console.error(`[API][${requestId}] ❌ Error processing request`, {
      method: req?.method,
      url: url,
      statusCode: statusCode,
      message: error.message || err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  } else if (is404) {
    // Log 404s at info level (not error) for legitimate requests
    console.log(`[API][${requestId}] ⚠️ 404 Not Found: ${req?.method} ${url}`);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error.message = message;
    error.statusCode = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error.message = message;
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error.message = message;
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error.message = message;
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error.message = message;
    error.statusCode = 401;
  }

  // Update statusCode after all error type checks
  const finalStatusCode = error.statusCode || 500;

  // Ensure CORS headers are set even for errors (prevents ORB)
  const origin = req.headers.origin;
  if (!res.getHeader('Access-Control-Allow-Origin')) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  
  // Ensure Content-Type is set (critical for preventing ORB)
  if (!res.getHeader('Content-Type')) {
    res.header('Content-Type', 'application/json; charset=utf-8');
  }

  res.status(finalStatusCode).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
