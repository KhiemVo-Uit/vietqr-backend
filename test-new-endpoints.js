// test-new-endpoints.js - Test API endpoints mới sau khi deploy
const axios = require('axios');

async function testNewEndpoints() {
    console.log('🧪 TESTING NEW API ENDPOINTS...\n');
    
    const BASE_URL = 'https://vietqr-backend.onrender.com';
    
    try {        // Test 1: Token generation endpoint mới
        console.log('1️⃣ Testing new token endpoint...');
        console.log(`POST ${BASE_URL}/vqr/bank/api/token_generate`);
        
        const tokenResponse = await axios.post(`${BASE_URL}/vqr/bank/api/token_generate`);
        console.log('✅ Token endpoint:', tokenResponse.status);
        console.log('📋 Response:', tokenResponse.data);
        
        // Test 2: Callback endpoint mới  
        console.log('\n2️⃣ Testing new callback endpoint...');
        console.log(`POST ${BASE_URL}/vqr/bank/api/test/transaction-callback`);
        
        const callbackResponse = await axios.post(`${BASE_URL}/vqr/bank/api/test/transaction-callback`, {
            test: 'new callback endpoint',
            timestamp: new Date().toISOString(),
            transactionId: 'TEST_' + Date.now()
        });
        console.log('✅ Callback endpoint:', callbackResponse.status);
        console.log('📋 Response:', callbackResponse.data);
        
        console.log('\n🎉 NEW ENDPOINTS WORKING!');
        console.log('==========================');
        console.log('✅ Token API:', `${BASE_URL}/vqr/bank/api/token_generate`);
        console.log('✅ Callback API:', `${BASE_URL}/vqr/bank/api/test/transaction-callback`);
        
        console.log('\n📋 READY FOR VIETQR REGISTRATION:');
        console.log('=================================');
        console.log('🔗 Webhook URL cho VietQR:');
        console.log(`${BASE_URL}/vqr/bank/api/test/transaction-callback`);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        
        console.log('\n⏳ Có thể Render đang deploy...');
        console.log('Chờ 2-3 phút và chạy lại test này.');
    }
}

// Chạy test sau 30 giây để đảm bảo deploy xong
setTimeout(() => {
    testNewEndpoints();
}, 30000);

console.log('⏳ Đang chờ 30 giây cho Render deploy xong...');
console.log('🔄 Auto deploy từ GitHub push...\n');
