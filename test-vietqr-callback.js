// Test callback với API VietQR thật - theo format chính thức

const axios = require('axios');

// Cập nhật ngrok URL của bạn tại đây
const NGROK_WEBHOOK_URL = 'https://d01c-2402-800-620c-1c66-4914-6270-f1f1-f5.ngrok-free.app/bank/api/transaction-sync';
const VIETQR_TEST_CALLBACK_API = 'https://dev.vietqr.org/vqr/bank/api/test/transaction-callback';

async function testVietQRCallback() {
  console.log('🚀 TEST CALLBACK VỚI API VIETQR THẬT');
  console.log('=====================================\n');
  
  console.log('🌐 Ngrok Webhook URL:', NGROK_WEBHOOK_URL);
  console.log('📡 VietQR Test API:', VIETQR_TEST_CALLBACK_API);
  
  // Kiểm tra ngrok URL
  if (NGROK_WEBHOOK_URL.includes('your-ngrok-url')) {
    console.log('\n⚠️  CẢNH BÁO: Bạn cần cập nhật NGROK_WEBHOOK_URL với URL ngrok thật của bạn!');
    console.log('📋 Cách lấy ngrok URL:');
    console.log('   1. Chạy: ngrok http 3000');
    console.log('   2. Copy URL https://xxx.ngrok-free.app');
    console.log('   3. Thay vào NGROK_WEBHOOK_URL ở đầu file này');
    console.log('   4. Chạy lại script này\n');
  }
  
  try {
    // 1. Lấy token local để test
    console.log('\n🔑 Đang lấy access token...');
    const tokenResponse = await axios.get('http://localhost:3000/api/token');
    const accessToken = tokenResponse.data.token;
    console.log('✅ Token:', accessToken.substring(0, 50) + '...');
    
    // 2. Gọi API test callback theo format chính thức VietQR
    console.log('\n📨 Đang gọi VietQR Test Callback API...');
    
    // Format theo tài liệu VietQR chính thức
    const callbackData = {
      "bankAccount": "0397733970",
      "content": "TEST CALLBACK VIETQR " + Date.now(),
      "amount": "30000",
      "bankCode": "MB", // Mã ngân hàng MB Bank
      "transType": "C"  // C: giao dịch đến, D: giao dịch đi
    };
    
    console.log('📊 Test Callback Data (gửi đến VietQR):');
    console.log('- Tài khoản:', callbackData.bankAccount);
    console.log('- Số tiền:', Number(callbackData.amount).toLocaleString('vi-VN'), 'VNĐ');
    console.log('- Nội dung:', callbackData.content);
    console.log('- Ngân hàng:', callbackData.bankCode);
    console.log('- Loại GD:', callbackData.transType === 'C' ? 'Tiền đến' : 'Tiền đi');
    
    // Gọi API VietQR với token Bearer (cần token thật để test)
    const vietqrResponse = await axios.post(VIETQR_TEST_CALLBACK_API, callbackData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, // Token VietQR thật cần có
        'Accept': 'application/json'
      },
      timeout: 30000 // 30 giây
    });
    
    console.log('\n✅ VIETQR API RESPONSE:');
    console.log('📋 Status:', vietqrResponse.status);
    console.log('📄 Response:', JSON.stringify(vietqrResponse.data, null, 2));
    
    if (vietqrResponse.status === 200) {
      console.log('\n🎉 CALLBACK TEST THÀNH CÔNG!');
      console.log('💡 VietQR đã gửi callback đến webhook URL đã đăng ký!');
      console.log('🔔 Kiểm tra console server để thấy thông báo!');
      console.log('🎵 Bạn sẽ nghe âm thanh nếu callback thành công!');
      
      console.log('\n📊 LƯU Ý:');
      console.log('🔗 API này sẽ gửi callback đến URL đã đăng ký trong tài khoản VietQR');
      console.log('🔗 Không phải URL ngrok trong script này');
      console.log('🔗 Cần đăng ký webhook URL trong dashboard VietQR trước');
    }    
  } catch (error) {
    console.error('\n❌ LỖI CALLBACK TEST:');
    
    if (error.response) {
      console.error('📋 Status:', error.response.status);
      console.error('📄 Response:', JSON.stringify(error.response.data, null, 2));
      console.error('🔧 Headers:', JSON.stringify(error.response.headers, null, 2));
      
      if (error.response.status === 401) {
        console.error('\n🔐 LỖI XÁC THỰC:');
        console.error('💡 Token không hợp lệ hoặc hết hạn');
        console.error('💡 Cần token VietQR thật từ dashboard VietQR');
        console.error('💡 Token local chỉ để test, không dùng được với API VietQR');
      } else if (error.response.status === 400) {
        console.error('\n📝 LỖI ĐỊNH DẠNG:');
        console.error('💡 Kiểm tra format dữ liệu gửi lên');
        console.error('💡 Kiểm tra bankCode, amount, content');
      }
    } else if (error.request) {
      console.error('📡 Network Error:', error.message);
      console.error('💡 Kiểm tra kết nối internet và URL API');
    } else {
      console.error('⚙️ Error:', error.message);
    }
    
    // Fallback: Test webhook trực tiếp với ngrok
    console.log('\n🔄 FALLBACK: Test webhook trực tiếp qua ngrok...');
    if (!NGROK_WEBHOOK_URL.includes('your-ngrok-url')) {
      await testWebhookDirect();
    } else {
      console.log('⚠️  Cần cập nhật NGROK_WEBHOOK_URL trước khi test direct webhook');
    }
  }
}

