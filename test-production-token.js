// test-production-token.js - Test token endpoint trên production
const axios = require('axios');

async function testProductionToken() {
    console.log('🧪 TESTING PRODUCTION TOKEN ENDPOINT...\n');
    
    const PRODUCTION_URL = 'https://vietqr-backend.onrender.com';
    
    try {
        console.log('📍 Testing POST /vqr/api/token_generate');
        console.log(`URL: ${PRODUCTION_URL}/vqr/api/token_generate\n`);
        
        const response = await axios.post(`${PRODUCTION_URL}/vqr/api/token_generate`);
        
        console.log('✅ SUCCESS!');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
        if (response.data.data && response.data.data.access_token) {
            console.log('\n🎉 TOKEN GENERATED SUCCESSFULLY!');
            console.log('🔑 Access Token:', response.data.data.access_token.substring(0, 50) + '...');
            
            console.log('\n📋 ENDPOINTS READY:');
            console.log('==================');
            console.log('✅ Token API:', `${PRODUCTION_URL}/vqr/api/token_generate`);
            console.log('✅ Callback API:', `${PRODUCTION_URL}/vqr/api/test/transaction-callback`);
            
            console.log('\n🔗 WEBHOOK URL FOR VIETQR:');
            console.log('===========================');
            console.log(`${PRODUCTION_URL}/vqr/api/test/transaction-callback`);
        }
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
          if (error.code === 'ENOTFOUND') {
            console.log('\n💡 Kiểm tra internet connection hoặc URL production');
        }
    }
}

// Chạy test
testProductionToken();
