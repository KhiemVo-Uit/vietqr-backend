const axios = require('axios');
const QRCode = require('qrcode');
const fs = require('fs');

// Thông tin xác thực
const username = 'customer-vietgiaiph-user25325';
const password = 'Y3VzdG9tZXItdmlldGdpYWlwaC11c2VyMjUzMjU=';

async function createTokenAndQR() {
  try {
    console.log('🔄 Bước 1: Lấy access token...');
    
    // Bước 1: Lấy access token
    const authString = `${username}:${password}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
    
    const tokenResponse = await axios.post('https://dev.vietqr.org/vqr/api/token_generate', {}, {
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/json'
      }
    });
    
    const accessToken = tokenResponse.data.access_token;
    console.log('✅ Access Token nhận được:', accessToken);
    
    console.log('\n🔄 Bước 2: Sử dụng token để tạo QR code...');
    
    // Bước 2: Sử dụng token để tạo QR code
    const qrData = {
      "amount": "50000",
      "content": "Thanh toan don hang ABC123",
      "bankAccount": "113366668888", 
      "bankCode": "MB",
      "userBankName": "NGUYEN VAN A",
      "transType": "C",
      "qrType": "0"
    };
    
    console.log('📊 Dữ liệu gửi tạo QR:', JSON.stringify(qrData, null, 2));
    
    const qrResponse = await axios.post('https://dev.vietqr.org/vqr/api/qr/generate-customer', qrData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ QR Code được tạo thành công!');
    console.log('🎯 Kết quả:', JSON.stringify(qrResponse.data, null, 2));
    
    // Hiển thị thông tin quan trọng
    console.log('\n📋 THÔNG TIN QR CODE:');
    console.log('🏦 Ngân hàng:', qrResponse.data.bankName);
    console.log('💳 Số tài khoản:', qrResponse.data.bankAccount);
    console.log('👤 Tên tài khoản:', qrResponse.data.userBankName);
    console.log('💰 Số tiền:', qrResponse.data.amount, 'VNĐ');
    console.log('📝 Nội dung:', qrResponse.data.content);    console.log('🔗 QR Link:', qrResponse.data.qrLink);
    console.log('📱 QR Code String:', qrResponse.data.qrCode);
    
    console.log('\n🔄 Bước 3: Tạo ảnh QR code...');
    
    // Bước 3: Tạo ảnh QR code từ QR string
    const qrCodeString = qrResponse.data.qrCode;
    const fileName = `qr-code-${Date.now()}.png`;
    
    try {
      // Tạo ảnh QR và lưu vào file
      await QRCode.toFile(fileName, qrCodeString, {
        color: {
          dark: '#000000',  // Màu đen cho QR
          light: '#FFFFFF'  // Màu trắng cho nền
        },
        width: 300,  // Kích thước ảnh
        margin: 2    // Margin xung quanh QR
      });
      
      console.log('✅ Ảnh QR code đã được tạo:', fileName);
      
      // Tạo ảnh QR dạng base64 string
      const qrBase64 = await QRCode.toDataURL(qrCodeString, {
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 300,
        margin: 2
      });
      
      console.log('✅ QR Base64 đã được tạo (truncated):', qrBase64.substring(0, 100) + '...');
      
      // Lưu base64 vào file text để có thể sử dụng
      fs.writeFileSync(`qr-base64-${Date.now()}.txt`, qrBase64);
      console.log('✅ QR Base64 đã được lưu vào file txt');
      
    } catch (qrError) {
      console.error('❌ Lỗi tạo ảnh QR:', qrError.message);
    }
    
  } catch (error) {
    console.error('❌ Lỗi:', error.response?.data || error.message);
  }
}

createTokenAndQR();
