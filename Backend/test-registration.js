const axios = require('axios');

// Test the complete registration flow
async function testRegistrationFlow() {
  try {
    const baseURL = 'http://localhost:5000';

    console.log('🧪 Testing CreateBharat Registration Flow with SMS...\n');

    // Test data
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      phone: '9876543210', // Replace with your real phone number
      dateOfBirth: '1990-01-01',
      gender: 'male',
      address: {
        street: 'Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456'
      }
    };

    console.log('📝 Step 1: User Registration');
    console.log('Phone:', testData.phone);

    const registerResponse = await axios.post(`${baseURL}/api/auth/register`, testData);

    if (registerResponse.data.success) {
      console.log('✅ Registration successful!');
      console.log('📱 OTP should be sent to:', testData.phone);
      console.log('🔑 Token received:', registerResponse.data.data.token ? 'Yes' : 'No');

      // In development, the OTP is also returned in the response
      if (registerResponse.data.data.otpSent) {
        console.log('📱 OTP Status:', registerResponse.data.data.message);
      }

      console.log('\n📝 Step 2: OTP Verification');
      console.log('Please check your phone for the OTP and enter it below...');

      // For testing, we'll use a hardcoded OTP (in real scenario, user would enter it)
      // In development mode, the OTP is also returned in the response
      const otpToVerify = registerResponse.data.data.otpSent ? '123456' : '123456'; // This should be the OTP sent to the phone

      const verifyResponse = await axios.post(`${baseURL}/api/auth/verify-otp`, {
        phone: testData.phone,
        otp: otpToVerify
      });

      if (verifyResponse.data.success) {
        console.log('✅ OTP verification successful!');
        console.log('📱 Welcome SMS should be sent to:', testData.phone);
        console.log('🎉 User is now fully registered and verified!');
      } else {
        console.log('❌ OTP verification failed:', verifyResponse.data.message);

        console.log('\n📝 Step 3: Resend OTP Test');
        try {
          const resendResponse = await axios.post(`${baseURL}/api/auth/resend-otp`, {
            phone: testData.phone
          });

          if (resendResponse.data.success) {
            console.log('✅ OTP resent successfully!');
            console.log('📱 New OTP should be sent to:', testData.phone);
          } else {
            console.log('❌ Resend OTP failed:', resendResponse.data.message);
          }
        } catch (resendError) {
          console.log('❌ Resend OTP error:', resendError.response?.data?.message || resendError.message);
        }
      }

    } else {
      console.log('❌ Registration failed:', registerResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

// Run the test
testRegistrationFlow();
