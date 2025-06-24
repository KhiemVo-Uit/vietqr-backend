# 🎯 HƯỚNG DẪN NHẬN WEBHOOK THỰC TẾ TỪ VIETQR

## Bước 1: Chuẩn bị môi trường

```bash
# Terminal 1: Chạy server local
cd d:\fullstack\my-backend
node app.js

# Terminal 2: Expose ra internet với ngrok
ngrok http 3000
# Copy HTTPS URL: https://abc123.ngrok.io
```

## Bước 2: Tạo QR với webhook URL

```javascript
// Khi tạo QR, thêm webhookUrl:
{
  "accountNo": "0123456789",
  "accountName": "NGUYEN VAN A",
  "amount": "50000",
  "addInfo": "Thanh toan don hang",
  "webhookUrl": "https://abc123.ngrok.io/bank/api/transaction-sync"
}
```

## Bước 3: Khách hàng thanh toán

1. Khách quét QR bằng app banking
2. Thanh toán số tiền
3. Ngân hàng xử lý giao dịch
4. VietQR nhận thông báo từ ngân hàng

## Bước 4: VietQR gửi webhook

VietQR sẽ POST đến webhook URL:

```
POST https://abc123.ngrok.io/bank/api/transaction-sync
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "transactionid": "FT25175239477018",
  "transactiontime": 1640995200,
  "referencenumber": "9963825765",
  "amount": "50000",
  "content": "THANH TOAN DON HANG ABC123",
  "bankaccount": "0123456789",
  "orderId": "ORDER_123"
}
```

## Bước 5: Server nhận và xử lý

```javascript
// routes/transaction.js sẽ:
1. ✅ Nhận POST request từ VietQR
2. ✅ Xác thực JWT token
3. ✅ Parse dữ liệu giao dịch
4. ✅ Gửi thông báo (âm thanh, log, Telegram...)
5. ✅ Trả response về VietQR
```

## Bước 6: Bạn nhận thông báo

- 🔊 Âm thanh ngay lập tức
- 📱 Tin nhắn Telegram
- 💾 Log trong file
- 📊 Hiển thị trên dashboard

## 🧪 Test Scripts:

```bash
# Test với ngrok
node test-real-webhook.js

# Test local (giả lập)
node test-notification-system.js
```

## 🚨 Lưu ý quan trọng:

1. **HTTPS bắt buộc** - VietQR chỉ gửi webhook đến HTTPS URL
2. **Token verification** - Webhook có JWT token để xác thực
3. **Response format** - Phải trả đúng format SuccessResponse
4. **Timeout** - VietQR đợi response trong 30 giây
5. **Retry** - VietQR sẽ retry 3 lần nếu webhook fail

## 🎯 Production checklist:

- [ ] Deploy server lên VPS/Cloud
- [ ] Cấu hình domain với SSL
- [ ] Setup monitoring/logging
- [ ] Test webhook URL accessible
- [ ] Backup transaction logs
