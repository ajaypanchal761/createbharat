const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/companyRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const testRoutes = require('./routes/testRoutes');
const loanSchemeRoutes = require('./routes/loanSchemeRoutes');
const adminLoanSchemeRoutes = require('./routes/loanSchemeRoutes').adminLoanSchemeRoutes;
const loanApplicationRoutes = require('./routes/loanApplicationRoutes');
const adminLoanApplicationRoutes = require('./routes/loanApplicationRoutes').adminLoanApplicationRoutes;
const mentorRoutes = require('./routes/mentorRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const adminTrainingRoutes = require('./routes/adminTrainingRoutes');
const caRoutes = require('./routes/caRoutes');
const legalServiceRoutes = require('./routes/legalServiceRoutes');
const legalSubmissionRoutes = require('./routes/legalSubmissionRoutes');
const caSubmissionRoutes = require('./routes/caSubmissionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const adminBannerRoutes = require('./routes/adminBannerRoutes');
const webDevelopmentRoutes = require('./routes/webDevelopmentRoutes');
const adminWebDevelopmentRoutes = require('./routes/adminWebDevelopmentRoutes');
const bankAccountRoutes = require('./routes/bankAccountRoutes');
const adminBankAccountRoutes = require('./routes/adminBankAccountRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const pitchRoutes = require('./routes/pitchRoutes');
const adminPitchRoutes = require('./routes/adminPitchRoutes');
const otherServiceRoutes = require('./routes/otherServiceRoutes');
const adminOtherServiceRoutes = require('./routes/adminOtherServiceRoutes');
const caPayoutRoutes = require('./routes/caPayoutRoutes');
const adminPayoutRoutes = require('./routes/adminPayoutRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'https://createbharat.com',
  'https://www.createbharat.com',
  // Mobile app origins (WebView)
  'file://',
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'https://localhost'
];

const app = express();
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
  console.log(`⚡️ Socket connected: ${socket.id}`);

  socket.on('disconnect', (reason) => {
    console.log(`👋 Socket disconnected: ${socket.id} (${reason})`);
  });
});

app.set('io', io);
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration with mobile app support
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For mobile apps, allow if it's a file:// or custom scheme
      if (origin.startsWith('file://') || 
          origin.startsWith('capacitor://') || 
          origin.startsWith('ionic://') ||
          origin.includes('localhost') ||
          origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Request-Id', 'Content-Disposition'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Additional CORS headers for payment endpoints (handle ORB errors)
// ORB blocks opaque responses, so we need to ensure responses are not opaque
app.use('/api/mentors/bookings/:id/payment', (req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers to prevent ORB blocking
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'PUT, OPTIONS, POST, GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Content-Length, X-Request-Id, Content-Type');
  
  // CRITICAL: Set Content-Type to prevent opaque response
  // ORB blocks responses without proper Content-Type
  if (req.method !== 'OPTIONS') {
    res.header('Content-Type', 'application/json; charset=utf-8');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    return res.status(200).json({ success: true, message: 'OK' });
  }
  next();
});

app.use('/api/legal/submissions/:id/payment', (req, res, next) => {
  const origin = req.headers.origin;
  
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'PUT, OPTIONS, POST, GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Content-Length, X-Request-Id, Content-Type');
  
  if (req.method !== 'OPTIONS') {
    res.header('Content-Type', 'application/json; charset=utf-8');
  }
  
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Max-Age', '86400');
    return res.status(200).json({ success: true, message: 'OK' });
  }
  next();
});

// Apply same CORS headers to all API routes to prevent ORB
app.use('/api', (req, res, next) => {
  const origin = req.headers.origin;
  
  // Only set CORS if not already set by specific routes
  if (!res.getHeader('Access-Control-Allow-Origin')) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Content-Length, X-Request-Id, Content-Type');
  }
  
  // Ensure Content-Type is set for all API responses (prevents ORB)
  if (req.method !== 'OPTIONS' && !res.getHeader('Content-Type')) {
    res.header('Content-Type', 'application/json; charset=utf-8');
  }
  
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true, message: 'OK' });
  }
  
  next();
});

