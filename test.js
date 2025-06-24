const QRCode = require('qrcode');
const fs = require('fs');

const qrContent = "00020101021138540010A00000072701240006970422011003977339700208QRIBFTTA5303704540420005802VN62370833VQR72a6888148 VQR thanh toan test63045B71";

const filePath = 'vietqr.png';

QRCode.toFile(filePath, qrContent, {
  color: {
    dark: '#000',  // mã màu QR
    light: '#FFF'  // nền trắng
  }
}, function (err) {
  if (err) throw err;
  console.log(`✅ QR đã được lưu thành file: ${filePath}`);
});
