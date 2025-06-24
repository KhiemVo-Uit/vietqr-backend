// Test Runner - Chạy tất cả tests theo thứ tự

const { spawn } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🧪 VIETQR SYSTEM TEST RUNNER');
console.log('============================\n');

const tests = [
  {
    name: '1. Test Notification System (Local)',
    script: 'test-notification-system.js',
    description: 'Kiểm tra hệ thống thông báo local (âm thanh, log, console)'
  },
  {
    name: '2. Test Ngrok Webhook',
    script: 'test-ngrok-webhook.js',
    description: 'Test webhook qua ngrok với data giả lập'
  },
  {
    name: '3. Quick Webhook Test',
    script: 'quick-webhook-test.js',
    description: 'Test tạo QR + webhook trong 1 lần'
  },
  {
    name: '4. Test QR with Webhook',
    script: 'test-qr-with-webhook.js',
    description: 'Test tạo QR code với webhook URL'
  },
  {
    name: '5. Test VietQR Callback API',
    script: 'test-vietqr-callback.js',
    description: 'Test với API callback chính thức của VietQR'
  }
];

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function runTest(test) {
  console.log(`\n🚀 Đang chạy: ${test.name}`);
  console.log(`📝 Mô tả: ${test.description}`);
  console.log(`📄 Script: ${test.script}`);
  console.log('=' .repeat(50));
  
  return new Promise((resolve) => {
    const child = spawn('node', [test.script], {
      stdio: 'inherit',
      shell: true
    });
    
    child.on('close', (code) => {
      console.log(`\n✅ Test completed with code: ${code}`);
      resolve(code);
    });
    
    child.on('error', (error) => {
      console.error(`❌ Error running test: ${error.message}`);
      resolve(1);
    });
  });
}

async function showMenu() {
  console.log('\n📋 CHỌN TEST MUỐN CHẠY:');
  console.log('=====================\n');
  
  tests.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}`);
    console.log(`   📝 ${test.description}`);
    console.log('');
  });
  
  console.log('0. ❌ Thoát');
  console.log('A. 🚀 Chạy tất cả tests');
  console.log('H. 📚 Hiển thị hướng dẫn');
  console.log('');
}

async function showGuide() {
  console.log('\n📚 HƯỚNG DẪN SỬ DỤNG TEST RUNNER');
  console.log('==============================\n');
  
  console.log('🔧 SETUP TRƯỚC KHI TEST:');
  console.log('1. Đảm bảo server đang chạy: node app.js');
  console.log('2. Cài đặt ngrok: npm install -g ngrok');
  console.log('3. Chạy ngrok: ngrok http 3000');
  console.log('4. Cập nhật ngrok URL trong test scripts');
  console.log('');
  
  console.log('📝 THỨ TỰ TEST ĐỀ XUẤT:');
  console.log('1. Test 1: Kiểm tra notification cơ bản (local)');
  console.log('2. Test 2: Kiểm tra webhook qua ngrok');
  console.log('3. Test 3: Test tạo QR + webhook tích hợp');
  console.log('4. Test 4: Test API tạo QR với webhook');
  console.log('5. Test 5: Test với API VietQR thật (cần token)');
  console.log('');
  
  console.log('⚠️  LƯU Ý:');
  console.log('- Test 1 có thể chạy ngay không cần setup');
  console.log('- Test 2-4 cần ngrok và cập nhật URL');
  console.log('- Test 5 cần token VietQR thật');
  console.log('');
  
  console.log('🔍 KIỂM TRA KẾT QUẢ:');
  console.log('- Xem console output của từng test');
  console.log('- Nghe âm thanh beep khi có callback');
  console.log('- Kiểm tra file transaction-logs.txt');
  console.log('- Xem QR code được tạo (file .png)');
  console.log('');
}

async function runAllTests() {
  console.log('\n🚀 CHẠY TẤT CẢ TESTS');
  console.log('==================\n');
  
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    await runTest(test);
    
    if (i < tests.length - 1) {
      const continueChoice = await askQuestion('\n⏯️  Tiếp tục test tiếp theo? (y/n): ');
      if (continueChoice.toLowerCase() !== 'y' && continueChoice.toLowerCase() !== 'yes') {
        console.log('⏹️  Dừng test runner.');
        break;
      }
    }
  }
  
  console.log('\n🎉 HOÀN THÀNH TẤT CẢ TESTS!');
}

async function main() {
  console.log('💡 Đảm bảo server đang chạy tại http://localhost:3000');
  console.log('💡 Đọc SYSTEM_GUIDE.md để biết chi tiết setup\n');
  
  while (true) {
    await showMenu();
    
    const choice = await askQuestion('👉 Nhập lựa chọn của bạn: ');
    
    if (choice === '0') {
      console.log('👋 Tạm biệt!');
      break;
    } else if (choice.toLowerCase() === 'a') {
      await runAllTests();
    } else if (choice.toLowerCase() === 'h') {
      await showGuide();
    } else {
      const testIndex = parseInt(choice) - 1;
      if (testIndex >= 0 && testIndex < tests.length) {
        await runTest(tests[testIndex]);
      } else {
        console.log('❌ Lựa chọn không hợp lệ!');
      }
    }
    
    // Pause before showing menu again
    await askQuestion('\n⏸️  Nhấn Enter để tiếp tục...');
  }
  
  rl.close();
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n\n👋 Test runner terminated. Goodbye!');
  rl.close();
  process.exit(0);
});

// Start the test runner
main().catch(error => {
  console.error('❌ Test runner error:', error);
  rl.close();
  process.exit(1);
});
