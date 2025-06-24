// Test webhook nhanh với ngrok URL có sẵn

const axios = require('axios');

const NGROK_URL = 'https://d01c-2402-800-620c-1c66-4914-6270-f1f1-f5.ngrok-free.app';

async function quickTestWebhook() {
  console.log('🚀 TEST WEBHOOK NHANH VỚI NGROK');
  console.log('===============================\n');
  
  console.log('🌐 Ngrok URL:', NGROK_URL);
  console.log('📡 Webhook endpoint:', `${NGROK_URL}/bank/api/transaction-sync`);
  
  try {
    // 1. Lấy token
    console.log('\n🔑 Đang lấy access token...');
    const tokenResponse = await axios.get('http://localhost:3000/api/token');
    const accessToken = tokenResponse.data.token;
    console.log('✅ Token:', accessToken.substring(0, 50) + '...');    // 2. Tạo QR với webhook URL
    console.log('\n📱 Đang tạo QR code với webhook...');
    const qrData = {
      bankAccount: "0397733970",
      userBankName: "NGUYEN PHUOC DAI",
      bankCode: "970436", 
      amount: 15000, // 15,000 VNĐ để test
      content: "Test webhook ngrok " + Date.now(),
      orderId: "NGROK_TEST_" + Date.now()
    };
    
    const qrResponse = await axios.post('http://localhost:3000/api/create', qrData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (qrResponse.data.qrDataURL) {
      console.log('✅ QR Code đã tạo thành công!');
      console.log('\n📱 QR STRING để scan:');
      console.log('━'.repeat(80));
      console.log(qrResponse.data.qrDataURL);
      console.log('━'.repeat(80));
      
      console.log('\n🔗 Webhook URL đã đăng ký:');
      console.log(`   ${NGROK_URL}/bank/api/transaction-sync`);
      
      console.log('\n🎯 HƯỚNG DẪN TEST:');
      console.log('1. 📱 Mở app banking trên điện thoại');
      console.log('2. 📷 Chọn "Chuyển khoản" → "Quét mã QR"');
      console.log('3. 📸 Scan QR string ở trên');
      console.log('4. 💰 Thanh toán 15,000 VNĐ');
      console.log('5. ✅ VietQR sẽ gửi webhook → Bạn nhận thông báo ngay!');
      
      console.log('\n⏳ ĐANG CHỜ WEBHOOK...');
      console.log('💡 Kiểm tra console server để thấy thông báo!');
      console.log('🔔 Bạn sẽ nghe âm thanh khi có thanh toán!');
      
    } else {
      console.log('❌ Lỗi tạo QR:', qrResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
}

// Chạy test
quickTestWebhook();
