const axios = require('axios');

// Test API tạo QR code
async function testGenerateQR() {
  try {
    console.log('🧪 Testing QR Generation API...');
    
    const response = await axios.post('http://localhost:3000/api/create', {
      accountNo: "113366668888",
      accountName: "NGUYEN VAN A",
      acqId: "963166",
      amount: 50000,
      addInfo: "Thanh toan don hang",
      format: "text",
      template: "compact"
    });
    
    console.log('✅ Test Response:', response.data);
    
  } catch (error) {
    console.error('❌ Test Error:', error.response?.data || error.message);
  }
}

// Test API tạo QR code mẫu
async function testGenerateQRSample() {
  try {
    console.log('🧪 Testing Sample QR Generation API...');
    
    const response = await axios.post('http://localhost:3000/api/create-sample');
    
    console.log('✅ Sample Test Response:', response.data);
    
  } catch (error) {
    console.error('❌ Sample Test Error:', error.response?.data || error.message);
  }
}

// Chạy tests
setTimeout(async () => {
  await testGenerateQRSample();
  console.log('\n' + '='.repeat(50) + '\n');
  await testGenerateQR();
}, 1000);
