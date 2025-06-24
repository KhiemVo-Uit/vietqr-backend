// Quick Ngrok URL Generator

const { spawn } = require('child_process');
const { exec } = require('child_process');

console.log('⚡ QUICK NGROK URL FOR VIETQR WEBHOOK');
console.log('====================================\n');

async function checkServerRunning() {
  return new Promise((resolve) => {
    exec('curl -s http://localhost:3000/api/token', (error) => {
      resolve(!error);
    });
  });
}

async function getNgrokUrl() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      exec('curl -s http://localhost:4040/api/tunnels', (error, stdout) => {
        if (error) {
          reject('Không thể kết nối tới ngrok API. Ngrok có đang chạy?');
          return;
        }
        
        try {
          const data = JSON.parse(stdout);
          const httpsTunnel = data.tunnels?.find(t => t.proto === 'https');
          
          if (httpsTunnel) {
            resolve(httpsTunnel.public_url);
          } else {
            reject('Không tìm thấy HTTPS tunnel');
          }
        } catch (e) {
          reject('Lỗi parse dữ liệu từ ngrok');
        }
      });
    }, 2000);
  });
}

async function startNgrokAndGetUrl() {
  console.log('🚀 Đang khởi động ngrok...');
  
  // Start ngrok
  const ngrokProcess = spawn('npx', ['ngrok', 'http', '3000'], {
    stdio: 'pipe',
    shell: true
  });
  
  console.log('⏳ Đang chờ ngrok khởi động...');
  
  try {
    const url = await getNgrokUrl();
    console.log('\n✅ NGROK TUNNEL ĐÃ SẴN SÀNG!');
    console.log('============================');
    console.log(`🌐 Public URL: ${url}`);
    console.log(`🔗 Webhook URL: ${url}/bank/api/transaction-sync`);
    console.log('');
    console.log('📋 COPY URL SAU ĐÂY ĐỂ DÙNG TRONG VIETQR:');
    console.log(`${url}/bank/api/transaction-sync`);
    console.log('');
    console.log('🧪 Test commands:');
    console.log('   npm run test:webhook');
    console.log('   npm run test:quick');
    console.log('');
    console.log('💡 Giữ terminal này mở để duy trì tunnel');
    console.log('💡 Nhấn Ctrl+C để dừng');
    
    // Keep process running
    process.on('SIGINT', () => {
      console.log('\n\n🛑 Đang dừng ngrok...');
      ngrokProcess.kill();
      process.exit(0);
    });
    
    // Keep alive
    setInterval(() => {}, 1000);
    
  } catch (error) {
    console.log(`❌ Lỗi: ${error}`);
    ngrokProcess.kill();
    process.exit(1);
  }
}

async function main() {
  // Check if server is running
  console.log('🔍 Kiểm tra server...');
  const serverRunning = await checkServerRunning();
  
  if (!serverRunning) {
    console.log('❌ Server chưa chạy tại http://localhost:3000');
    console.log('💡 Chạy lệnh này trong terminal khác: npm start');
    console.log('💡 Sau đó chạy lại script này');
    return;
  }
  
  console.log('✅ Server đang chạy');
  
  // Try to get existing ngrok URL first
  try {
    const existingUrl = await getNgrokUrl();
    console.log('\n🎉 NGROK ĐÃ ĐANG CHẠY!');
    console.log('======================');
    console.log(`🌐 Public URL: ${existingUrl}`);
    console.log(`🔗 Webhook URL: ${existingUrl}/bank/api/transaction-sync`);
    console.log('');
    console.log('📋 COPY URL SAU ĐÂY ĐỂ DÙNG TRONG VIETQR:');
    console.log(`${existingUrl}/bank/api/transaction-sync`);
    console.log('');
    return;
  } catch (error) {
    console.log('💡 Ngrok chưa chạy, đang khởi động...');
  }
  
  // Start new ngrok tunnel
  await startNgrokAndGetUrl();
}

main().catch(console.error);
