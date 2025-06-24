const express = require('express');
const axios = require('axios');
const QRCode = require('qrcode');
const router = express.Router();

// Thông tin xác thực
const username = 'customer-vietgiaiph-user25325';
const password = 'Y3VzdG9tZXItdmlldGdpYWlwaC11c2VyMjUzMjU=';

// Function để lấy access token
async function getAccessToken() {
  try {
    const authString = `${username}:${password}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
    
    const response = await axios.post('https://dev.vietqr.org/vqr/api/token_generate', {}, {
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/json'
      }
    });
    
    const token = response.data.access_token;
    console.log('✅ Token generated successfully');
    
    return token;
  } catch (error) {
    console.error('❌ Token Error:', error.response?.data || error.message);
    throw new Error('Không thể lấy access token');
  }
}

// Function để tạo QR code
async function generateQRCode(token, qrData) {
  try {
    console.log('📊 Creating QR with data:', JSON.stringify(qrData, null, 2));
    
    const response = await axios.post('https://dev.vietqr.org/vqr/api/qr/generate-customer', qrData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ QR code generated successfully');
    return response.data;
  } catch (error) {
    console.error('❌ QR Generation Error:', error.response?.data || error.message);
    throw new Error(`Không thể tạo QR code: ${error.response?.data?.message || error.message}`);
  }
}

// Route để tạo QR code
router.post('/create', async (req, res) => {
  try {
    // Lấy access token
    console.log('🔄 Đang lấy access token...');
    const token = await getAccessToken();
    console.log('✅ Access Token đã lấy thành công');
      // Lấy dữ liệu từ request body
    const {
      bankAccount,
      userBankName,
      bankCode,
      amount,
      content,
      transType,
      qrType,
      orderId,
      serviceCode,
      terminalCode,
      subTerminalCode,
      webhookUrl // 🎯 THÊM WEBHOOK URL
    } = req.body;
    
    // Kiểm tra các trường bắt buộc
    if (!bankAccount || !userBankName || !bankCode) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: bankAccount, userBankName, bankCode'
      });
    }
    
    // Chuẩn bị dữ liệu để tạo QR
    const qrData = {
      amount: amount || "0",
      content: content || "",
      bankAccount: bankAccount,
      bankCode: bankCode,
      userBankName: userBankName,
      transType: transType || "C",
      qrType: qrType || "0"
    };
    
    // Thêm các trường optional nếu có
    if (orderId) qrData.orderId = orderId;
    if (serviceCode) qrData.serviceCode = serviceCode;
    if (terminalCode) qrData.terminalCode = terminalCode;
    if (subTerminalCode) qrData.subTerminalCode = subTerminalCode;
    
    // 🎯 THÊM WEBHOOK URL NẾU CÓ
    if (webhookUrl) {
      qrData.webhookUrl = webhookUrl;
      console.log('🔗 Webhook URL đã được cấu hình:', webhookUrl);
    }
    
    console.log('🔄 Đang tạo QR code với dữ liệu:', qrData);
    
    // Tạo QR code
    const qrResult = await generateQRCode(token, qrData);
    
    console.log('✅ QR code đã được tạo thành công');
    
    res.json({
      success: true,
      message: 'QR code đã được tạo thành công',
      data: qrResult
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route để tạo QR code dưới dạng ảnh
router.post('/create-image', async (req, res) => {
  try {
    // Lấy access token
    console.log('🔄 Đang lấy access token...');
    const token = await getAccessToken();
    console.log('✅ Access Token đã lấy thành công');
    
    // Lấy dữ liệu từ request body
    const {
      bankAccount,
      userBankName,
      bankCode,
      amount,
      content,
      transType,
      qrType,
      orderId,
      serviceCode,
      terminalCode,
      subTerminalCode,
      imageFormat = 'png', // png hoặc base64
      imageSize = 300
    } = req.body;
    
    // Kiểm tra các trường bắt buộc
    if (!bankAccount || !userBankName || !bankCode) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: bankAccount, userBankName, bankCode'
      });
    }
    
    // Chuẩn bị dữ liệu để tạo QR
    const qrData = {
      amount: amount || "0",
      content: content || "",
      bankAccount: bankAccount,
      bankCode: bankCode,
      userBankName: userBankName,
      transType: transType || "C",
      qrType: qrType || "0"
    };
    
    // Thêm các trường optional nếu có
    if (orderId) qrData.orderId = orderId;
    if (serviceCode) qrData.serviceCode = serviceCode;
    if (terminalCode) qrData.terminalCode = terminalCode;
    if (subTerminalCode) qrData.subTerminalCode = subTerminalCode;
    
    console.log('🔄 Đang tạo QR code với dữ liệu:', qrData);
    
    // Tạo QR code
    const qrResult = await generateQRCode(token, qrData);
    
    console.log('✅ QR code đã được tạo thành công');
    console.log('🔄 Đang tạo ảnh QR...');
    
    // Tạo ảnh QR từ QR string
    const qrCodeString = qrResult.qrCode;
    
    if (imageFormat === 'base64') {
      // Tạo base64 image
      const qrBase64 = await QRCode.toDataURL(qrCodeString, {
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: imageSize,
        margin: 2
      });
      
      res.json({
        success: true,
        message: 'QR code ảnh đã được tạo thành công',
        data: {
          ...qrResult,
          qrImage: qrBase64,
          imageFormat: 'base64'
        }
      });
    } else {
      // Tạo PNG buffer
      const qrBuffer = await QRCode.toBuffer(qrCodeString, {
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: imageSize,
        margin: 2,
        type: 'png'
      });
      
      // Trả về ảnh PNG
      res.set({
        'Content-Type': 'image/png',
        'Content-Length': qrBuffer.length,
        'Cache-Control': 'no-cache'
      });
      res.send(qrBuffer);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Route để lấy access token (simplified)
router.get('/token', async (req, res) => {
  try {
    console.log('🔄 Đang lấy access token...');
    const token = await getAccessToken();
    console.log('✅ Access Token đã lấy thành công');
    
    res.json({
      success: true,
      message: 'Access token đã được lấy thành công',
      token: token,
      expiresIn: '5 minutes'
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;