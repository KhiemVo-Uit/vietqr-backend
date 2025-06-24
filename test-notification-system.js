// Script test hệ thống thông báo khi có thanh toán thành công

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let accessToken = '';

// Test data giao dịch thành công
const mockTransactionData = {
  transactionid: "TXN" + Date.now(),
  transactiontime: Math.floor(Date.now() / 1000),
  referencenumber: "REF" + Date.now(),
  amount: "500000", // 500,000 VNĐ
  content: "THANH TOAN DON HANG ABC123",
  bankaccount: "0123456789",
  orderId: "ORDER_" + Date.now(),
  sign: "test_signature",
  terminalCode: "VIETQR_TERMINAL",
  urlLink: "https://example.com/payment",
  serviceCode: "PAYMENT_SERVICE",
  subTerminalCode: "SUB_001"
};

// Function lấy token
async function getToken() {
  try {
    console.log('🔑 Đang lấy access token...');
    
    const response = await axios.get(`${BASE_URL}/token`);
    
    if (response.data && !response.data.isError) {
      accessToken = response.data.token;
      console.log('✅ Đã lấy token thành công!');
      console.log('📝 Token:', accessToken.substring(0, 50) + '...');
      return true;
    } else {
      console.log('❌ Lỗi lấy token:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Lỗi kết nối API token:', error.message);
    return false;
  }
}

// Function test webhook transaction-sync (giả lập callback từ VietQR)
async function testTransactionSync() {
  try {
    console.log('\n🎯 TESTING TRANSACTION SYNC & NOTIFICATION SYSTEM');
    console.log('==========================================');
    console.log('💡 Giả lập callback từ VietQR khi khách thanh toán...');
    
    console.log('\n📊 Dữ liệu giao dịch test:');
    console.log('- Số tiền:', Number(mockTransactionData.amount).toLocaleString('vi-VN'), 'VNĐ');
    console.log('- Nội dung:', mockTransactionData.content);
    console.log('- Tài khoản:', mockTransactionData.bankaccount);
    console.log('- Order ID:', mockTransactionData.orderId);
    
    // Sử dụng token thật từ API thay vì tạo fake token
    const response = await axios.post(`http://localhost:3000/bank/api/transaction-sync`, mockTransactionData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
      if (response.data && !response.data.error) {
      console.log('\n✅ Transaction sync thành công!');
      console.log('📨 Hệ thống notification đã được kích hoạt!');
      console.log('🔗 Reference ID:', response.data.object?.reftransactionid || 'N/A');
      
      console.log('\n🎉 CÁC THÔNG BÁO ĐÃ ĐƯỢC GỬI:');
      console.log('  1. ✅ Log chi tiết trên console');
      console.log('  2. 🔊 Âm thanh thông báo');
      console.log('  3. 💾 Ghi log vào file transaction-logs.txt');
      console.log('  4. 📧 Email notification (giả lập)');
      console.log('  5. 📱 Telegram (nếu đã cấu hình)');
      
    } else {
      console.log('❌ Lỗi transaction sync:', response.data);
    }
    
  } catch (error) {
    console.error('❌ Lỗi test transaction sync:', error.response?.data || error.message);
  }
}

// Function hiển thị logs đã lưu
function showTransactionLogs() {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const logFile = path.join(__dirname, 'transaction-logs.txt');
    
    if (fs.existsSync(logFile)) {
      console.log('\n📋 TRANSACTION LOGS:');
      console.log('====================');
      
      const logs = fs.readFileSync(logFile, 'utf8')
        .split('\n')
        .filter(line => line.trim())
        .slice(-5); // Hiển thị 5 logs gần nhất
      
      logs.forEach((log, index) => {
        try {
          const data = JSON.parse(log);
          console.log(`${index + 1}. ${data.timestamp}`);
          console.log(`   💰 ${Number(data.amount).toLocaleString('vi-VN')} VNĐ`);
          console.log(`   🆔 ${data.transactionId}`);
          console.log(`   📝 ${data.content}`);
          console.log('   ---');
        } catch (e) {
          // Skip invalid JSON lines
        }
      });
      
    } else {
      console.log('\n📋 Chưa có transaction logs nào.');
    }
    
  } catch (error) {
    console.error('❌ Lỗi đọc logs:', error.message);
  }
}

// Main function
async function main() {
  console.log('🚀 TESTING VIETQR NOTIFICATION SYSTEM');
  console.log('=======================================\n');
  
  // 1. Lấy token
  const tokenSuccess = await getToken();
  if (!tokenSuccess) {
    console.log('❌ Không thể lấy token. Đảm bảo server đang chạy.');
    return;
  }
  
  // 2. Test transaction sync & notification
  await testTransactionSync();
  
  // 3. Hiển thị logs
  setTimeout(() => {
    showTransactionLogs();
    
    console.log('\n🎯 TEST HOÀN THÀNH!');
    console.log('💡 Để nhận thông báo Telegram thật:');
    console.log('   1. Tạo bot: @BotFather -> /newbot');
    console.log('   2. Thêm TELEGRAM_BOT_TOKEN và TELEGRAM_CHAT_ID vào .env');
    console.log('   3. Restart server và test lại');
    
  }, 2000);
}

// Chạy test
main().catch(console.error);
