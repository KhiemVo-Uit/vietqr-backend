# 🚀 VietQR Backend System - Complete Setup

## 📋 PROJECT OVERVIEW

Hệ thống backend Node.js hoàn chỉnh để xử lý VietQR callbacks với đầy đủ tính năng:

- ✅ **Webhook Callback Reception** - Nhận callback từ VietQR khi có thanh toán
- ✅ **Multi-Channel Notification** - Thông báo qua console, âm thanh, file, email, Telegram
- ✅ **Public URL Testing** - Hỗ trợ test qua ngrok
- ✅ **Comprehensive Test Suite** - Bộ test đầy đủ cho tất cả components
- ✅ **Real-time Dashboard** - Dashboard theo dõi transaction real-time
- ✅ **Production Ready** - Sẵn sàng deploy production

## ⚡ QUICK START

### 1. System Check & Setup

```bash
# Kiểm tra hệ thống và dependencies
npm run check
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Server

```bash
npm start
```

### 4. Run Tests

```bash
# Interactive test runner
npm test

# Individual tests
npm run test:notification  # Test local notification
npm run test:webhook      # Test ngrok webhook
npm run test:quick        # Quick QR + webhook test
npm run test:qr          # Test QR generation
npm run test:vietqr      # Test VietQR API
```

### 5. Start Dashboard (Optional)

```bash
npm run dashboard
```

## 🏗️ PROJECT STRUCTURE

```
📁 VietQR Backend System
├── 🌐 Core API:
│   ├── app.js                     # Main server
│   ├── routes/auth.js             # Authentication
│   ├── routes/generateQR.js       # QR generation API
│   └── routes/transaction.js      # Webhook callback handler
│
├── 🔔 Notification System:
│   ├── notification-service.js    # Multi-channel notifications
│   └── notification-dashboard.js  # Real-time dashboard
│
├── 🧪 Test Suite:
│   ├── test-runner.js             # Interactive test runner
│   ├── test-notification-system.js # Local notification test
│   ├── test-ngrok-webhook.js      # Ngrok webhook test
│   ├── quick-webhook-test.js      # Quick integration test
│   ├── test-qr-with-webhook.js    # QR generation test
│   └── test-vietqr-callback.js    # VietQR API test
│
├── 🛠️ Utilities:
│   └── startup-checker.js         # System requirements checker
│
└── 📚 Documentation:
    ├── SYSTEM_GUIDE.md           # Complete system guide
    ├── WEBHOOK_SETUP.md          # Webhook setup instructions
    ├── WEBHOOK_FLOW.md           # Webhook flow documentation
    └── NOTIFICATION_README.md    # Notification system guide
```

## 🔧 API ENDPOINTS

### 🌐 Production Endpoints (Render)

#### Authentication

- `POST https://vietqr-backend.onrender.com/vqr/api/token_generate` - Get access token

#### QR Generation

- `POST https://vietqr-backend.onrender.com/api/create` - Create QR code (JSON)
- `POST https://vietqr-backend.onrender.com/api/create-image` - Create QR code image
- `GET https://vietqr-backend.onrender.com/api/token` - Get token with detailed info

#### Webhook Callback

- `POST https://vietqr-backend.onrender.com/vqr/api/test/transaction-callback` - Receive VietQR callbacks

### 🏠 Local Development Endpoints

- `POST http://localhost:3000/vqr/api/token_generate` - Get access token
- `POST http://localhost:3000/api/create` - Create QR code
- `POST http://localhost:3000/vqr/api/test/transaction-callback` - Webhook callback

## 🚀 PRODUCTION TESTING

### 📮 POSTMAN TESTING GUIDE

#### **1. Lấy Access Token với Postman**

**Request Setup:**

- **Method**: `POST`
- **URL**: `https://vietqr-backend.onrender.com/vqr/api/token_generate`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body**: `{}` (empty JSON hoặc không cần)

**Expected Response:**

```json
{
  "success": true,
  "message": "Token generated successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### **2. Tạo QR Code với Postman**

**Request Setup:**

- **Method**: `POST`
- **URL**: `https://vietqr-backend.onrender.com/api/create`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):