// Body parsing middleware with support for text/plain (fallback)
// Custom middleware to handle text/plain content-type before express.json()
app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';

  // If content-type is text/plain, manually parse body
  if (contentType.includes('text/plain') && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk.toString();
    });
    req.on('end', () => {
      try {
        if (rawBody.trim()) {
          req.body = JSON.parse(rawBody);
          console.log('Parsed text/plain body:', req.body);
        }
      } catch (e) {
        console.error('Failed to parse text/plain body as JSON:', e.message);
      }
      next();
    });
  } else {
    next();
  }
});

// Parse JSON with application/json content type
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global request logger for API endpoints
app.use((req, res, next) => {
  // Skip logging for static assets
  if (req.originalUrl.startsWith('/uploads')) {
    return next();
  }

  const requestId = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
  const startTime = Date.now();
  req.requestId = requestId;
  res.locals.requestId = requestId;

  const sensitiveKeys = ['password', 'currentpassword', 'newpassword', 'confirmpassword', 'otp', 'token', 'secret', 'authorization'];
  const isSensitiveKey = (key = '') => {
    const lower = key.toLowerCase();
    return sensitiveKeys.some(safeKey => lower.includes(safeKey));
  };

  const buildBodyPreview = () => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return undefined;
    }
    const keys = Object.keys(req.body);
    if (!keys.length) return undefined;
    const preview = {};
    keys.slice(0, 20).forEach(key => {
      const value = req.body[key];
      if (isSensitiveKey(key)) {
        preview[key] = '[REDACTED]';
      } else if (Array.isArray(value)) {
        preview[key] = `[Array(${value.length})]`;
      } else if (value && typeof value === 'object') {
        preview[key] = '[Object]';
      } else if (typeof value === 'string') {
        preview[key] = value.length > 120 ? `${value.slice(0, 120)}…` : value;
      } else {
        preview[key] = value;
      }
    });
    return preview;
  };

  const summarizeResponsePayload = (payload) => {
    if (payload === undefined || payload === null) return payload;
    if (Buffer.isBuffer(payload)) {
      return `[Buffer length=${payload.length}]`;
    }
    if (payload instanceof Uint8Array) {
      return `[Uint8Array length=${payload.length}]`;
    }
    if (typeof payload === 'string') {
      return payload.length > 200 ? `${payload.slice(0, 200)}…` : payload;
    }
    if (Array.isArray(payload)) {
      return `[Array(${payload.length})]`;
    }
    if (typeof payload === 'object') {
      const preview = {};
      Object.keys(payload).slice(0, 20).forEach((key) => {
        const value = payload[key];
        if (isSensitiveKey(key)) {
          preview[key] = '[REDACTED]';
        } else if (Array.isArray(value)) {
          preview[key] = `[Array(${value.length})]`;
        } else if (value && typeof value === 'object') {
          preview[key] = '[Object]';
        } else if (typeof value === 'string') {
          preview[key] = value.length > 120 ? `${value.slice(0, 120)}…` : value;
        } else {
          preview[key] = value;
        }
      });
      return preview;
    }
    return preview;
  };

  console.log(`[API][${requestId}] ➡️ ${req.method} ${req.originalUrl}`, {
    params: req.params,
    query: req.query,
    body: buildBodyPreview(),
    userId: req.user?.id || req.user?._id
  });

  let responsePreview;
  const originalJson = res.json.bind(res);
  const originalSend = res.send.bind(res);
  const originalStatus = res.status.bind(res);

  res.status = function patchedStatus(code) {
    res.statusCode = code;
    return originalStatus(code);
  };

  res.json = function patchedJson(body) {
    responsePreview = summarizeResponsePayload(body);
    return originalJson(body);
  };

  res.send = function patchedSend(body) {
    if (responsePreview === undefined) {
      responsePreview = summarizeResponsePayload(body);
    }
    return originalSend(body);
  };

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[API][${requestId}] ⬅️ ${res.statusCode} ${req.method} ${req.originalUrl} (${duration}ms)`, {
      success: res.statusCode < 400,
      response: responsePreview
    });
  });

  res.on('close', () => {
    if (!res.writableEnded) {
      console.warn(`[API][${requestId}] ⚠️ Connection closed before completing response`);
    }
  });

  next();
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
      return next();
    }
    return res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  res.status(200).json({
    status: dbState === 1 ? 'OK' : 'WARNING',
    message: 'CreateBharat Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStates[dbState] || 'unknown',
      state: dbState,
      connected: dbState === 1
    }
  });
});

// Legacy Razorpay callback handler (gracefully handle unexpected redirects)
app.all(['/tos', '/tos/index.php', /^\/tos\/index\.php.*$/], (req, res) => {
  console.warn('⚠️ Received legacy Razorpay callback path:', {
    method: req.method,
    url: req.originalUrl,
    query: req.query,
  });

  const htmlResponse = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>CreateBharat Payment Status</title>
      <style>
        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #f8fafc; color: #0f172a; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .card { max-width: 460px; background: #ffffff; border-radius: 16px; padding: 32px; box-shadow: 0 20px 45px -20px rgba(15,23,42,0.45); text-align: center; }
        h1 { font-size: 1.5rem; margin-bottom: 12px; color: #0f172a; }
        p { margin-bottom: 8px; line-height: 1.6; color: #334155; }
        .note { font-size: 0.9rem; color: #64748b; margin-top: 16px; }
        .btn { display: inline-block; margin-top: 20px; padding: 12px 24px; border-radius: 9999px; background: linear-gradient(135deg, #f97316, #facc15); color: #fff; font-weight: 600; text-decoration: none; box-shadow: 0 12px 30px -12px rgba(249,115,22,0.75); }
      </style>
      <script>
        window.addEventListener('DOMContentLoaded', () => {
          const supportsClose = !!(window.opener || window.top !== window.self);
          if (supportsClose) {
            setTimeout(() => window.close(), 2500);
          }
        });
      </script>
    </head>
    <body>
      <main class="card">
        <h1>Payment Status Received</h1>
        <p>Your transaction details have been captured successfully.</p>
        <p>You can safely return to the CreateBharat app.</p>
        <p class="note">If this page does not close automatically, please close the tab or press the button below.</p>
        <a class="btn" href="https://createbharat.com/">Back to CreateBharat</a>
      </main>
    </body>
  </html>`;

  res.status(200).send(htmlResponse);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/loans', loanSchemeRoutes);
