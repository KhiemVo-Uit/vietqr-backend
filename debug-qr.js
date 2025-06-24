const axios = require('axios');

// Test lấy token trước
async function testToken() {
  try {
    const username = 'customer-vietgiaiph-user25325';
    const password = 'Y3VzdG9tZXItdmlldGdpYWlwaC11c2VyMjUzMjU=';
    const authString = `${username}:${password}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
    
    console.log('🔄 Testing token generation...');
    const response = await axios.post('https://dev.vietqr.org/vqr/api/token_generate', {}, {
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Token Response:', response.data);
    
    const token = response.data.access_token;
    
    // Test tạo QR với token vừa lấy
    console.log('\n🔄 Testing QR generation with token...');
    
    const qrData = {
      accountNo: "113366668888",
      accountName: "QUY VAC XIN COVID",
      acqId: "963166",
      amount: 79000,
      addInfo: "Ung ho quy vac xin covid",
      format: "text",
      template: "compact"
    };
      // Test thử các endpoints khác nhau
    const endpoints = [
      'https://dev.vietqr.org/vqr/api/generate_qr',
      'https://dev.vietqr.org/vqr/api/qr',
      'https://dev.vietqr.org/vqr/api/generate',
      'https://dev.vietqr.org/api/generate_qr',
      'https://dev.vietqr.org/api/qr'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`\n🔄 Testing endpoint: ${endpoint}`);
        const qrResponse = await axios.post(endpoint, qrData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('✅ QR Response:', qrResponse.data);
        break; // If successful, break the loop
        
      } catch (error) {
        console.log(`❌ Failed: ${endpoint} - Status: ${error.response?.status}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testToken();
