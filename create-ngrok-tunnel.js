// Script đơn giản để tạo ngrok tunnel cho VietQR webhook

console.log('🌐 NGROK TUNNEL CREATOR FOR VIETQR');
console.log('==================================\n');

console.log('📋 HƯỚNG DẪN SETUP NGROK:');
console.log('=========================');
console.log('');
console.log('🔧 BƯỚC 1: Cài đặt và cấu hình ngrok');
console.log('   1. Đăng ký tại: https://ngrok.com/');
console.log('   2. Lấy auth token từ dashboard');
console.log('   3. Chạy: npx ngrok authtoken YOUR_AUTH_TOKEN');
console.log('');
console.log('🚀 BƯỚC 2: Tạo tunnel');
console.log('   1. Đảm bảo server đang chạy: npm start');
console.log('   2. Mở terminal mới và chạy: npx ngrok http 3000');
console.log('   3. Copy HTTPS URL từ ngrok (ví dụ: https://abc123.ngrok-free.app)');
console.log('');
console.log('📝 BƯỚC 3: Cập nhật webhook URL');
console.log('   - URL webhook sẽ là: https://abc123.ngrok-free.app/bank/api/transaction-sync');
console.log('   - Sử dụng URL này khi tạo QR code');
console.log('   - VietQR sẽ gửi callback đến URL này');
console.log('');

// Tạo script batch để chạy ngrok
const fs = require('fs');

const batchScript = `@echo off
echo 🚀 Starting ngrok tunnel for VietQR webhook...
echo.
echo ⚠️  Make sure your server is running at http://localhost:3000
echo.
pause
npx ngrok http 3000
`;

fs.writeFileSync('start-ngrok.bat', batchScript);

console.log('📄 Đã tạo file: start-ngrok.bat');
console.log('   Bạn có thể double-click file này để start ngrok');
console.log('');

console.log('🎯 QUICK COMMANDS:');
console.log('==================');
console.log('');
console.log('# Khởi động server (terminal 1)');
console.log('npm start');
console.log('');
console.log('# Khởi động ngrok (terminal 2)');
console.log('npx ngrok http 3000');
console.log('');
console.log('# Hoặc chạy file batch');
console.log('start-ngrok.bat');
console.log('');

console.log('📊 TESTING WORKFLOW:');
console.log('====================');
console.log('');
console.log('1. 🚀 Start server: npm start');
console.log('2. 🌐 Start ngrok: npx ngrok http 3000');
console.log('3. 📝 Copy ngrok HTTPS URL');
console.log('4. 🧪 Test webhook: npm run test:webhook');
console.log('5. 📱 Test QR creation: npm run test:qr');
console.log('');

console.log('✨ URL WEBHOOK EXAMPLE:');
console.log('======================');
console.log('');
console.log('Nếu ngrok URL là: https://abc123.ngrok-free.app');
console.log('Thì webhook URL sẽ là: https://abc123.ngrok-free.app/bank/api/transaction-sync');
console.log('');
console.log('📋 Sử dụng URL này làm webhookUrl khi tạo QR code!');
console.log('');

console.log('🎉 READY TO USE!');
console.log('================');
console.log('Sau khi có ngrok URL, bạn có thể:');
console.log('• Cập nhật URL trong test scripts');
console.log('• Tạo QR code với webhook');
console.log('• Nhận callback thực tế từ VietQR');
console.log('• Test payment với app ngân hàng');
