require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://sarthaknamdev:sarthak123@cluster0.q5dpigj.mongodb.net/createbharat?retryWrites=true&w=majority&appName=Cluster0';

console.log('Testing MongoDB connection...');
console.log('Connection string:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
})
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    console.log('Connected to:', mongoose.connection.host);
    console.log('Database:', mongoose.connection.name);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed!');
    console.error('Error:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Check if internet connection is active');
    console.error('2. Check if MongoDB Atlas IP whitelist includes your IP');
    console.error('3. Verify the connection string is correct');
    console.error('4. Check if MongoDB Atlas cluster is running');
    process.exit(1);
  });

