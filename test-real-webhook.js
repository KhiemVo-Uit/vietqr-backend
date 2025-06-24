// Script test webhook thực tế với ngrok

const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function testRealWebhook() {
  console.log('🚀 TEST WEBHOOK THỰC TẾ VỚI VIETQR');
  console.log('==================================\n');
  
  // Nhập ngrok URL
  const ngrokUrl = await new Promise((resolve) => {
    rl.question('📡 Nhập ngrok HTTPS URL (ví dụ: https://abc123.ngrok.io): ', resolve);
  });
  
  if (!ngrokUrl.startsWith('https://')) {
    console.log('❌ URL phải bắt đầu bằng https://');
    rl.close();
    return;
  }
  
  try {
    // 1. Lấy token
    console.log('\n🔑 Đang lấy access token...');
    const tokenResponse = await axios.get('http://localhost:3000/api/token');
    const accessToken = tokenResponse.data.token;
    console.log('✅ Token:', accessToken.substring(0, 50) + '...');
    
    // 2. Tạo QR với webhook URL
    console.log('\n📱 Đang tạo QR code với webhook...');
    const qrData = {
      accountNo: "0123456789",
      accountName: "NGUYEN VAN A",
      acqId: "970436", 
      amount: "10000", // 10,000 VNĐ để test
      addInfo: "Test webhook VietQR " + Date.now(),
      orderId: "WEBHOOK_TEST_" + Date.now(),
      webhookUrl: `${ngrokUrl}/bank/api/transaction-sync`
    };
    
    const qrResponse = await axios.post('http://localhost:3000/api/create', qrData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (qrResponse.data.qrDataURL) {
      console.log('✅ QR Code đã tạo thành công!');
      console.log('📱 QR String:', qrResponse.data.qrDataURL);
      console.log('🔗 Webhook URL:', `${ngrokUrl}/bank/api/transaction-sync`);
      
      console.log('\n🎯 CÁCH TEST:');
      console.log('1. Mở app banking trên điện thoại');
      console.log('2. Scan QR code này:', qrResponse.data.qrDataURL);
      console.log('3. Thanh toán 10,000 VNĐ');
      console.log('4. VietQR sẽ gửi webhook đến server của bạn');
      console.log('5. Bạn sẽ nhận được thông báo ngay lập tức!');
      
      console.log('\n📊 Webhook sẽ được gửi đến:');
      console.log(`   ${ngrokUrl}/bank/api/transaction-sync`);
      
      console.log('\n⏳ Đang chờ webhook từ VietQR...');
      console.log('💡 Kiểm tra console server để thấy thông báo thanh toán!');
      
    } else {
      console.log('❌ Lỗi tạo QR:', qrResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
  
  rl.close();
}

// Chạy test
testRealWebhook();
