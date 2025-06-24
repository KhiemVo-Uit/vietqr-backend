const axios = require('axios');
const fs = require('fs');

async function createQRImage() {
  try {
    console.log('🔄 Đang tạo ảnh QR cho Nguyen Phuoc Dai...');
    
    const qrData = {
      bankAccount: "0397733970",
      userBankName: "Nguyen Phuoc Dai", 
      bankCode: "MB",
      amount: "3000",
      content: "VQR thanh toan test",
      transType: "C",
      orderId: "VietQR",
      qrType: "0",
      imageFormat: "base64",
      imageSize: 400
    };
    
    const response = await axios.post('http://localhost:3000/api/create-image', qrData);
    
    if (response.data.success) {
      const qrImage = response.data.data.qrImage;
      const qrCode = response.data.data.qrCode;
      const qrLink = response.data.data.qrLink;
      
      // Lưu ảnh base64 vào file
      const base64Data = qrImage.replace(/^data:image\/png;base64,/, "");
      const filename = `qr-nguyen-phuoc-dai-${Date.now()}.png`;
      
      fs.writeFileSync(filename, base64Data, 'base64');
      
      console.log('✅ THÀNH CÔNG!');
      console.log('📁 Ảnh QR đã được lưu:', filename);
      console.log('🏦 Ngân hàng:', response.data.data.bankName);
      console.log('💳 Số tài khoản:', response.data.data.bankAccount);
      console.log('👤 Tên:', response.data.data.userBankName);
      console.log('💰 Số tiền:', response.data.data.amount, 'VNĐ');
      console.log('📝 Nội dung:', response.data.data.content);
      console.log('🔗 QR Link:', qrLink);
      console.log('📱 QR Code String:', qrCode);
      
      // Lưu base64 vào file text để dễ copy
      const base64Filename = `qr-base64-${Date.now()}.txt`;
      fs.writeFileSync(base64Filename, qrImage);
      console.log('📄 Base64 đã được lưu:', base64Filename);
      
    } else {
      console.error('❌ Lỗi:', response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

createQRImage();
