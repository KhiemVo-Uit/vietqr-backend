// Test webhook với data giả lập nhưng sử dụng ngrok URL

const axios = require('axios');

const NGROK_URL = 'https://d01c-2402-800-620c-1c66-4914-6270-f1f1-f5.ngrok-free.app';

async function testWebhookWithMockData() {
  console.log('🎯 TEST WEBHOOK VỚI DATA GIẢ LẬP');
  console.log('================================\n');
  
  console.log('🌐 Ngrok URL:', NGROK_URL);
  console.log('📡 Webhook endpoint:', `${NGROK_URL}/bank/api/transaction-sync`);
  
  try {
    // 1. Lấy token local
    console.log('\n🔑 Đang lấy access token...');
    const tokenResponse = await axios.get('http://localhost:3000/api/token');
    const accessToken = tokenResponse.data.token;
    console.log('✅ Token:', accessToken.substring(0, 50) + '...');
    
    // 2. Giả lập data webhook từ VietQR
    console.log('\n📨 Giả lập webhook từ VietQR...');
    const mockWebhookData = {
      transactionid: "TXN_NGROK_" + Date.now(),
      transactiontime: Math.floor(Date.now() / 1000),
      referencenumber: "REF" + Date.now(),
      amount: "25000", // 25,000 VNĐ
      content: "THANH TOAN QUA NGROK TEST " + Date.now(),
      bankaccount: "0397733970",
      orderId: "NGROK_ORDER_" + Date.now(),
      sign: "test_signature_ngrok",
      terminalCode: "NGROK_TERMINAL",
      urlLink: "",
      serviceCode: "VIETQR",
      subTerminalCode: "NGROK_SUB"
    };
    
    console.log('📊 Data webhook:');
    console.log('- Số tiền:', Number(mockWebhookData.amount).toLocaleString('vi-VN'), 'VNĐ');
    console.log('- Nội dung:', mockWebhookData.content);
    console.log('- Order ID:', mockWebhookData.orderId);
    
    // 3. Gửi webhook qua ngrok (giả lập VietQR gửi)
    console.log('\n🚀 Gửi webhook qua ngrok...');
    const webhookResponse = await axios.post(`${NGROK_URL}/bank/api/transaction-sync`, mockWebhookData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ WEBHOOK THÀNH CÔNG!');
    console.log('📋 Response:', JSON.stringify(webhookResponse.data, null, 2));
    
    if (!webhookResponse.data.error) {
      console.log('\n🎉 CÁC THÔNG BÁO ĐÃ ĐƯỢC KÍCH HOẠT:');
      console.log('  1. 🔊 Âm thanh thông báo');
      console.log('  2. 💾 Log trong file transaction-logs.txt');
      console.log('  3. 📧 Email notification (giả lập)');
      console.log('  4. 📱 Telegram (nếu đã setup)');
      console.log('  5. 📊 Hiển thị trên dashboard: http://localhost:3001');
      
      console.log('\n🔗 Reference ID:', webhookResponse.data.object?.reftransactionid);
    }
    
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
}

// Chạy test
testWebhookWithMockData();
