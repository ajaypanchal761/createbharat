import React, { useState } from 'react';
import { authAPI } from '../utils/api';

const TestOTP = () => {
  const [phone, setPhone] = useState('7610416911');
  const [otp, setOtp] = useState('110211');
  const [result, setResult] = useState('');

  const testSendOTP = async () => {
    try {
      console.log('Testing send OTP with phone:', phone);
      const response = await authAPI.sendLoginOTP(phone);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  const testVerifyOTP = async () => {
    try {
      console.log('Testing verify OTP with phone:', phone, 'otp:', otp);
      const response = await authAPI.verifyOTP({
        phone: phone,
        otp: otp,
        purpose: 'login'
      });
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>OTP Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Phone Number:</label>
        <input 
          type="text" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>OTP:</label>
        <input 
          type="text" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={testSendOTP} style={{ marginRight: '10px', padding: '10px' }}>
          Test Send OTP
        </button>
        <button onClick={testVerifyOTP} style={{ padding: '10px' }}>
          Test Verify OTP
        </button>
      </div>

      <div>
        <h3>Result:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
          {result}
        </pre>
      </div>
    </div>
  );
};

export default TestOTP;
