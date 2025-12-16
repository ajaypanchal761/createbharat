const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://sarthaknamdev:sarthak123@cluster0.q5dpigj.mongodb.net/createbharat?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('🔌 Connecting to MongoDB...');
    console.log(`📝 Using connection string: ${mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    // Enhanced connection options for better reliability
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds (increased from default 10s)
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 30000, // 30 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2, // Maintain at least 2 socket connections
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      retryWrites: true,
      w: 'majority',
      // Retry configuration
      retryReads: true,
      // Heartbeat to keep connection alive
      heartbeatFrequencyMS: 10000,
    };

    const conn = await mongoose.connect(mongoURI, connectionOptions);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
      if (err.message.includes('IP') || err.message.includes('whitelist')) {
        console.error('\n💡 IP Whitelist Issue Detected!');
        console.error('📋 To fix this:');
        console.error('1. Go to MongoDB Atlas Dashboard');
        console.error('2. Navigate to: Network Access → IP Access List');
        console.error('3. Click "Add IP Address"');
        console.error('4. Add your server IP or use "0.0.0.0/0" for all IPs (less secure)');
        console.error('5. Wait 1-2 minutes for changes to take effect');
      }
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      console.log('🔄 Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      console.log('\nSIGINT received. Shutting down gracefully...');
      await mongoose.connection.close();
      console.log('HTTP server closed.');
      process.exit(0);
    });
    
    return conn;
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
      console.error('   OR use "0.0.0.0/0" to allow all IPs (for testing only)');
      console.error('5. Wait 1-2 minutes for changes to propagate');
    } else if (error.message.includes('timeout') || error.message.includes('Server selection')) {
      console.error('\n💡 Connection Timeout Issue:');
      console.error('Possible causes:');
      console.error('1. Network connectivity issues');
      console.error('2. MongoDB Atlas cluster might be paused');
      console.error('3. Firewall blocking connection');
      console.error('4. IP not whitelisted');
    } else if (error.message.includes('authentication')) {
      console.error('\n💡 Authentication Issue:');
      console.error('Check your MongoDB username and password in .env file');
    }
    
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Check your internet connection');
    console.error('2. Verify MongoDB Atlas cluster is running');
    console.error('3. Check if your IP is whitelisted in MongoDB Atlas');
    console.error('4. Run: node Backend/test-connection.js to test connection');
    
    // Don't exit immediately, allow retry
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB
};
