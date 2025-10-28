const axios = require('axios');

// Comprehensive test of signup and login flow
async function testCompleteAuthFlow() {
  try {
    const baseURL = 'http://localhost:5000';
    
    console.log('🧪 Testing Complete CreateBharat Authentication Flow...\n');
    
    // Test data
    const testData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
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
    console.log('Email:', testData.email);
    
    const registerResponse = await axios.post(`${baseURL}/api/auth/register`, testData);
    
    if (registerResponse.data.success) {
      console.log('✅ Registration successful!');
      console.log('📱 OTP should be sent to:', testData.phone);
      console.log('🔑 Token received:', registerResponse.data.data.token ? 'Yes' : 'No');
      
      const token = registerResponse.data.data.token;
      
      console.log('\n📝 Step 2: OTP Verification');
      console.log('Please check your phone for the OTP...');
      
      // In development, we can use a hardcoded OTP for testing
      const otpToVerify = '123456'; // This should be the OTP sent to the phone
      
      const verifyResponse = await axios.post(`${baseURL}/api/auth/verify-otp`, {
        phone: testData.phone,
        otp: otpToVerify
      });
      
      if (verifyResponse.data.success) {
        console.log('✅ OTP verification successful!');
        console.log('📱 Welcome SMS should be sent to:', testData.phone);
        
        console.log('\n📝 Step 3: Get User Profile');
        const userResponse = await axios.get(`${baseURL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (userResponse.data.success) {
          console.log('✅ User profile retrieved successfully!');
          console.log('👤 User:', userResponse.data.data.user.firstName, userResponse.data.data.user.lastName);
          console.log('📱 Phone verified:', userResponse.data.data.user.isPhoneVerified);
          console.log('🎯 Referral code:', userResponse.data.data.user.referralCode);
          
          console.log('\n📝 Step 4: Test Login Flow');
          const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
            email: testData.email,
            phone: testData.phone,
            loginMethod: 'phone'
          });
          
          if (loginResponse.data.success) {
            console.log('✅ Login OTP sent successfully!');
            console.log('📱 New OTP should be sent to:', testData.phone);
            
            console.log('\n📝 Step 5: Test Resend OTP');
            const resendResponse = await axios.post(`${baseURL}/api/auth/resend-otp`, {
              phone: testData.phone
            });
            
            if (resendResponse.data.success) {
              console.log('✅ OTP resent successfully!');
              console.log('📱 Another OTP should be sent to:', testData.phone);
            } else {
              console.log('❌ Resend OTP failed:', resendResponse.data.message);
            }
            
          } else {
            console.log('❌ Login failed:', loginResponse.data.message);
          }
          
        } else {
          console.log('❌ Failed to get user profile:', userResponse.data.message);
        }
        
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
    
    console.log('\n🎉 Authentication flow test completed!');
    console.log('\n📱 If you received SMS messages, the integration is working correctly!');
    console.log('📱 If you did not receive SMS messages, please check:');
    console.log('   1. Phone number format (should be 10 digits)');
    console.log('   2. SMSIndiaHub account balance');
    console.log('   3. Network connectivity');
    console.log('   4. Backend server is running');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    if (error.response?.data?.errors) {
      console.error('Validation errors:', error.response.data.errors);
    }
  }
}

// Run the test
testCompleteAuthFlow();
