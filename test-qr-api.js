const axios = require('axios');

async function testQRAPI() {
  try {
    console.log('🔄 Testing QR API...');
    
    const response = await axios.post('http://localhost:3000/api/create-sample', {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Success Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Error Response:', error.response?.data || error.message);
    console.log('Status:', error.response?.status);
    console.log('Headers:', error.response?.headers);
  }
}

testQRAPI();
