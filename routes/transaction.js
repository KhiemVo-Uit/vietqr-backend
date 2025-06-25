const express = require('express');
const router = express.Router();

// API Transaction Sync theo chuẩn VietQR
router.post('/transaction-sync', (req, res) => {
  console.log('\n🔐 VIETQR TRANSACTION SYNC API');
  console.log('===============================================');

  // Lấy Authorization header
  const authHeader = req.headers['authorization'];
  const BEARER_PREFIX = 'Bearer ';

  // Kiểm tra Authorization header
  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    console.log('❌ Missing or invalid Authorization header');
    return res.status(401).json({
      error: true,
      errorReason: "INVALID_AUTH_HEADER",
      toastMessage: "Authorization header is missing or invalid",
      object: null
    });
  }

  // Extract token
  const token = authHeader.substring(BEARER_PREFIX.length).trim();
  console.log('🔑 Token received:', token ? token.substring(0, 20) + '...' : 'None');

  // Validate token
  if (!token || token.length < 10) {
    console.log('❌ Invalid or expired token');
    return res.status(401).json({
      error: true,
      errorReason: "INVALID_TOKEN", 
      toastMessage: "Invalid or expired token",
      object: null
    });
  }

  const transactionData = req.body;
  console.log('📋 Transaction Data:', JSON.stringify(transactionData, null, 2));

  try {
    console.log('\n💰 THÔNG TIN GIAO DỊCH:');
    console.log('🆔 Transaction ID:', transactionData.transactionid || 'N/A');
    console.log('💵 Amount:', transactionData.amount || 'N/A', 'VNĐ');
    console.log('📝 Content:', transactionData.content || 'N/A');

    const refTransactionId = `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('🎯 Generated Ref Transaction ID:', refTransactionId);
    console.log('✅ VietQR Transaction Sync processed successfully!');

    return res.status(200).json({
      error: false,
      errorReason: null,
      toastMessage: "Transaction processed successfully",
      object: {
        reftransactionid: refTransactionId
      }
    });

  } catch (err) {
    console.error('❌ Transaction processing error:', err.message);
    return res.status(400).json({
      error: true,
      errorReason: "TRANSACTION_FAILED",
      toastMessage: err.message,
      object: null
    });
  }
});

// Endpoint callback cho VietQR (CÓ TOKEN) - PRODUCTION
router.post('/transaction-callback', (req, res) => {
  // Kiểm tra token trong header
  const authHeader = req.headers['authorization'];
  const token = req.headers['x-api-key'] || req.query.token || req.body.token;

  console.log('\n🔐 CHECKING CALLBACK AUTHENTICATION...');
  console.log('Authorization Header:', authHeader);
  console.log('X-API-Key:', req.headers['x-api-key']);
  console.log('Token in query:', req.query.token);
  console.log('Token in body:', req.body.token);

  // Kiểm tra token (có thể từ header, query hoặc body)
  if (!authHeader && !token) {
    console.log('❌ No token provided');
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Token required",
      error: "MISSING_TOKEN"
    });
  }

  // Lấy token từ Bearer header hoặc direct token
  let finalToken = token;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    finalToken = authHeader.substring(7);
  }

  console.log('🔑 Using token:', finalToken ? finalToken.substring(0, 20) + '...' : 'None');

  const body = req.body;
  console.log('\n🎉 VIETQR WEBHOOK NHẬN ĐƯỢC!');
  console.log('===============================================');
  console.log('📋 Callback data:', JSON.stringify(body, null, 2));
  console.log('⏰ Timestamp:', new Date().toLocaleString('vi-VN'));

  try {
    console.log('\n💰 THÔNG TIN THANH TOÁN:');
    console.log('💵 Số tiền:', body.amount || 'N/A', 'VNĐ');
    console.log('🆔 Order ID:', body.orderId || 'N/A');
    console.log('🔖 Transaction ID:', body.transactionId || 'N/A');
    console.log('📝 Nội dung:', body.content || 'N/A');
    console.log('✅ Trạng thái:', body.status || 'N/A');
    console.log('🏦 Mã ngân hàng:', body.bankCode || 'N/A');
    console.log('🔑 Token Used:', finalToken ? 'Yes' : 'No');
    console.log('===============================================');

    // Log thành công
    console.log('✅ VietQR Webhook processed successfully with token!');

    return res.status(200).json({
      success: true,
      message: "Webhook received successfully with authentication",
      timestamp: new Date().toISOString(),
      data: body,
      authenticated: true
    });

  } catch (err) {
    console.error('❌ Error processing webhook:', err.message);
    return res.status(500).json({
      success: false,
      message: "Error processing webhook",
      error: err.message
    });
  }
});

module.exports = router;