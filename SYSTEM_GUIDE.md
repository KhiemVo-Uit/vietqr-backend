# 🚀 HỆ THỐNG VIETQR CALLBACK - HƯỚNG DẪN HOÀN CHỈNH

## 📋 TỔNG QUAN HỆ THỐNG

Hệ thống backend Node.js hoàn chỉnh để xử lý VietQR callbacks với các tính năng:

- ✅ Nhận webhook callback khi có thanh toán thành công
- ✅ Gửi thông báo real-time (console, âm thanh, Telegram, email, log file)
- ✅ Hỗ trợ test callback qua ngrok/public URL
- ✅ Tích hợp API test callback của VietQR
- ✅ Dashboard thông báo real-time

## 🏗️ CẤU TRÚC HỆ THỐNG

```
📁 Backend Components:
├── 🌐 API Endpoints:
│   ├── /api/token - Lấy access token
│   ├── /api/create - Tạo QR code (có webhook support)
│   └── /bank/api/transaction-sync - Nhận callback từ VietQR
│
├── 🔔 Notification System:
│   ├── Console logging
│   ├── Âm thanh (beep)
│   ├── Log file (transaction-logs.txt)
│   ├── Email notification (mock)
│   └── Telegram bot (nếu cấu hình)
│
├── 🧪 Test Scripts:
│   ├── test-notification-system.js - Test notification local
│   ├── test-ngrok-webhook.js - Test webhook qua ngrok
│   ├── quick-webhook-test.js - Test QR + webhook nhanh
│   ├── test-vietqr-callback.js - Test với API VietQR thật
│   └── test-qr-with-webhook.js - Test tạo QR với webhook
│
└── 📱 Dashboard:
    └── notification-dashboard.js - Dashboard real-time
```

## ⚡ KHỞI CHẠY NHANH

### 1. Setup Environment

```bash
# Cài đặt dependencies
npm install

# Khởi động server
npm start
# hoặc
node app.js
```

### 2. Test Notification Local

```bash
# Test hệ thống notification cơ bản
node test-notification-system.js
```

### 3. Setup Ngrok (cho public webhook)

```bash
# Cài đặt ngrok
npm install -g ngrok

# Đăng nhập ngrok (cần tài khoản miễn phí)
ngrok authtoken YOUR_NGROK_TOKEN

# Tạo public tunnel
ngrok http 3000
```

### 4. Test Webhook qua Ngrok

```bash
# Cập nhật ngrok URL trong script và chạy
node test-ngrok-webhook.js
```

## 🧪 CÁC SCRIPT TEST CHI TIẾT

### 1. `test-notification-system.js`

**Mục đích:** Test hệ thống notification local

```bash
node test-notification-system.js
```

**Kiểm tra:**

- ✅ Console notification
- ✅ Âm thanh beep
- ✅ Log file ghi thành công
- ✅ Email mock
- ✅ Telegram (nếu có config)

### 2. `test-ngrok-webhook.js`

**Mục đích:** Test webhook qua ngrok với data giả lập

```bash
# Cập nhật NGROK_URL trong file trước
node test-ngrok-webhook.js
```

**Kiểm tra:**

- ✅ Gửi webhook qua public URL
- ✅ Server nhận callback
- ✅ Notification hoạt động

### 3. `quick-webhook-test.js`

**Mục đích:** Test tạo QR + webhook trong 1 lần

```bash
node quick-webhook-test.js
```

**Kiểm tra:**

- ✅ Tạo QR với webhookUrl
- ✅ Gửi test callback
- ✅ Xem QR code được tạo

### 4. `test-vietqr-callback.js`

**Mục đích:** Test với API callback chính thức của VietQR

```bash
# Cập nhật ngrok URL trong file
node test-vietqr-callback.js
```

**Lưu ý:** Cần token VietQR thật để test API chính thức

### 5. `test-qr-with-webhook.js`

**Mục đích:** Test tạo QR với webhookUrl configured

```bash
node test-qr-with-webhook.js
```

## 🌐 SETUP NGROK CHI TIẾT

### Bước 1: Đăng ký Ngrok

1. Truy cập: https://ngrok.com/
2. Tạo tài khoản miễn phí
3. Lấy authtoken từ dashboard

### Bước 2: Cài đặt và Cấu hình

```bash
# Cài đặt global
npm install -g ngrok

# Xác thực
ngrok authtoken YOUR_AUTHTOKEN_HERE

# Khởi động tunnel
ngrok http 3000
```

### Bước 3: Lấy Public URL

```bash
# Terminal sẽ hiển thị:
# Forwarding: https://abc123.ngrok-free.app -> http://localhost:3000
```

### Bước 4: Cập nhật Scripts

Thay thế URL trong các test scripts:

```javascript
const NGROK_WEBHOOK_URL =
  "https://abc123.ngrok-free.app/bank/api/transaction-sync";
```

