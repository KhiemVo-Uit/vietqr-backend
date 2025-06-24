// Setup Ngrok Tool - Tự động setup và cập nhật URLs

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌐 NGROK SETUP TOOL FOR VIETQR');
console.log('==============================\n');

// Files cần cập nhật ngrok URL
const filesToUpdate = [
  'test-ngrok-webhook.js',
  'quick-webhook-test.js', 
  'test-vietqr-callback.js',
  'test-qr-with-webhook.js'
];

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

function checkNgrokInstalled() {
  return new Promise((resolve) => {
    exec('ngrok version', (error) => {
      resolve(!error);
    });
  });
}

function startNgrok() {
  return new Promise((resolve, reject) => {
    console.log('\n🚀 Đang khởi động ngrok...');
    console.log('⏳ Vui lòng chờ vài giây...\n');
    
    const ngrok = spawn('ngrok', ['http', '3000'], {
      stdio: 'pipe'
    });
    
    let output = '';
    
    ngrok.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    ngrok.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    // Đợi ngrok khởi động
    setTimeout(() => {
      // Lấy thông tin tunnel từ ngrok API
      exec('curl -s http://localhost:4040/api/tunnels', (error, stdout) => {
        if (error) {
          reject('Không thể lấy thông tin tunnel từ ngrok');
          return;
        }
        
        try {
          const tunnels = JSON.parse(stdout);
          const httpsTunnel = tunnels.tunnels.find(t => t.proto === 'https');
          
          if (httpsTunnel) {
            resolve({
              url: httpsTunnel.public_url,
              process: ngrok
            });
          } else {
            reject('Không tìm thấy HTTPS tunnel');
          }
        } catch (parseError) {
          reject('Lỗi parse tunnel data');
        }
      });
    }, 5000); // Đợi 5 giây cho ngrok khởi động
  });
}

function updateFileWithNgrokUrl(filePath, newUrl) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Patterns để tìm và replace ngrok URLs
    const patterns = [
      /const NGROK_URL = '[^']*'/g,
      /const NGROK_WEBHOOK_URL = '[^']*'/g,
      /https:\/\/[^.]*\.ngrok[^'"\s]*/g
    ];
    
    let updated = false;
    patterns.forEach(pattern => {
      if (pattern.test(content)) {
        if (filePath.includes('test-vietqr-callback.js')) {
          content = content.replace(
            /const NGROK_WEBHOOK_URL = '[^']*'/g,
            `const NGROK_WEBHOOK_URL = '${newUrl}/bank/api/transaction-sync'`
          );
        } else {
          content = content.replace(
            /const NGROK_URL = '[^']*'/g,
            `const NGROK_URL = '${newUrl}'`
          );
        }
        updated = true;
      }
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`⚠️  No ngrok URL found in: ${filePath}`);
    }
    
  } catch (error) {
    console.log(`❌ Error updating ${filePath}: ${error.message}`);
  }
}

function updateAllFiles(ngrokUrl) {
  console.log('\n📝 Cập nhật ngrok URL trong các file test...');
  
  filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      updateFileWithNgrokUrl(filePath, ngrokUrl);
    } else {
      console.log(`⚠️  File not found: ${file}`);
    }
  });
}

async function showCurrentUrls() {
  console.log('\n📋 URLs hiện tại trong các file test:');
  console.log('=====================================');
  
  filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const urlMatch = content.match(/https:\/\/[^.]*\.ngrok[^'"\s]*/);
      if (urlMatch) {
        console.log(`📄 ${file}: ${urlMatch[0]}`);
      } else {
        console.log(`📄 ${file}: No ngrok URL found`);
      }
    }
  });
}

async function testConnection(ngrokUrl) {
  return new Promise((resolve) => {
    const testUrl = `${ngrokUrl}/api/token`;
    exec(`curl -s -o /dev/null -w "%{http_code}" "${testUrl}"`, (error, stdout) => {
      const statusCode = stdout.trim();
      const success = statusCode === '200';
      console.log(`🔗 Test connection: ${testUrl}`);
      console.log(`📊 Status: ${statusCode} ${success ? '✅ Success' : '❌ Failed'}`);
      resolve(success);
    });
  });
}

