require('dotenv').config();
const Razorpay = require('razorpay');

async function testRazorpay() {
  console.log('🧪 Testing Razorpay Configuration...\n');
  
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  
  console.log('📝 Key ID:', key_id ? `${key_id.substring(0, 10)}...` : 'NOT SET');
  console.log('📝 Key Secret:', key_secret ? 'SET (hidden)' : 'NOT SET');
  console.log('');
  
  if (!key_id || !key_secret) {
    console.error('❌ Razorpay keys not configured in .env file');
    console.error('💡 Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
    process.exit(1);
  }
  
  if (!key_id.startsWith('rzp_')) {
    console.warn('⚠️  Warning: Key ID should start with "rzp_"');
  }
  
  try {
    console.log('🔌 Initializing Razorpay client...');
    const razorpay = new Razorpay({ 
      key_id: key_id.trim(), 
      key_secret: key_secret.trim() 
    });
    
    console.log('✅ Razorpay client initialized\n');
    
    console.log('🧪 Testing order creation...');
    const testOrder = {
      amount: 100, // 1 rupee in paise
      currency: 'INR',
      receipt: `test_${Date.now()}`,
      notes: {
        test: 'true'
      }
    };
    
    console.log('📋 Order options:', testOrder);
    
    try {
      const order = await razorpay.orders.create(testOrder);
      console.log('\n✅ Order created successfully!');
      console.log('📦 Order ID:', order.id);
      console.log('💰 Amount:', order.amount);
      console.log('💱 Currency:', order.currency);
      console.log('📊 Status:', order.status || 'created');
      console.log('\n✅ Razorpay is working correctly!');
      process.exit(0);
    } catch (orderError) {
      console.error('\n❌ Order creation failed!');
      console.error('Error Message:', orderError?.message);
      console.error('Error Name:', orderError?.name);
      
      if (orderError?.error) {
        console.error('Error Code:', orderError.error.code);
        console.error('Error Description:', orderError.error.description);
        console.error('Status Code:', orderError.error.statusCode);
      }
      
      if (orderError?.statusCode) {
        console.error('HTTP Status:', orderError.statusCode);
      }
      
      console.error('\n💡 Possible issues:');
      console.error('1. Invalid API keys');
      console.error('2. Network connectivity issues');
      console.error('3. Razorpay service temporarily unavailable');
      
      process.exit(1);
    }
  } catch (initError) {
    console.error('\n❌ Razorpay client initialization failed!');
    console.error('Error:', initError.message);
    process.exit(1);
  }
}

testRazorpay();

