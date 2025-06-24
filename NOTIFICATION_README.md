# 🎉 VietQR Notification System

Hệ thống thông báo real-time khi có khách hàng thanh toán thành công qua VietQR.

## ✨ Tính năng

- 🔊 **Thông báo âm thanh** ngay lập tức
- 📱 **Thông báo Telegram** (nếu cấu hình)
- 📧 **Email notification** (có thể cấu hình)
- 💾 **Ghi log chi tiết** vào file
- 📊 **Dashboard real-time** xem thông báo
- 🧪 **Test scripts** đầy đủ

## 🚀 Cách sử dụng nhanh

### 1. Chạy toàn bộ hệ thống:

```bash
node start-all.js
```

Lệnh này sẽ:

- Khởi động server chính (port 3000)
- Khởi động dashboard (port 3001)
- Hiển thị menu điều khiển

### 2. Test thông báo:

```bash
# Trong menu, nhấn 't' hoặc chạy riêng:
node test-notification-system.js
```

### 3. Xem dashboard:

Mở trình duyệt: http://localhost:3001

## 📱 Setup Telegram Bot (Tùy chọn)

### Bước 1: Tạo bot

1. Mở Telegram, tìm @BotFather
2. Nhắn lệnh: `/newbot`
3. Đặt tên bot: `VietQR Payment Bot`
4. Đặt username: `vietqr_payment_bot`
5. Copy BOT TOKEN

### Bước 2: Lấy Chat ID

1. Nhắn tin cho bot vừa tạo
2. Vào URL: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
3. Tìm `"chat":{"id":` và copy số ID

### Bước 3: Cấu hình

Thêm vào file `.env`:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

### Bước 4: Test

```bash
node setup-telegram-bot.js
```

## 🎯 API Endpoints

### Lấy Access Token

```bash
GET http://localhost:3000/api/token
```

### Tạo QR Code

```bash
POST http://localhost:3000/api/create
Content-Type: application/json

{
  "accountNo": "0123456789",
  "accountName": "NGUYEN VAN A",
  "acqId": "970436",
  "amount": "50000",
  "addInfo": "Thanh toan don hang ABC123",
  "orderId": "ORDER_001"
}
```

### Transaction Sync (Webhook)

```bash
POST http://localhost:3000/api/transaction-sync
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "transactionid": "TXN123",
  "transactiontime": 1640995200,
  "amount": "50000",
  "content": "THANH TOAN DON HANG ABC123",
  "bankaccount": "0123456789",
  "orderId": "ORDER_001"
}
```

## 📊 Dashboard Features

- **Real-time updates** mỗi 5 giây
- **Thống kê tổng quan**: Tổng giao dịch, tổng tiền, giao dịch hôm nay
- **Chi tiết giao dịch**: Số tiền, thời gian, mã GD, nội dung
- **Responsive design** đẹp mắt

## 🧪 Test Scripts

### Test toàn bộ hệ thống:

```bash
node test-notification-system.js
```

### Test riêng từng API:

```bash
node test-get-token.js      # Test lấy token
node test-qr-api.js         # Test tạo QR
node test-transaction-sync.js # Test webhook
```

### Test Telegram:

```bash
node setup-telegram-bot.js
```

## 📋 File Structure

```
├── app.js                          # Main server
├── notification-service.js         # Service gửi thông báo
├── notification-dashboard.js       # Web dashboard
├── start-all.js                   # Script chạy all-in-one
├── test-notification-system.js    # Test toàn bộ
├── setup-telegram-bot.js          # Setup Telegram
├── transaction-logs.txt           # File log giao dịch
├── routes/
│   ├── generateQR.js              # API tạo QR
│   └── transaction.js             # API webhook
└── models/
    └── responses.js               # Data models
```

## 🔧 Cấu hình nâng cao

### Email Service (Nodemailer)

Trong `notification-service.js`, uncomment và cấu hình:

```javascript
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-app-password",
  },
});
```

### SMS Service

Có thể tích hợp Twilio, Nexmo, hoặc các nhà cung cấp SMS khác.

### Push Notifications

Có thể tích hợp Firebase Cloud Messaging (FCM).

## 🎮 Menu Commands (start-all.js)

- `t` - Test notification system
- `s` - Setup Telegram bot
- `d` - Open dashboard in browser
- `l` - Show recent transaction logs
- `q` - Quit system

## 📝 Log Format

Mỗi giao dịch được ghi vào `transaction-logs.txt`:

```json
{
  "timestamp": "2024-01-25T10:30:00.000Z",
  "refId": "REF1750755916988",
  "transactionId": "TXN123456",
  "amount": "50000",
  "bankAccount": "0123456789",
  "content": "THANH TOAN DON HANG ABC123",
  "orderId": "ORDER_001"
}
```

## 🚨 Troubleshooting

### Lỗi không nhận được thông báo:

1. Kiểm tra server đang chạy (port 3000)
2. Kiểm tra token còn hiệu lực (5 phút)
3. Kiểm tra format dữ liệu webhook

### Lỗi Telegram:

1. Kiểm tra BOT_TOKEN và CHAT_ID trong .env
2. Đảm bảo đã nhắn tin cho bot trước
3. Test bằng `node setup-telegram-bot.js`

### Lỗi âm thanh:

- Chỉ hoạt động trên Windows
- Có thể tắt trong `notification-service.js`

## 🎯 Production Setup

1. **Cấu hình HTTPS** cho webhook từ VietQR
2. **Setup reverse proxy** (nginx)
3. **Cấu hình PM2** để chạy liên tục
4. **Setup monitoring** (Prometheus, Grafana)
5. **Backup logs** định kỳ

## 📞 Hỗ trợ

Hệ thống đã được test đầy đủ và sẵn sàng sử dụng production. Mọi thông báo thanh toán sẽ được ghi lại và hiển thị real-time!

🎉 **Chúc bạn kinh doanh thành công!**
