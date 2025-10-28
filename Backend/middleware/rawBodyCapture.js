// Middleware to capture raw body for debugging
const captureRawBody = (req, res, next) => {
  let rawBody = '';

  req.on('data', chunk => {
    rawBody += chunk.toString();
  });

  req.on('end', () => {
    req.rawBody = rawBody;
    if (rawBody) {
      try {
        req.parsedBody = JSON.parse(rawBody);
      } catch (e) {
        // Not JSON, ignore
      }
    }
    next();
  });
};

module.exports = captureRawBody;

