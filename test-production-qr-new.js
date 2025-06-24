const axios = require('axios');

const PRODUCTION_BASE_URL = 'https://vietqr-backend.onrender.com';

async function testProductionQR() {
  try {
    console.log('🧪 TESTING PRODUCTION QR WITH NEW DATA...');
    console.log('📍 Testing complete flow: Token → QR Generation');
    console.log('🌐 Base URL:', PRODUCTION_BASE_URL);
    
    // Bước 1: Lấy token từ production endpoint
    console.log('\n🔄 Step 1: Getting access token...');
    const tokenResponse = await axios.post(`${PRODUCTION_BASE_URL}/vqr/api/token_generate`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Token received successfully!');
    const accessToken = tokenResponse.data.data.access_token;
    console.log('🔑 Access Token (first 50 chars):', accessToken.substring(0, 50) + '...');
    
    // Bước 2: Tạo QR với dữ liệu mới
    console.log('\n🔄 Step 2: Creating QR with new data...');
    const qrData = {
      "amount": "3000",
      "content": "VQR thanh toan test",
      "bankAccount": "0397733970",
      "bankCode": "MB",
      "userBankName": "Nguyen Phuoc Dai",
      "transType": "C",
      "orderId": "VietQR",
      "qrType": "0"
    };
    
    console.log('📊 QR Data being sent:', JSON.stringify(qrData, null, 2));
    
    const qrResponse = await axios.post('https://dev.vietqr.org/vqr/api/qr/generate-customer', qrData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ QR CODE GENERATED SUCCESSFULLY!');
    console.log('🎯 Full Response:', JSON.stringify(qrResponse.data, null, 2));
    
    // Hiển thị thông tin quan trọng
    console.log('\n📋 QR SUMMARY:');
    console.log('🏦 Bank:', qrResponse.data.bankName);
    console.log('💳 Account:', qrResponse.data.bankAccount);
    console.log('👤 Account Name:', qrResponse.data.userBankName);
    console.log('💰 Amount:', qrResponse.data.amount, 'VNĐ');
    console.log('📝 Content:', qrResponse.data.content);
    console.log('🆔 Order ID:', qrResponse.data.orderId);
    console.log('🔗 QR Link:', qrResponse.data.qrLink);
    console.log('📱 QR String:', qrResponse.data.qrCode);
    
    console.log('\n🎉 PRODUCTION TEST COMPLETED SUCCESSFULLY!');
    console.log('✅ All endpoints working correctly with new data format');
    
  } catch (error) {
    console.error('❌ ERROR in production test:');
    if (error.response) {
      console.error('📤 Status:', error.response.status);
      console.error('📄 Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('🔥 Error:', error.message);
    }
  }
}

// Chạy test
testProductionQR();
