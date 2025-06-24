// Script chạy toàn bộ hệ thống và test notification

const { spawn } = require('child_process');
const axios = require('axios');

console.log('🚀 VIETQR NOTIFICATION SYSTEM - ALL IN ONE');
console.log('===========================================\n');

let serverProcess = null;
let dashboardProcess = null;

// Function start main server
function startMainServer() {
  return new Promise((resolve) => {
    console.log('📡 Starting main server (port 3000)...');
    
    serverProcess = spawn('node', ['app.js'], {
      stdio: 'pipe',
      cwd: __dirname
    });
    
    serverProcess.stdout.on('data', (data) => {
      console.log(`[SERVER] ${data.toString().trim()}`);
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(`[SERVER ERROR] ${data.toString().trim()}`);
    });
    
    // Wait a bit for server to start
    setTimeout(() => {
      console.log('✅ Main server started!\n');
      resolve();
    }, 2000);
  });
}

// Function start notification dashboard
function startDashboard() {
  return new Promise((resolve) => {
    console.log('📊 Starting notification dashboard (port 3001)...');
    
    dashboardProcess = spawn('node', ['notification-dashboard.js'], {
      stdio: 'pipe',
      cwd: __dirname
    });
    
    dashboardProcess.stdout.on('data', (data) => {
      console.log(`[DASHBOARD] ${data.toString().trim()}`);
    });
    
    dashboardProcess.stderr.on('data', (data) => {
      console.error(`[DASHBOARD ERROR] ${data.toString().trim()}`);
    });
    
    setTimeout(() => {
      console.log('✅ Dashboard started!\n');
      resolve();
    }, 1000);
  });
}

// Function test notifications
async function testNotifications() {
  console.log('🧪 Running notification tests...\n');
  
  const testProcess = spawn('node', ['test-notification-system.js'], {
    stdio: 'inherit',
    cwd: __dirname
  });
  
  return new Promise((resolve) => {
    testProcess.on('close', (code) => {
      console.log('\n✅ Notification test completed!\n');
      resolve();
    });
  });
}

// Function hiển thị menu
function showMenu() {
  console.log('🎯 SYSTEM STATUS:');
  console.log('================');
  console.log('📡 Main Server: http://localhost:3000');
  console.log('📊 Notification Dashboard: http://localhost:3001');
  console.log('📱 API Endpoints:');
  console.log('   GET  /api/token - Lấy access token');
  console.log('   POST /api/create - Tạo QR code');
  console.log('   POST /api/create-image - Tạo QR image');
  console.log('   POST /api/transaction-sync - Webhook callback');
  console.log('\n🎮 AVAILABLE COMMANDS:');
  console.log('   t - Test notification system');
  console.log('   s - Setup Telegram bot');
  console.log('   d - Open dashboard in browser');
  console.log('   l - Show recent logs');
  console.log('   q - Quit\n');
}

// Function xử lý commands
function handleCommand(command) {
  switch(command.trim().toLowerCase()) {
    case 't':
      testNotifications();
      break;
      
    case 's':
      console.log('\n🤖 Setting up Telegram bot...\n');
      const setupProcess = spawn('node', ['setup-telegram-bot.js'], {
        stdio: 'inherit',
        cwd: __dirname
      });
      break;
      
    case 'd':
      console.log('🌐 Opening dashboard...');
      const { exec } = require('child_process');
      exec('start http://localhost:3001');
      break;
      
    case 'l':
      showRecentLogs();
      break;
      
    case 'q':
      cleanup();
      process.exit(0);
      break;
      
    default:
      console.log('❌ Unknown command. Type h for help.');
  }
}

// Function hiển thị logs gần đây
function showRecentLogs() {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const logFile = path.join(__dirname, 'transaction-logs.txt');
    
    if (fs.existsSync(logFile)) {
      console.log('\n📋 RECENT TRANSACTION LOGS:');
      console.log('============================');
      
      const logs = fs.readFileSync(logFile, 'utf8')
        .split('\n')
        .filter(line => line.trim())
        .slice(-10); // 10 logs gần nhất
      
      if (logs.length === 0) {
        console.log('📭 No logs yet.\n');
        return;
      }
      
      logs.forEach((log, index) => {
        try {
          const data = JSON.parse(log);
          console.log(`${index + 1}. ${new Date(data.timestamp).toLocaleString('vi-VN')}`);
          console.log(`   💰 ${Number(data.amount).toLocaleString('vi-VN')} VNĐ`);
          console.log(`   🆔 ${data.transactionId}`);
          console.log(`   📝 ${data.content}`);
          console.log('   ---');
        } catch (e) {
          // Skip invalid JSON
        }
      });
      
    } else {
      console.log('\n📭 No transaction logs found.\n');
    }
    
  } catch (error) {
    console.error('❌ Error reading logs:', error.message);
  }
}

// Function cleanup
function cleanup() {
  console.log('\n🧹 Cleaning up...');
  
  if (serverProcess) {
    serverProcess.kill();
    console.log('✅ Main server stopped');
  }
  
  if (dashboardProcess) {
    dashboardProcess.kill();
    console.log('✅ Dashboard stopped');
  }
}

// Handle process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Main function
async function main() {
  try {
    // Start servers
    await startMainServer();
    await startDashboard();
    
    // Show menu
    showMenu();
    
    // Setup command input
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.setPrompt('Command> ');
    rl.prompt();
    
    rl.on('line', (input) => {
      handleCommand(input);
      rl.prompt();
    });
    
  } catch (error) {
    console.error('❌ Error starting system:', error);
    cleanup();
  }
}

// Start the system
main();