app.use('/api/loans', loanApplicationRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminLoanSchemeRoutes);
app.use('/api/admin', adminLoanApplicationRoutes);
app.use('/api/admin', adminTrainingRoutes);
app.use('/api/admin/notifications', notificationRoutes);
app.use('/api/ca', caRoutes);
app.use('/api/legal', legalServiceRoutes);
app.use('/api/legal', legalSubmissionRoutes);
app.use('/api/ca', caSubmissionRoutes);
app.use('/api/admin', paymentRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/admin/banners', adminBannerRoutes);
app.use('/api/web-development', webDevelopmentRoutes);
app.use('/api/admin', adminWebDevelopmentRoutes);
app.use('/api/bank-account', bankAccountRoutes);
app.use('/api/admin', adminBankAccountRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/pitch', pitchRoutes);
app.use('/api/admin/pitches', adminPitchRoutes);
app.use('/api/other-services', otherServiceRoutes);
app.use('/api/admin', adminOtherServiceRoutes);
app.use('/api/ca', caPayoutRoutes);
app.use('/api/admin', adminPayoutRoutes);
app.use('/api/test', testRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CreateBharat API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      company: '/api/company',
      loans: '/api/loans',
      mentors: '/api/mentors',
      training: '/api/training',
      admin: '/api/admin'
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection
const connectDB = async (retryCount = 0, maxRetries = 3) => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://sarthaknamdev:sarthak123@cluster0.q5dpigj.mongodb.net/createbharat?retryWrites=true&w=majority&appName=Cluster0';
    
    // Validate connection string
    if (!mongoURI || mongoURI.length < 20 || !mongoURI.includes('mongodb')) {
      console.error('❌ Invalid MongoDB connection string detected!');
      console.error('💡 Please check your MONGODB_URI in .env file');
      console.error('💡 Connection string should start with mongodb:// or mongodb+srv://');
      process.exit(1);
    }
    
    // Mask credentials in log output
    const maskedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    if (retryCount > 0) {
      console.log(`🔄 Retry attempt ${retryCount}/${maxRetries}...`);
    } else {
      console.log('🔌 Connecting to MongoDB...');
    }
    console.log('📝 Using connection string:', maskedURI);

            // Optimized connection options for live server performance
            const conn = await mongoose.connect(mongoURI, {
              // Reduced timeouts for faster failure detection and retry
              serverSelectionTimeoutMS: 30000, // 30 seconds (faster failure detection)
              socketTimeoutMS: 45000, // 45 seconds (slightly longer than server selection)
              connectTimeoutMS: 30000, // 30 seconds
              // Optimized connection pooling for better performance
              maxPoolSize: 50, // Increased pool size for concurrent requests
              minPoolSize: 5, // Maintain more connections for faster response
              maxIdleTimeMS: 300000, // 5 minutes (keep connections alive longer)
              // Connection retry and reliability
              retryWrites: true,
              w: 'majority',
              retryReads: true,
              // Faster heartbeat for better connection monitoring
              heartbeatFrequencyMS: 10000, // 10 seconds
              // Network optimization
              directConnection: false, // Use connection string SRV records
              tls: true, // Enable TLS for Atlas connections
              tlsAllowInvalidCertificates: false,
              // Compression for faster data transfer
              compressors: ['zlib'],
              zlibCompressionLevel: 6
            });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      if (err.message.includes('IP') || err.message.includes('whitelist')) {
        console.error('\n💡 IP Whitelist Issue Detected!');
        console.error('📋 To fix this:');
        console.error('1. Go to MongoDB Atlas Dashboard: https://cloud.mongodb.com/');
        console.error('2. Navigate to: Network Access → IP Access List');
        console.error('3. Click "Add IP Address"');
        console.error('4. Add your server IP or use "0.0.0.0/0" for all IPs (less secure)');
        console.error('5. Wait 1-2 minutes for changes to take effect');
      }
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

  } catch (error) {
    console.error('\n❌ Database connection error:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.error('\n💡 IP Whitelist Issue:');
      console.error('Your server IP is not whitelisted in MongoDB Atlas.');
      console.error('📋 Steps to fix:');
      console.error('1. Go to: https://cloud.mongodb.com/');
      console.error('2. Select your cluster → Network Access → IP Access List');
      console.error('3. Click "Add IP Address"');
      console.error('4. Add your server IP address');
      console.error('   To find your server IP, run: curl ifconfig.me');
      console.error('   OR use "0.0.0.0/0" to allow all IPs (for testing only)');
      console.error('5. Wait 1-2 minutes for changes to propagate');
    } else if (error.message.includes('timeout') || error.message.includes('Server selection')) {
      console.error('\n💡 Connection Timeout Issue:');
      console.error('Possible causes:');
      console.error('1. MongoDB Atlas cluster might be PAUSED - Check Atlas dashboard');
      console.error('2. Network connectivity issues from server');
      console.error('3. Server firewall blocking outbound MongoDB connections (port 27017)');
      console.error('4. DNS resolution issues');
      console.error('5. MongoDB Atlas cluster in different region causing high latency');
      console.error('\n📋 Quick Checks:');
      console.error('1. Go to MongoDB Atlas → Check if cluster status is "Running" (not Paused)');
      console.error('2. Test DNS: nslookup cluster0.vwekfy9.mongodb.net');
      console.error('3. Test connectivity: telnet cluster0.vwekfy9.mongodb.net 27017');
      console.error('4. Check server firewall: sudo ufw status (if using UFW)');
    } else if (error.message.includes('authentication')) {
      console.error('\n💡 Authentication Issue:');
      console.error('Check your MongoDB username and password in .env file');
    }
    
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check your internet connection');
    console.error('2. Verify MongoDB Atlas cluster is running');
    console.error('3. Check if your IP is whitelisted in MongoDB Atlas');
    console.error('4. Run: node Backend/test-connection.js to test connection');
    
    // Retry logic
    if (retryCount < maxRetries) {
      const waitTime = (retryCount + 1) * 5000; // 5s, 10s, 15s
      console.error(`\n🔄 Retrying in ${waitTime / 1000} seconds... (${retryCount + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return connectDB(retryCount + 1, maxRetries);
    } else {
      console.error('\n❌ Max retries reached. Exiting...');
      process.exit(1);
    }
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      // Mongoose 7+ doesn't accept callbacks, returns Promise instead
      await mongoose.connection.close();
      console.log('Database connection closed.');
      process.exit(0);
    } catch (error) {
      console.error('Error closing database connection:', error);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();

module.exports = app;
