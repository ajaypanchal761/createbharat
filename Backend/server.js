const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

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
const mentorRoutes = require('./routes/mentorRoutes');
const trainingRoutes = require('./routes/trainingRoutes');
const adminTrainingRoutes = require('./routes/adminTrainingRoutes');
const caRoutes = require('./routes/caRoutes');
const legalServiceRoutes = require('./routes/legalServiceRoutes');
const legalSubmissionRoutes = require('./routes/legalSubmissionRoutes');
const caSubmissionRoutes = require('./routes/caSubmissionRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/loans', loanSchemeRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminLoanSchemeRoutes);
app.use('/api/admin', adminTrainingRoutes);
app.use('/api/ca', caRoutes);
app.use('/api/legal', legalServiceRoutes);
app.use('/api/legal', legalSubmissionRoutes);
app.use('/api/ca', caSubmissionRoutes);
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
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://sarthaknamdev:sarthak123@cluster0.q5dpigj.mongodb.net/createbharat?retryWrites=true&w=majority&appName=Cluster0';
    console.log('🔌 Connecting to MongoDB...');

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain at least 5 socket connections
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check your internet connection');
    console.error('2. Verify MongoDB Atlas cluster is running');
    console.error('3. Check if your IP is whitelisted in MongoDB Atlas');
    console.error('4. Run: node Backend/test-connection.js to test connection');
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
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
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(() => {
    console.log('Database connection closed.');
    process.exit(0);
  });
});

startServer();

module.exports = app;
