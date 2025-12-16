const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  console.log('🧪 Testing MongoDB Connection...\n');
  
  const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://sarthaknamdev:sarthak123@cluster0.q5dpigj.mongodb.net/createbharat?retryWrites=true&w=majority&appName=Cluster0';
  
  console.log('📝 Connection String:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
  console.log('⏳ Attempting connection...\n');
  
  try {
    const startTime = Date.now();
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 60000,
    });
    
    const connectionTime = Date.now() - startTime;
    
    console.log('✅ Connection Successful!');
    console.log(`⏱️  Connection time: ${connectionTime}ms`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔌 Ready State: ${conn.connection.readyState} (1 = connected)`);
    
    // Test a simple query
    try {
      const collections = await conn.connection.db.listCollections().toArray();
      console.log(`📁 Collections found: ${collections.length}`);
      if (collections.length > 0) {
        console.log('   Collections:', collections.map(c => c.name).join(', '));
      }
    } catch (queryError) {
      console.log('⚠️  Could not list collections:', queryError.message);
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection Failed!');
    console.error('Error:', error.message);
    console.error('\n📋 Diagnostic Information:');
    console.error('Error Name:', error.name);
    console.error('Error Code:', error.code);
    
    if (error.message.includes('timeout') || error.message.includes('Server selection')) {
      console.error('\n💡 Timeout Issues - Possible Solutions:');
      console.error('1. Check if MongoDB Atlas cluster is RUNNING (not paused)');
      console.error('2. Verify network connectivity from server');
      console.error('3. Check server firewall settings');
      console.error('4. Try increasing timeout values');
    }
    
    if (error.message.includes('authentication')) {
      console.error('\n💡 Authentication Issues:');
      console.error('1. Check MongoDB username and password');
      console.error('2. Verify database user has correct permissions');
    }
    
    process.exit(1);
  }
};

testConnection();