## 📱 DASHBOARD REAL-TIME

### Khởi chạy Dashboard

```bash
node notification-dashboard.js
```

**Features:**

- 📊 Hiển thị transaction real-time
- 🔔 Thông báo âm thanh
- 📈 Thống kê tổng quan
- 🕒 Log history

## 🔧 CẤU HÌNH THÔNG BÁO

### Email Configuration

```javascript
// notification-service.js
const emailConfig = {
  from: "your-email@gmail.com",
  to: "recipient@gmail.com",
  // SMTP settings...
};
```

### Telegram Bot Setup

```javascript
// notification-service.js
const telegramConfig = {
  botToken: "YOUR_BOT_TOKEN",
  chatId: "YOUR_CHAT_ID",
};
```

## 🛠️ API ENDPOINTS

### 1. GET /api/token

**Mục đích:** Lấy access token

```bash
curl http://localhost:3000/api/token
```

### 2. POST /api/create

**Mục đích:** Tạo QR code

```bash
curl -X POST http://localhost:3000/api/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount": "50000",
    "content": "Thanh toan don hang",
    "webhookUrl": "https://your-webhook.com/callback"
  }'
```

### 3. POST /bank/api/transaction-sync

**Mục đích:** Nhận callback từ VietQR

```bash
curl -X POST http://localhost:3000/bank/api/transaction-sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{ "transactionid": "TXN123", "amount": "50000", ... }'
```

## 🔍 TROUBLESHOOTING

### Lỗi Thường Gặp

#### 1. Âm thanh không phát

```bash
# Windows: Cài đặt audio driver
# Linux: sudo apt-get install alsa-utils
# Mac: Kiểm tra volume settings
```

#### 2. Ngrok Connection Failed

```bash
# Kiểm tra network
ping ngrok.com

# Restart ngrok
ngrok http 3000 --region us
```

#### 3. VietQR API 401 Error

- Kiểm tra token hợp lệ
- Kiểm tra token chưa hết hạn
- Kiểm tra environment (sandbox vs production)

#### 4. Webhook không nhận được

- Kiểm tra server đang chạy
- Kiểm tra ngrok tunnel hoạt động
- Kiểm tra URL format đúng

### Debug Commands

```bash
# Kiểm tra port 3000 có được sử dụng
netstat -an | findstr :3000

# Test API local
curl http://localhost:3000/api/token

# Test ngrok tunnel
curl https://your-ngrok-url.ngrok-free.app/api/token
```

## 📊 KẾT QUẢ MONG ĐỢI

### Khi Test Thành Công:

1. ✅ Console hiển thị log chi tiết
2. ✅ Âm thanh "beep" phát ra
3. ✅ File `transaction-logs.txt` được cập nhật
4. ✅ Dashboard hiển thị transaction mới
5. ✅ Notification các channel được kích hoạt

### Log File Format:

```
2024-01-XX XX:XX:XX - TRANSACTION RECEIVED
Transaction ID: TXN_123456789
Amount: 50,000 VNĐ
Content: Thanh toan don hang
Bank Account: 0397733970
Reference: REF123456
---
```

## 🚀 DEPLOY PRODUCTION

### 1. Environment Variables

```bash
# .env file
NODE_ENV=production
PORT=3000
VIETQR_CLIENT_ID=your_client_id
VIETQR_API_KEY=your_api_key
WEBHOOK_URL=https://yourdomain.com/bank/api/transaction-sync
```

### 2. Process Manager (PM2)

```bash
# Cài đặt PM2
npm install -g pm2

# Start application
pm2 start app.js --name "vietqr-backend"

# Monitor
pm2 monit
```

### 3. Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📞 HỖ TRỢ

### Debug Info Cần Thiết:

1. Node.js version: `node --version`
2. NPM version: `npm --version`
3. OS: Windows/Linux/Mac
4. Error logs từ console
5. Network connectivity status

### Contact:

- 📧 Email: support@yourproject.com
- 📱 Telegram: @yourhandle
- 💬 Discord: Your#1234

---

## ✨ FEATURES HOÀN CHỈNH

- [x] **Webhook Callback Reception** - Nhận callback từ VietQR
- [x] **Multi-Channel Notification** - Console, sound, file, email, Telegram
- [x] **Public URL Support** - Ngrok integration for testing
- [x] **QR Code Generation** - API tạo QR với webhook URL
- [x] **Test Framework** - Comprehensive testing scripts
- [x] **Real-time Dashboard** - Live transaction monitoring
- [x] **Error Handling** - Robust error management
- [x] **Logging System** - File-based transaction logs
- [x] **Token Management** - Access token handling
- [x] **API Integration** - VietQR API compatibility

**🎉 Hệ thống đã sẵn sàng cho production!**
