// Ví dụ đăng ký webhook URL khi tạo QR với VietQR

const axios = require('axios');

async function createQRWithWebhook() {
  try {
    // 1. Lấy token từ VietQR
    const tokenResponse = await axios.get('http://localhost:3000/api/token');
    const accessToken = tokenResponse.data.token;
    
    // 2. Tạo QR code với webhook URL
    const qrData = {
      accountNo: "0123456789",
      accountName: "NGUYEN VAN A", 
      acqId: "970436",
      amount: "50000",
      addInfo: "Thanh toan don hang ABC123",
      orderId: "ORDER_" + Date.now(),
      
      // 🎯 QUAN TRỌNG: Đăng ký webhook URL
      webhookUrl: "https://yourdomain.com/bank/api/transaction-sync"
      // Hoặc nếu test local: "https://your-ngrok-url.ngrok.io/bank/api/transaction-sync"
    };
    
    const response = await axios.post('http://localhost:3000/api/create', qrData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ QR Code created with webhook:', response.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Chạy test
createQRWithWebhook();
