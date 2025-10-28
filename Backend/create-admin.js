const mongoose = require('mongoose');
const Admin = require('./models/admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://sarthaknamdev:sarthak123@cluster0.q5dpigj.mongodb.net/createbharat?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: 'admin@createbharat.com'
    });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists with email: admin@createbharat.com');
      console.log('Admin ID:', existingAdmin._id);
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create new admin
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@createbharat.com',
      password: 'admin123',
      fullName: 'Super Admin',
      role: 'super_admin',
      permissions: {
        users: true,
        loans: true,
        legal: true,
        training: true,
        mentors: true,
        analytics: true,
        settings: true
      }
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Username:', admin.username);
    console.log('🔑 Password: admin123');
    console.log('🆔 Admin ID:', admin._id);
    console.log('\n🔐 You can now login with:');
    console.log('   Email: admin@createbharat.com');
    console.log('   Password: admin123\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();

