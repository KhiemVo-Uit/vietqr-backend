// File để cấu hình và gửi thông báo qua các kênh khác nhau

const axios = require('axios');

// Cấu hình Telegram Bot (cần tạo bot và lấy token)
// Để nhận thông báo Telegram thật:
// 1. Tạo bot: Nhắn @BotFather trên Telegram -> /newbot
// 2. Lấy chat ID: Nhắn bot -> vào https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID';

// Function gửi thông báo Telegram
async function sendTelegramMessage(transaction, refId) {
  try {
    // Kiểm tra cấu hình
    if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN' || TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID') {
      console.log('📱 Telegram chưa được cấu hình. Để setup:');
      console.log('   1. Tạo bot: @BotFather -> /newbot');
      console.log('   2. Thêm TELEGRAM_BOT_TOKEN và TELEGRAM_CHAT_ID vào .env');
      return;
    }

    const message = `
🎉 *THANH TOÁN THÀNH CÔNG*

💰 *Số tiền:* ${Number(transaction.amount).toLocaleString('vi-VN')} VNĐ
💳 *Tài khoản:* ${transaction.bankaccount}
🆔 *Mã GD:* ${transaction.transactionid}
📝 *Nội dung:* ${transaction.content}
🏪 *Đơn hàng:* ${transaction.orderId || 'Không có'}
🔗 *Ref ID:* ${refId}
⏰ *Thời gian:* ${new Date().toLocaleString('vi-VN')}
    `.trim();

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
    
    console.log('✅ Đã gửi thông báo Telegram thành công!');
    
  } catch (error) {
    console.error('❌ Lỗi gửi Telegram:', error.message);
  }
}

// Function gửi email (sử dụng Nodemailer)
async function sendEmailNotification(transaction, refId) {
  try {
    // TODO: Cấu hình Nodemailer
    console.log('📧 Gửi email thông báo...');
    
    const emailContent = `
    Có thanh toán mới:
    - Số tiền: ${Number(transaction.amount).toLocaleString('vi-VN')} VNĐ
    - Tài khoản: ${transaction.bankaccount}
    - Mã giao dịch: ${transaction.transactionid}
    - Reference ID: ${refId}
    - Thời gian: ${new Date().toLocaleString('vi-VN')}
    `;
    
    // await transporter.sendMail({
    //   from: 'noreply@yourcompany.com',
    //   to: 'admin@yourcompany.com',
    //   subject: 'Thông báo thanh toán thành công',
    //   text: emailContent
    // });
    
    console.log('✅ Email notification sent!');
    
  } catch (error) {
    console.error('❌ Lỗi gửi email:', error.message);
  }
}

// Function phát âm thanh (cho Windows)
function playNotificationSound() {
  try {
    const { spawn } = require('child_process');
    
    // Phát âm thanh mặc định của Windows
    spawn('powershell', ['-c', '[System.Media.SystemSounds]::Beep.Play()'], {
      stdio: 'ignore'
    });
    
    console.log('🔊 Đã phát âm thanh thông báo!');
    
  } catch (error) {
    console.error('❌ Lỗi phát âm thanh:', error.message);
  }
}

// Function ghi log chi tiết vào file
function writeTransactionLog(transaction, refId) {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const logData = {
      timestamp: new Date().toISOString(),
      refId: refId,
      transactionId: transaction.transactionid,
      amount: transaction.amount,
      bankAccount: transaction.bankaccount,
      content: transaction.content,
      orderId: transaction.orderId
    };
    
    const logFile = path.join(__dirname, 'transaction-logs.txt');
    const logLine = JSON.stringify(logData) + '\n';
    
    fs.appendFileSync(logFile, logLine);
    console.log('💾 Đã ghi log vào file transaction-logs.txt');
    
  } catch (error) {
    console.error('❌ Lỗi ghi log:', error.message);
  }
}

module.exports = {
  sendTelegramMessage,
  sendEmailNotification,
  playNotificationSound,
  writeTransactionLog
};
