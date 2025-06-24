const axios = require('axios');

async function testCompleteQR() {
  try {
    console.log('🔄 Testing complete QR API...');
    
    const response = await axios.post('http://localhost:3000/api/create-sample', {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Response Status:', response.status);
    console.log('✅ Full Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.data && response.data.data.qrCode) {
      console.log('\n🎯 QR Code String:', response.data.data.qrCode);
      console.log('🔗 QR Link:', response.data.data.qrLink);
      console.log('🏦 Bank Info:', {
        bankCode: response.data.data.bankCode,
        bankName: response.data.data.bankName,
        bankAccount: response.data.data.bankAccount,
        userBankName: response.data.data.userBankName,
        amount: response.data.data.amount,
        content: response.data.data.content
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testCompleteQR();