```json
{
  "bankAccount": "0397733970",
  "userBankName": "Nguyen Phuoc Dai",
  "bankCode": "MB",
  "amount": "3000",
  "content": "VQR thanh toan test",
  "transType": "C",
  "orderId": "VietQR",
  "qrType": "0",
  "webhookUrl": "https://vietqr-backend.onrender.com/vqr/api/test/transaction-callback"
}
```

#### **3. Test Webhook Callback với Postman**

**Request Setup:**

- **Method**: `POST`
- **URL**: `https://vietqr-backend.onrender.com/vqr/api/test/transaction-callback`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):

```json
{
  "orderId": "postman-test-123",
  "amount": 50000,
  "transactionId": "txn-456",
  "status": "success",
  "bankCode": "MB",
  "content": "Test payment"
}
```

### 💡 Test với cURL (Alternative)

#### 1. Lấy Access Token

```bash
curl -X POST https://vietqr-backend.onrender.com/vqr/api/token_generate \
  -H "Content-Type: application/json"
```

#### 2. Tạo QR Code

```bash
curl -X POST https://vietqr-backend.onrender.com/api/create \
  -H "Content-Type: application/json" \
  -d '{
    "bankAccount": "0397733970",
    "userBankName": "Nguyen Phuoc Dai",
    "bankCode": "MB",
    "amount": "3000",
    "content": "VQR thanh toan test",
    "transType": "C",
    "orderId": "VietQR",
    "qrType": "0",
    "webhookUrl": "https://vietqr-backend.onrender.com/vqr/api/test/transaction-callback"
  }'
```

#### 3. Test Webhook Callback (Manual)

```bash
curl -X POST https://vietqr-backend.onrender.com/vqr/api/test/transaction-callback \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "test-order-123",
    "amount": 3000,
    "transactionId": "test-txn-456",
    "status": "success"
  }'
```

## 🧪 TESTING WORKFLOW

### Step 1: Local Testing

```bash
npm run test:notification
```

**Checks:** Console output, sound alerts, file logging

### Step 2: Ngrok Setup

```bash
# Install ngrok globally
npm install -g ngrok

# Get auth token from https://ngrok.com/
ngrok authtoken YOUR_TOKEN

# Start tunnel
ngrok http 3000
```

### Step 3: Webhook Testing

```bash
# Update ngrok URL in test files, then:
npm run test:webhook
```

### Step 4: Integration Testing

```bash
npm run test:quick    # QR + webhook integration
npm run test:qr       # QR generation with webhook
npm run test:vietqr   # VietQR API testing
```

## 🔔 NOTIFICATION CHANNELS

### Console Logging ✅

- Real-time transaction display
- Detailed callback information
- Error logging

### Sound Alerts ✅

- Audio beep on successful payment
- Cross-platform compatibility
- Configurable volume

### File Logging ✅

- Persistent transaction logs
- Structured log format
- Automatic file rotation

### Email Notifications ✅

- SMTP integration ready
- Template-based emails
- Async sending

### Telegram Bot ✅

- Bot integration ready
- Instant messaging
- Rich message formatting

## 🌐 NGROK INTEGRATION

### Setup Instructions

1. **Register:** https://ngrok.com/ (free account)
2. **Install:** `npm install -g ngrok`
3. **Authenticate:** `ngrok authtoken YOUR_TOKEN`
4. **Start tunnel:** `ngrok http 3000`
5. **Copy URL:** `https://xxx.ngrok-free.app`
6. **Update scripts:** Replace ngrok URLs in test files

### URL Format

```
Local:      http://localhost:3000/vqr/api/test/transaction-callback
Ngrok:      https://xxx.ngrok-free.app/vqr/api/test/transaction-callback
Production: https://vietqr-backend.onrender.com/vqr/api/test/transaction-callback
```

## 📊 MONITORING & LOGS

### Real-time Dashboard

```bash
npm run dashboard
```

**Features:**

- Live transaction display
- Sound notifications
- Statistics overview
- Log history

### Log Files

- `transaction-logs.txt` - All transaction records
- Console output - Real-time monitoring
- Error logs - System errors and debugging

## 🚀 PRODUCTION DEPLOYMENT

### Render Configuration ✅

**Production URL:** `https://vietqr-backend.onrender.com`

**Active Endpoints:**

