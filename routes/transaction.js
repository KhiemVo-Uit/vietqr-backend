const express = require('express');
const router = express.Router();

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