async function showWebhookInfo(ngrokUrl) {
  console.log('\n🎯 WEBHOOK INFORMATION:');
  console.log('======================');
  console.log(`📡 Ngrok Public URL: ${ngrokUrl}`);
  console.log(`🔗 Webhook Endpoint: ${ngrokUrl}/bank/api/transaction-sync`);
  console.log('');
  console.log('📝 Để sử dụng với VietQR:');
  console.log(`   1. Copy URL này: ${ngrokUrl}/bank/api/transaction-sync`);
  console.log('   2. Dùng làm webhookUrl khi tạo QR');
  console.log('   3. VietQR sẽ gửi callback đến URL này');
  console.log('');
  console.log('🧪 Test commands:');
  console.log('   npm run test:webhook   # Test ngrok webhook');
  console.log('   npm run test:quick     # Test QR + webhook');
  console.log('   npm run test:vietqr    # Test VietQR API');
  console.log('');
}

async function main() {
  try {
    // Kiểm tra ngrok đã cài đặt chưa
    const ngrokInstalled = await checkNgrokInstalled();
    
    if (!ngrokInstalled) {
      console.log('❌ Ngrok chưa được cài đặt!');
      console.log('');
      console.log('📥 Cách cài đặt:');
      console.log('1. npm install -g ngrok');
      console.log('2. Hoặc download từ: https://ngrok.com/download');
      console.log('3. Đăng ký tài khoản tại: https://ngrok.com/');
      console.log('4. Lấy auth token và chạy: ngrok authtoken YOUR_TOKEN');
      console.log('');
      rl.close();
      return;
    }
    
    console.log('✅ Ngrok đã được cài đặt');
    
    // Hiển thị URLs hiện tại
    await showCurrentUrls();
    
    console.log('\n🔧 LỰA CHỌN:');
    console.log('1. 🚀 Khởi động ngrok mới và cập nhật URLs');
    console.log('2. ✏️  Nhập URL ngrok thủ công');
    console.log('3. 📊 Chỉ hiển thị thông tin hiện tại');
    console.log('0. ❌ Thoát');
    
    const choice = await askQuestion('\n👉 Chọn hành động: ');
    
    switch (choice) {
      case '1':
        console.log('\n⚠️  LƯU Ý: Đảm bảo server đang chạy tại http://localhost:3000');
        const confirm = await askQuestion('Tiếp tục? (y/n): ');
        
        if (confirm.toLowerCase() !== 'y') {
          console.log('🛑 Đã hủy');
          break;
        }
        
        try {
          const ngrokInfo = await startNgrok();
          console.log(`\n✅ Ngrok đã khởi động thành công!`);
          console.log(`🌐 Public URL: ${ngrokInfo.url}`);
          
          // Cập nhật files
          updateAllFiles(ngrokInfo.url);
          
          // Test connection
          console.log('\n🔍 Đang test kết nối...');
          await testConnection(ngrokInfo.url);
          
          // Hiển thị thông tin webhook
          await showWebhookInfo(ngrokInfo.url);
          
          console.log('💡 Nhấn Ctrl+C để dừng ngrok tunnel');
          console.log('💡 Giữ terminal này mở để duy trì tunnel');
          
          // Giữ process chạy
          process.on('SIGINT', () => {
            console.log('\n\n🛑 Đang dừng ngrok...');
            ngrokInfo.process.kill();
            rl.close();
            process.exit(0);
          });
          
          // Không đóng terminal
          setInterval(() => {}, 1000);
          
        } catch (error) {
          console.log(`❌ Lỗi khởi động ngrok: ${error}`);
          console.log('\n💡 Hướng dẫn troubleshoot:');
          console.log('1. Kiểm tra server đang chạy: http://localhost:3000');
          console.log('2. Kiểm tra auth token: ngrok authtoken YOUR_TOKEN');
          console.log('3. Thử chạy thủ công: ngrok http 3000');
        }
        break;
        
      case '2':
        const manualUrl = await askQuestion('\n📝 Nhập ngrok URL (https://xxx.ngrok-free.app): ');
        
        if (!manualUrl.startsWith('https://')) {
          console.log('❌ URL phải bắt đầu bằng https://');
          break;
        }
        
        updateAllFiles(manualUrl);
        await showWebhookInfo(manualUrl);
        break;
        
      case '3':
        // Đã hiển thị ở trên
        break;
        
      case '0':
        console.log('👋 Tạm biệt!');
        break;
        
      default:
        console.log('❌ Lựa chọn không hợp lệ');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (rl && !rl.closed) {
      rl.close();
    }
  }
}

// Start the tool
main();
