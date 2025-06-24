const express = require('express');
const jwt = require('jsonwebtoken');
const {
  SuccessResponse,
  ErrorResponse,
  TransactionResponseObject,
  TransactionCallback
} = require('../models/responses');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;
const BEARER_PREFIX = 'Bearer ';

router.post('/transaction-callback', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    return res.status(401).json(new ErrorResponse(true, "INVALID_AUTH_HEADER", "Authorization header is missing or invalid", null));
  }

  const token = authHeader.substring(BEARER_PREFIX.length);

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('✅ JWT Token verified:', decoded);
  } catch (err) {
    console.error('❌ JWT verification failed:', err.message);
    return res.status(401).json(new ErrorResponse(true, "INVALID_TOKEN", "Invalid or expired token", null));
  }

  const body = req.body;
  console.log('\n🎉 WEBHOOK NHẬN ĐƯỢC THANH TOÁN!');
  console.log('===============================================');
  console.log('📋 Dữ liệu nhận được:', JSON.stringify(body, null, 2));

  const refTransactionId = Date.now().toString();
  const transaction = new TransactionCallback(
    body.banknumber || '',
    body.bankaccount || '',
    body.amount || 0,
    body.content || '',
    body.transactionid || '',
    body.orderId || ''
  );

  try {
    console.log('\n💰 CHI TIẾT THANH TOÁN:');
    console.log('💵 Số tiền:', body.amount, 'VNĐ');
    console.log('🏦 Ngân hàng:', body.banknumber);
    console.log('💳 Tài khoản nhận:', body.bankaccount);
    console.log('🆔 Mã giao dịch:', body.transactionid);
    console.log('📝 Nội dung:', body.content);
    console.log('🏪 Mã đơn hàng:', body.orderId || 'Không có');
    console.log('🔗 Reference ID:', refTransactionId);
    console.log('===============================================');

    // Ghi log transaction đơn giản
    logTransaction(transaction, refTransactionId);

    return res.status(200).json(new SuccessResponse(false, null, "Transaction processed successfully", new TransactionResponseObject(refTransactionId)));

  } catch (err) {
    console.error('❌ Error processing transaction:', err.message);
    return res.status(500).json(new ErrorResponse(true, "PROCESSING_ERROR", "Error processing transaction", null));
  }
});

// Function ghi log khi có thanh toán thành công
async function logTransaction(transaction, refId) {
  try {
    console.log('\n📨 TRANSACTION RECEIVED...');
    console.log('Transaction data:', JSON.stringify(transaction, null, 2));
    console.log('Reference ID:', refId);
    console.log('✅ Transaction logged successfully!\n');
    
  } catch (error) {
    console.error('❌ Lỗi khi log transaction:', error.message);
  }
}

module.exports = router;