// Function test webhook trực tiếp qua ngrok (backup)
async function testWebhookDirect() {
  try {
    console.log('📨 Gửi test webhook trực tiếp qua ngrok...');
    
    const mockWebhookData = {
      transactionid: "DIRECT_TEST_" + Date.now(),
      transactiontime: Math.floor(Date.now() / 1000),
      referencenumber: "REF" + Date.now(),
      amount: "25000",
      content: "DIRECT WEBHOOK TEST " + Date.now(),
      bankaccount: "0397733970",
      orderId: "DIRECT_ORDER_" + Date.now(),
      sign: "direct_test_signature",
      terminalCode: "DIRECT",
      urlLink: "",
      serviceCode: "DIRECT_SERVICE",
      subTerminalCode: "DIRECT_SUB"
    };
    
    console.log('📊 Mock Data:');
    console.log('- Số tiền:', Number(mockWebhookData.amount).toLocaleString('vi-VN'), 'VNĐ');
    console.log('- Nội dung:', mockWebhookData.content);
    
    // Lấy token local để test
    const tokenResponse = await axios.get('http://localhost:3000/api/token');
    const accessToken = tokenResponse.data.token;
    
    // Gửi webhook qua ngrok
    const webhookResponse = await axios.post(NGROK_WEBHOOK_URL, mockWebhookData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('\n✅ DIRECT WEBHOOK THÀNH CÔNG!');
    console.log('📋 Response:', JSON.stringify(webhookResponse.data, null, 2));
    console.log('🎵 Kiểm tra âm thanh và notification trong console server!');
    
  } catch (directError) {
    console.error('\n❌ DIRECT WEBHOOK FAILED:');
    if (directError.response) {
      console.error('📋 Status:', directError.response.status);
      console.error('📄 Response:', JSON.stringify(directError.response.data, null, 2));
    } else {
      console.error('⚙️ Error:', directError.message);
    }
    
    console.log('\n💡 KIỂM TRA:');
    console.log('🔗 Server có đang chạy tại http://localhost:3000?');
    console.log('🔗 Ngrok có đang chạy và tunnel đến port 3000?');
    console.log('🔗 URL ngrok có đúng format?');
  }
}

// Hiển thị hướng dẫn
function showGuide() {
  console.log('\n📚 HƯỚNG DẪN SỬ DỤNG:');
  console.log('===================');
  console.log('');
  console.log('1️⃣ ĐỂ TEST VỚI API VIETQR THẬT:');
  console.log('   - Cần có tài khoản VietQR developer');
  console.log('   - Cần token VietQR thật từ dashboard');
  console.log('   - Cần đăng ký webhook URL trong VietQR dashboard');
  console.log('');
  console.log('2️⃣ ĐỂ TEST LOCAL VỚI NGROK:');
  console.log('   - Cập nhật NGROK_WEBHOOK_URL ở đầu file');
  console.log('   - Chạy: ngrok http 3000');
  console.log('   - Chạy script này để test direct webhook');
  console.log('');
  console.log('3️⃣ SETUP NGROK:');
  console.log('   - npm install -g ngrok');
  console.log('   - ngrok authtoken YOUR_TOKEN');
  console.log('   - ngrok http 3000');
  console.log('   - Copy https://xxx.ngrok-free.app');
  console.log('');
  console.log('4️⃣ KIỂM TRA KẾT QUẢ:');
  console.log('   - Console server sẽ hiển thị thông báo');
  console.log('   - Âm thanh sẽ phát khi có callback');
  console.log('   - Log file sẽ ghi lại transaction');
  console.log('');
}

// Chạy test
console.log('🔍 VietQR Callback Test Tool');
console.log('============================\n');

// Hiển thị hướng dẫn trước
showGuide();

// Chạy test chính
testVietQRCallback();
