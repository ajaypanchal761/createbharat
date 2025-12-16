const Razorpay = require('razorpay');

function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay keys are not set. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
  }

  // Validate key format (Razorpay keys usually start with 'rzp_')
  if (!key_id.startsWith('rzp_')) {
    console.warn('[Razorpay] Warning: Key ID does not start with "rzp_". Please verify your RAZORPAY_KEY_ID.');
  }

  try {
    const razorpay = new Razorpay({ 
      key_id: key_id.trim(), 
      key_secret: key_secret.trim() 
    });
    
    return razorpay;
  } catch (initError) {
    console.error('[Razorpay] Client initialization error:', initError);
    throw new Error('Failed to initialize Razorpay client. Please check your API keys.');
  }
}

module.exports = { getRazorpayClient };


