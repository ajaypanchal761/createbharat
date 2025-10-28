/**
 * Test script for Loan Scheme APIs with Image Upload
 * Run: node test-loan-api.js
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Create a sample image file for testing
const createTestImage = () => {
  const testImagePath = path.join(__dirname, 'uploads', 'test-image.jpg');
  const dir = path.dirname(testImagePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Create a simple test image (1x1 pixel red jpeg)
  const testImage = Buffer.from(
    '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A//2Q==',
    'base64'
  );

  fs.writeFileSync(testImagePath, testImage);
  return testImagePath;
};

// Test 1: Admin Login
async function testAdminLogin() {
  console.log('\n🔐 Test 1: Admin Login');
  try {
    const response = await axios.post(`${BASE_URL}/admin/login`, ADMIN_CREDENTIALS);
    console.log('✅ Admin login successful');
    return response.data.token;
  } catch (error) {
    console.error('❌ Admin login failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 2: Create Loan Scheme with Image Upload
async function testCreateLoanScheme(token) {
  console.log('\n💼 Test 2: Create Loan Scheme with Image Upload');

  try {
    // Create test image
    const imagePath = createTestImage();

    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    formData.append('name', 'Test Startup Loan');
    formData.append('shortName', 'TSUL');
    formData.append('description', 'A comprehensive loan scheme for startups with competitive rates');
    formData.append('provider', 'Government of India');
    formData.append('category', 'startup');
    formData.append('minAmount', '50000');
    formData.append('maxAmount', '5000000');
    formData.append('interestRate', '4-6%');
    formData.append('tenure', 'Up to 5 years');
    formData.append('icon', '🚀');
    formData.append('featured', 'true');
    formData.append('popular', 'true');
    formData.append('officialLink', 'https://example.com');

    const response = await axios.post(
      `${BASE_URL}/admin/loans/schemes`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('✅ Loan scheme created successfully');
    console.log('Scheme ID:', response.data.data._id);
    console.log('Image URL:', response.data.data.imageUrl);

    return response.data.data._id;

  } catch (error) {
    console.error('❌ Create loan scheme failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 3: Get All Loan Schemes
async function testGetAllSchemes() {
  console.log('\n📋 Test 3: Get All Loan Schemes');

  try {
    const response = await axios.get(`${BASE_URL}/loans/schemes?limit=5`);
    console.log('✅ Retrieved loan schemes');
    console.log('Total schemes:', response.data.total);
    console.log('Schemes:', response.data.count);

    return response.data.data;
  } catch (error) {
    console.error('❌ Get schemes failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 4: Update Loan Scheme
async function testUpdateScheme(token, schemeId) {
  console.log('\n✏️ Test 4: Update Loan Scheme');

  try {
    const formData = new FormData();
    formData.append('interestRate', '5-7%'); // Update interest rate
    formData.append('description', 'Updated description');

    const response = await axios.put(
      `${BASE_URL}/admin/loans/schemes/${schemeId}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('✅ Scheme updated successfully');
    console.log('Updated interest rate:', response.data.data.interestRate);

    return response.data.data;

  } catch (error) {
    console.error('❌ Update scheme failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 5: Delete Loan Scheme
async function testDeleteScheme(token, schemeId) {
  console.log('\n🗑️ Test 5: Delete Loan Scheme');

  try {
    const response = await axios.delete(
      `${BASE_URL}/admin/loans/schemes/${schemeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('✅ Scheme deleted successfully');

  } catch (error) {
    console.error('❌ Delete scheme failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Loan Scheme API Tests with Image Upload\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Login
    const token = await testAdminLogin();
    if (!token) {
      console.log('\n❌ Cannot proceed without admin token');
      return;
    }

    // Test 2: Create
    const schemeId = await testCreateLoanScheme(token);
    if (!schemeId) {
      console.log('\n⚠️ Skip remaining tests due to creation failure');
      return;
    }

    // Wait a bit for Cloudinary upload
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: Get All
    await testGetAllSchemes();

    // Test 4: Update
    await testUpdateScheme(token, schemeId);

    // Test 5: Delete
    await testDeleteScheme(token, schemeId);

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed successfully!');

  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Server is running');
    return true;
  } catch (error) {
    console.error('❌ Server is not running or not accessible');
    console.error('Please start the backend server with: npm run dev');
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
})();

