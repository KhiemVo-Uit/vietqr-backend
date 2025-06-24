// Production Webhook URL cho VietQR

const PRODUCTION_WEBHOOK_URL = 'https://vietqr-backend.onrender.com/vqr/api/test/transaction-callback';

console.log('🚀 PRODUCTION WEBHOOK URL FOR VIETQR');
console.log('===================================\n');

console.log('🔗 URL cố định (sau khi deploy):');
console.log(PRODUCTION_WEBHOOK_URL);
console.log('');

console.log('📋 CÁCH SỬ DỤNG:');
console.log('===============');
console.log('');

console.log('1️⃣ Khi tạo QR với VietQR API:');
console.log('```javascript');
console.log('{');
console.log('  "bankAccount": "0397733970",');
console.log('  "amount": "50000",');
console.log('  "content": "Thanh toan don hang",');
console.log(`  "webhookUrl": "${PRODUCTION_WEBHOOK_URL}"`);
console.log('}');
console.log('```');
console.log('');

console.log('2️⃣ Đăng ký với VietQR Support:');
console.log('- Truy cập: https://vietqr.vn/merchant/request');
console.log('- Chat với support');
console.log(`- Cung cấp webhook URL: ${PRODUCTION_WEBHOOK_URL}`);
console.log('');

console.log('3️⃣ Test webhook:');
console.log(`curl -X POST ${PRODUCTION_WEBHOOK_URL}`);
console.log('     -H "Content-Type: application/json"');
console.log('     -d \'{"test": "webhook"}\'');
console.log('');

console.log('💡 LƯU Ý:');
console.log('=========');
console.log('- URL này cố định, không thay đổi');
console.log('- Chạy 24/7 (có sleep 15 phút khi không dùng)');
console.log('- SSL tự động');
console.log('- Auto deploy từ GitHub');
console.log('');

console.log('🎯 NEXT STEPS:');
console.log('==============');
console.log('1. Deploy code lên Render');
console.log('2. Verify URL hoạt động');
console.log('3. Đăng ký với VietQR');
console.log('4. Test thanh toán thực tế');
console.log('5. Go live!');
console.log('');

console.log('✨ URL này sẽ nhận callback từ VietQR khi có thanh toán! ✨');
