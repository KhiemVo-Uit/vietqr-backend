// Hướng dẫn và script setup Telegram Bot để nhận thông báo thanh toán

console.log('🤖 HƯỚNG DẪN SETUP TELEGRAM BOT');
console.log('================================\n');

console.log('📋 CÁC BƯỚC SETUP:');
console.log('1. Mở Telegram và tìm @BotFather');
console.log('2. Nhắn lệnh: /newbot');
console.log('3. Đặt tên bot (vd: VietQR Payment Bot)');
console.log('4. Đặt username bot (vd: vietqr_payment_bot)');
console.log('5. Copy BOT TOKEN mà BotFather gửi\n');

console.log('🆔 LẤY CHAT ID:');
console.log('1. Nhắn tin cho bot vừa tạo');
console.log('2. Vào URL: https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates');
console.log('3. Tìm "chat":{"id": và copy số ID\n');

console.log('⚙️ CẤU HÌNH:');
console.log('Thêm vào file .env:');
console.log('TELEGRAM_BOT_TOKEN=your_bot_token_here');
console.log('TELEGRAM_CHAT_ID=your_chat_id_here\n');

console.log('🧪 TEST TELEGRAM BOT:');
console.log('Chạy lệnh: node test-telegram-bot.js\n');

// Function test gửi tin nhắn Telegram
async function testTelegramBot() {
  const axios = require('axios');
  
  // Đọc từ .env
  require('dotenv').config();
  
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId || botToken === 'YOUR_BOT_TOKEN' || chatId === 'YOUR_CHAT_ID') {
    console.log('❌ Chưa cấu hình Telegram Bot trong .env file');
    console.log('💡 Thêm TELEGRAM_BOT_TOKEN và TELEGRAM_CHAT_ID vào .env');
    return;
  }
  
  try {
    console.log('📱 Đang test gửi tin nhắn Telegram...');
    
    const message = `
🤖 *TEST TELEGRAM BOT*

✅ Bot đã được cấu hình thành công!
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}
🎯 Bây giờ bạn sẽ nhận được thông báo khi có thanh toán thành công!

🚀 Để test thông báo thanh toán:
\`node test-notification-system.js\`
    `.trim();
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    });
    
    if (response.data.ok) {
      console.log('✅ Test thành công! Kiểm tra tin nhắn trong Telegram.');
      console.log('🎉 Bot đã sẵn sàng nhận thông báo thanh toán!');
    } else {
      console.log('❌ Lỗi:', response.data);
    }
    
  } catch (error) {
    console.error('❌ Lỗi test Telegram bot:', error.response?.data || error.message);
    console.log('💡 Kiểm tra lại BOT_TOKEN và CHAT_ID');
  }
}

// Chạy test nếu file được chạy trực tiếp
if (require.main === module) {
  testTelegramBot();
}

module.exports = { testTelegramBot };
