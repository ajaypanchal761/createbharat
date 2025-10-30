const Razorpay = require('razorpay');

function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay keys are not set. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
  }

  return new Razorpay({ key_id, key_secret });
}

module.exports = { getRazorpayClient };


