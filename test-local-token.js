// test-local-token.js - Test endpoint token_generate trên local
const axios = require('axios');

async function testLocalToken() {
    console.log('🧪 TESTING LOCAL TOKEN ENDPOINT...\n');
    
    const LOCAL_URL = 'http://localhost:3000';
    
    try {
        console.log('📍 Testing POST /vqr/bank/api/token_generate');
        console.log(`URL: ${LOCAL_URL}/vqr/bank/api/token_generate\n`);
        
        const response = await axios.post(`${LOCAL_URL}/vqr/bank/api/token_generate`);
        
        console.log('✅ SUCCESS!');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
        if (response.data.access_token) {
            console.log('\n🎉 TOKEN GENERATED SUCCESSFULLY!');
            console.log('🔑 Access Token:', response.data.access_token.substring(0, 50) + '...');
        }
        
    } catch (error) {
        console.error('❌ ERROR:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Server chưa chạy. Hãy chạy: npm start');
        }
    }
}

// Chờ 2 giây để server khởi động
setTimeout(testLocalToken, 2000);