- Token: `POST /vqr/api/token_generate`
- QR Create: `POST /api/create`
- QR Image: `POST /api/create-image`
- Webhook: `POST /vqr/api/test/transaction-callback`

### Environment Variables

```bash
NODE_ENV=production
PORT=3000
VIETQR_CLIENT_ID=your_client_id
VIETQR_API_KEY=your_api_key
WEBHOOK_URL=https://vietqr-backend.onrender.com/vqr/api/test/transaction-callback
```

### Process Management

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start app.js --name "vietqr-backend"

# Monitor
pm2 monit

# Logs
pm2 logs vietqr-backend
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 🔍 TROUBLESHOOTING

### Common Issues

#### No Sound on Payment

```bash
# Windows: Check audio drivers
# Linux: sudo apt-get install alsa-utils
# Mac: Check system volume
```

#### Ngrok Connection Failed

```bash
# Check network connectivity
ping ngrok.com

# Try different region
ngrok http 3000 --region us
```

#### VietQR API Errors

- **401 Unauthorized:** Check API token validity
- **400 Bad Request:** Verify request format
- **500 Server Error:** Check VietQR service status

#### Port 3000 In Use

```bash
# Windows: Find process using port
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID [PID] /F

# Or use different port
PORT=3001 npm start
```

## 📱 MOBILE TESTING

### QR Code Testing

1. Generate QR using API
2. Scan with banking app
3. Make test payment
4. Verify callback received
5. Check notifications triggered

### Bank Compatibility

- ✅ VietcomBank
- ✅ Techcombank
- ✅ MBBank
- ✅ ACB
- ✅ And more...

## 📞 SUPPORT & RESOURCES

### System Requirements

- **Node.js:** v14.0.0 or higher
- **NPM:** v6.0.0 or higher
- **OS:** Windows, macOS, Linux
- **Memory:** 512MB RAM minimum
- **Storage:** 100MB free space

### Debug Information

When reporting issues, include:

- Node.js version: `node --version`
- NPM version: `npm --version`
- Operating system
- Error logs from console
- Network connectivity status

### Useful Commands

```bash
# System check
npm run check

# Full test suite
npm test

# Start server
npm start

# Start dashboard
npm run dashboard

# View logs
tail -f transaction-logs.txt
```

## ✨ FEATURES COMPLETE

- [x] **API Integration** - VietQR API compatibility
- [x] **Webhook Reception** - Callback handling
- [x] **QR Generation** - Dynamic QR creation
- [x] **Multi-Notification** - Multiple alert channels
- [x] **Public URL Support** - Ngrok integration
- [x] **Test Framework** - Comprehensive testing
- [x] **Real-time Dashboard** - Live monitoring
- [x] **Error Handling** - Robust error management
- [x] **Documentation** - Complete guides
- [x] **Production Ready** - Deployment ready

---

---

## 🎯 QUICK REFERENCE - PRODUCTION

### 🌐 Base URL

```
https://vietqr-backend.onrender.com
```

### 🔑 Key Endpoints

```
1. GET TOKEN:    POST /vqr/api/token_generate
2. CREATE QR:    POST /api/create
3. CALLBACK:     POST /vqr/api/test/transaction-callback
```

### 📋 Test Commands

```bash
# 1. Get Token
curl -X POST https://vietqr-backend.onrender.com/vqr/api/token_generate

# 2. Create QR
curl -X POST https://vietqr-backend.onrender.com/api/create \
  -H "Content-Type: application/json" \
  -d '{"bankAccount":"0397733970","userBankName":"Nguyen Phuoc Dai","bankCode":"MB","amount":"3000","content":"VQR thanh toan test","transType":"C","orderId":"VietQR","qrType":"0"}'

# 3. Test Callback
curl -X POST https://vietqr-backend.onrender.com/vqr/api/test/transaction-callback \
  -H "Content-Type: application/json" \
  -d '{"orderId":"test-123","amount":50000,"status":"success"}'
```

## 🎉 READY FOR PRODUCTION!

Hệ thống đã hoàn thiện và sẵn sàng xử lý callback thực tế từ VietQR.

**Next Steps:**

1. Deploy to production server
2. Register webhook URL with VietQR
3. Configure production environment variables
4. Set up monitoring and alerts
5. Test with real transactions

**Happy Coding! 🚀**
