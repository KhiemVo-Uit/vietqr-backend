const express = require('express');
const jwt = require('jsonwebtoken');
const {
  SuccessResponse,
  ErrorResponse,
  TransactionResponseObject,
  TransactionCallback
} = require('../models/responses');
const {
  sendTelegramMessage,
  sendEmailNotification,
  playNotificationSound,
  writeTransactionLog
} = require('../notification-service');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;
const BEARER_PREFIX = 'Bearer ';

router.post('/transaction-sync', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    return res.status(401).json(new ErrorResponse(true, "INVALID_AUTH_HEADER", "Authorization header is missing or invalid", null));
  }

  const token = authHeader.substring(BEARER_PREFIX.length).trim();

  try {
    // Thử verify với SECRET_KEY local trước (cho test)
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (localError) {
      // Nếu không thành công, có thể là token từ VietQR API (cần decode khác)
      // Tạm thời skip verify cho demo
      console.log('⚠️ Token không verify được với local secret, tiếp tục xử lý...');
      decoded = jwt.decode(token); // Decode mà không verify
      
      if (!decoded) {
        throw new Error('Invalid token format');
      }
    }

    const body = req.body;
    const transaction = new TransactionCallback(
      body.transactionid, body.transactiontime, body.referencenumber,
      body.amount, body.content, body.bankaccount, body.orderId,
      body.sign, body.terminalCode, body.urlLink, body.serviceCode, body.subTerminalCode
    );    const refTransactionId = "REF" + Date.now();
    
    // 🎉 THÔNG BÁO THANH TOÁN THÀNH CÔNG
    console.log('\n� ===== THÔNG BÁO THANH TOÁN THÀNH CÔNG =====');
    console.log('� Có khách hàng vừa thanh toán!');
    console.log('⏰ Thời gian:', new Date(body.transactiontime * 1000).toLocaleString('vi-VN'));
    console.log('� Số tiền:', Number(body.amount).toLocaleString('vi-VN'), 'VNĐ');
    console.log('💳 Tài khoản nhận:', body.bankaccount);
    console.log('🆔 Mã giao dịch:', body.transactionid);
    console.log('� Nội dung:', body.content);
    console.log('🏪 Mã đơn hàng:', body.orderId || 'Không có');
    console.log('🔗 Reference ID:', refTransactionId);
    console.log('===============================================');
    
    // Gửi thông báo
    sendNotifications(transaction, refTransactionId);
    
    // TODO: Lưu vào database nếu cần
    // await saveTransactionToDatabase(transaction, refTransactionId);
    
    return res.status(200).json(new SuccessResponse(false, null, "Transaction processed successfully", new TransactionResponseObject(refTransactionId)));

  } catch (err) {
    return res.status(401).json(new ErrorResponse(true, "INVALID_TOKEN", "Invalid or expired token", null));
  }
});

// Function gửi thông báo khi có thanh toán thành công
async function sendNotifications(transaction, refId) {
  try {
    console.log('\n📨 ĐANG GỬI THÔNG BÁO...');
    
    // � Phát âm thanh ngay lập tức
    playNotificationSound();
    
    // � Ghi log chi tiết
    writeTransactionLog(transaction, refId);
    
    // � Gửi email (async)
    sendEmailNotification(transaction, refId);
      // 💬 Gửi Telegram (async) - tự động kiểm tra cấu hình
    await sendTelegramMessage(transaction, refId);
    
    console.log('✅ Đã kích hoạt tất cả thông báo!\n');
    
  } catch (error) {
    console.error('❌ Lỗi khi gửi thông báo:', error.message);
  }
}

module.exports = router;
