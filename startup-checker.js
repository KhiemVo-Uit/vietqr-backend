// Startup checker - Kiểm tra hệ thống trước khi chạy

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🔍 VIETQR SYSTEM STARTUP CHECKER');
console.log('=================================\n');

// Kiểm tra các file cần thiết
const requiredFiles = [
  'app.js',
  'routes/auth.js',
  'routes/generateQR.js',
  'routes/transaction.js',
  'notification-service.js',
  'package.json'
];

const testFiles = [
  'test-notification-system.js',
  'test-ngrok-webhook.js',
  'quick-webhook-test.js',
  'test-qr-with-webhook.js',
  'test-vietqr-callback.js',
  'test-runner.js'
];

const documentFiles = [
  'SYSTEM_GUIDE.md',
  'WEBHOOK_SETUP.md',
  'WEBHOOK_FLOW.md',
  'NOTIFICATION_README.md'
];

function checkFiles(files, category) {
  console.log(`📁 Checking ${category}:`);
  let allExists = true;
  
  files.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allExists = false;
  });
  
  return allExists;
}

function checkNodeModules() {
  const exists = fs.existsSync(path.join(__dirname, 'node_modules'));
  console.log(`📦 Node modules: ${exists ? '✅ Installed' : '❌ Missing'}`);
  return exists;
}

function checkPort(port) {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    exec(`netstat -an | findstr :${port}`, (error, stdout) => {
      const inUse = stdout && stdout.includes(`:${port}`);
      console.log(`🔌 Port ${port}: ${inUse ? '❌ In use' : '✅ Available'}`);
      resolve(!inUse);
    });
  });
}

async function checkSystem() {
  console.log('🔍 SYSTEM REQUIREMENTS CHECK');
  console.log('============================\n');
  
  // Check Node.js version
  console.log(`📊 Node.js version: ${process.version}`);
  console.log(`📊 Platform: ${process.platform}`);
  console.log('');
  
  // Check files
  const coreFiles = checkFiles(requiredFiles, 'Core Files');
  console.log('');
  
  const tests = checkFiles(testFiles, 'Test Files');
  console.log('');
  
  const docs = checkFiles(documentFiles, 'Documentation');
  console.log('');
  
  // Check dependencies
  const modules = checkNodeModules();
  console.log('');
  
  // Check port
  const portAvailable = await checkPort(3000);
  console.log('');
  
  // Overall status
  console.log('📊 SYSTEM STATUS:');
  console.log('================');
  console.log(`Core System: ${coreFiles ? '✅ Ready' : '❌ Missing files'}`);
  console.log(`Test Suite: ${tests ? '✅ Ready' : '❌ Missing files'}`);
  console.log(`Documentation: ${docs ? '✅ Complete' : '❌ Missing files'}`);
  console.log(`Dependencies: ${modules ? '✅ Installed' : '❌ Run npm install'}`);
  console.log(`Port 3000: ${portAvailable ? '✅ Available' : '❌ In use'}`);
  
  const allReady = coreFiles && modules && portAvailable;
  console.log(`\n🎯 OVERALL: ${allReady ? '✅ SYSTEM READY!' : '❌ NEEDS ATTENTION'}`);
  
  return allReady;
}

async function showMenu() {
  console.log('\n🚀 QUICK ACTIONS:');
  console.log('================');
  console.log('1. 🔧 Install dependencies (npm install)');
  console.log('2. 🎮 Start server (npm start)');
  console.log('3. 🧪 Run test suite (npm test)');
  console.log('4. 📱 Start dashboard (npm run dashboard)');
  console.log('5. 📚 Show documentation');
  console.log('6. 🔍 Re-check system');
  console.log('0. ❌ Exit');
  console.log('');
}

function runCommand(command, args = []) {
  return new Promise((resolve) => {
    console.log(`\n🔧 Running: ${command} ${args.join(' ')}`);
    console.log('═'.repeat(40));
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });
    
    child.on('close', (code) => {
      console.log(`\n✅ Command finished with code: ${code}`);
      resolve(code);
    });
    
    child.on('error', (error) => {
      console.error(`❌ Error: ${error.message}`);
      resolve(1);
    });
  });
}

function showDocumentation() {
  console.log('\n📚 DOCUMENTATION OVERVIEW:');
  console.log('=========================');
  console.log('');
  console.log('📋 SYSTEM_GUIDE.md - Hướng dẫn tổng quan hệ thống');
  console.log('🔗 WEBHOOK_SETUP.md - Cách setup webhook và ngrok');
  console.log('🌊 WEBHOOK_FLOW.md - Luồng xử lý webhook chi tiết');
  console.log('🔔 NOTIFICATION_README.md - Hướng dẫn notification system');
  console.log('');
  console.log('🚀 QUICK START:');
  console.log('1. npm install');
  console.log('2. npm start');
  console.log('3. npm test');
  console.log('');
  console.log('🧪 TEST SCRIPTS:');
  console.log('• npm run test:notification - Test local notification');
  console.log('• npm run test:webhook - Test ngrok webhook');
  console.log('• npm run test:quick - Quick QR + webhook test');
  console.log('• npm run test:qr - Test QR generation with webhook');
  console.log('• npm run test:vietqr - Test VietQR API callback');
  console.log('');
}

async function main() {
  // Initial system check
  const systemReady = await checkSystem();
  
  if (!systemReady) {
    console.log('\n⚠️  System needs attention before proceeding');
  }
  
  // Interactive menu
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  while (true) {
    await showMenu();
    
    const choice = await new Promise(resolve => {
      rl.question('👉 Choose an action: ', resolve);
    });
    
    switch (choice) {
      case '1':
        await runCommand('npm', ['install']);
        break;
      case '2':
        console.log('\n🎮 Starting server...');
        console.log('💡 Press Ctrl+C to stop server');
        console.log('🌐 Server will be available at: http://localhost:3000');
        await runCommand('npm', ['start']);
        break;
      case '3':
        await runCommand('npm', ['test']);
        break;
      case '4':
        await runCommand('npm', ['run', 'dashboard']);
        break;
      case '5':
        showDocumentation();
        break;
      case '6':
        await checkSystem();
        break;
      case '0':
        console.log('\n👋 Goodbye!');
        rl.close();
        return;
      default:
        console.log('❌ Invalid choice!');
    }
    
    if (choice !== '5') {
      await new Promise(resolve => {
        rl.question('\n⏸️  Press Enter to continue...', resolve);
      });
    }
  }
}

// Run startup checker
main().catch(error => {
  console.error('❌ Startup checker error:', error);
  process.exit(1);
});
