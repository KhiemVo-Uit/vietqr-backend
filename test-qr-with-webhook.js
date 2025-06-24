// Test tạo QR với webhook callback đã cấu hình

const axios = require('axios');

const NGROK_WEBHOOK_URL = 'https://d01c-2402-800-620c-1c66-4914-6270-f1f1-f5.ngrok-free.app/bank/api/transaction-sync';

async function testQRWithWebhook() {
  console.log('🚀 TEST TẠO QR VỚI WEBHOOK CALLBACK');
  console.log('===================================\n');
  
  console.log('🔗 Webhook URL:', NGROK_WEBHOOK_URL);
  
  try {
    // 1. Lấy token
    console.log('\n🔑 Đang lấy access token...');
    const tokenResponse = await axios.get('http://localhost:3000/api/token');
    const accessToken = tokenResponse.data.token;
    console.log('✅ Token:', accessToken.substring(0, 50) + '...');
    
    // 2. Tạo QR với webhook URL đã cấu hình
    console.log('\n📱 Đang tạo QR code với webhook callback...');
    
    const qrDataWithWebhook = {
      bankAccount: "0397733970",
      userBankName: "NGUYEN PHUOC DAI",
      bankCode: "970436",
      amount: 20000, // 20,000 VNĐ
      content: "Thanh toan voi webhook " + Date.now(),
      orderId: "WEBHOOK_ORDER_" + Date.now(),
      
      // 🎯 CẤU HÌNH WEBHOOK URL
      webhookUrl: NGROK_WEBHOOK_URL
    };
    
    console.log('📊 Dữ liệu QR với webhook:');
    console.log('- Số tiền:', Number(qrDataWithWebhook.amount).toLocaleString('vi-VN'), 'VNĐ');
    console.log('- Nội dung:', qrDataWithWebhook.content);
    console.log('- Order ID:', qrDataWithWebhook.orderId);
    console.log('- Webhook URL:', qrDataWithWebhook.webhookUrl);
    
    const qrResponse = await axios.post('http://localhost:3000/api/create', qrDataWithWebhook, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (qrResponse.data.success) {
      console.log('\n✅ QR CODE VỚI WEBHOOK ĐÃ TẠO THÀNH CÔNG!');
      
      if (qrResponse.data.data.qrCode) {
        console.log('\n📱 QR STRING để scan:');
        console.log('━'.repeat(80));
        console.log(qrResponse.data.data.qrCode);
        console.log('━'.repeat(80));
      }
      
      if (qrResponse.data.data.qrLink) {
        console.log('\n🔗 QR Link:');
        console.log(qrResponse.data.data.qrLink);
      }
      
      console.log('\n🎯 CÁCH TEST WEBHOOK:');
      console.log('1. 📱 Mở app banking trên điện thoại');
      console.log('2. 📷 Scan QR code ở trên');
      console.log('3. 💰 Thanh toán', Number(qrDataWithWebhook.amount).toLocaleString('vi-VN'), 'VNĐ');
      console.log('4. ✅ VietQR sẽ tự động gửi callback đến:');
      console.log(`   ${NGROK_WEBHOOK_URL}`);
      console.log('5. 🔔 Bạn sẽ nghe âm thanh thông báo ngay lập tức!');
      
      console.log('\n⏳ ĐANG CHỜ THANH TOÁN THỰC TẾ...');
      console.log('💡 Kiểm tra console server để thấy webhook callback!');
      console.log('📊 Xem dashboard: http://localhost:3001');
      
      // Hiển thị thông tin chi tiết
      console.log('\n📋 CHI TIẾT QR CODE:');
      console.log('- Bank Code:', qrResponse.data.data.bankCode || 'N/A');
      console.log('- Bank Name:', qrResponse.data.data.bankName || 'N/A');
      console.log('- Account:', qrResponse.data.data.bankAccount || 'N/A');
      console.log('- Amount:', qrResponse.data.data.amount || 'N/A');
      console.log('- Content:', qrResponse.data.data.content || 'N/A');
      
    } else {
      console.log('❌ Lỗi tạo QR:', qrResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('\n💡 Có thể API VietQR chưa hỗ trợ webhookUrl parameter');
      console.log('💡 Nhưng webhook endpoint của bạn vẫn sẵn sàng nhận callback!');
    }
  }
}

// Chạy test
testQRWithWebhook();
