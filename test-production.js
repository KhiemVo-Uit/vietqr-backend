// test-production.js - Test production URL sau khi deploy
const axios = require('axios');

async function testProduction() {
    console.log('🧪 TESTING PRODUCTION DEPLOYMENT...\n');
      // URL thực tế từ Render
    const BASE_URL = 'https://vietqr-backend.onrender.com';
    
    try {        // Test 1: Health check
        console.log('1️⃣ Testing token endpoint...');
        const healthResponse = await axios.post(`${BASE_URL}/bank/api/token_generate`);
        console.log('✅ Health check:', healthResponse.status);
          // Test 2: Webhook endpoint
        console.log('\n2️⃣ Testing webhook endpoint...');
        const webhookResponse = await axios.post(`${BASE_URL}/vqr/bank/api/test/transaction-callback`, {
            test: 'production webhook test',
            timestamp: new Date().toISOString()
        });
        console.log('✅ Webhook test:', webhookResponse.status);
        
        console.log('\n🎉 PRODUCTION DEPLOYMENT SUCCESSFUL!');
        console.log('=====================================');
        console.log(`🔗 Your webhook URL: ${BASE_URL}/vqr/bank/api/test/transaction-callback`);
        console.log('\n📋 Next steps:');
        console.log('1. Copy the webhook URL above');
        console.log('2. Register with VietQR support');
        console.log('3. Use this URL in your QR generation');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Run test
testProduction();
