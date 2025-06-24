# 🏪 HƯỚNG DẪN ĐĂNG KÝ MERCHANT VIETQR & WEBHOOK

## 📋 QUY TRÌNH ĐĂNG KÝ MERCHANT VIETQR

### 🔗 **Các trang quan trọng:**

- **Đăng ký Merchant:** https://vietqr.vn/merchant/request
- **Developer Portal:** https://dev.vietqr.org/
- **API Documentation:** https://api.vietqr.vn/
- **Support Chat:** https://vietqr.vn/merchant/request (có chatbot)

## 🚀 BƯỚC 1: ĐĂNG KÝ TÀI KHOẢN MERCHANT

### 📞 **Liên hệ VietQR Support:**

1. Truy cập: https://vietqr.vn/merchant/request
2. Chat với nhân viên hỗ trợ VietQR
3. Yêu cầu đăng ký tài khoản merchant
4. Cung cấp thông tin doanh nghiệp

### 📋 **Thông tin cần chuẩn bị:**

- Tên công ty/doanh nghiệp
- Mã số thuế
- Địa chỉ kinh doanh
- Thông tin người đại diện
- Website/app của bạn
- Mô tả nghiệp vụ sử dụng VietQR

## 🔧 BƯỚC 2: CẤU HÌNH WEBHOOK URL

### 🌐 **Webhook URL hiện tại của bạn:**

```
https://d01c-2402-800-620c-1c66-4914-6270-f1f1-f5.ngrok-free.app/bank/api/transaction-sync
```

### ⚠️ **LƯU Ý QUAN TRỌNG:**

- URL ngrok trên **CHỈ dành cho testing**
- **Production cần URL cố định**
- VietQR sẽ yêu cầu domain thật cho production

## 🏭 BƯỚC 3: SETUP PRODUCTION WEBHOOK

### Option 1: **Deploy lên Cloud Service** (Khuyến nghị)

```bash
# Vercel (miễn phí)
npm install -g vercel
vercel

# Sẽ có URL cố định:
# https://your-vietqr-backend.vercel.app
```

### Option 2: **VPS/Server riêng**

```bash
# Domain example:
# https://webhook.yourcompany.com
# https://api.yourcompany.com
```

### Option 3: **Ngrok Pro** (có phí)

```bash
# Reserved domain
# https://yourapp.ngrok.io
```

## 📝 BƯỚC 4: ĐĂNG KÝ WEBHOOK VỚI VIETQR

### 🗣️ **Nói với VietQR Support:**

"Xin chào, tôi muốn đăng ký sử dụng API VietQR với callback webhook.

- Domain webhook: https://your-domain.com/bank/api/transaction-sync
- Mục đích: Nhận thông báo tự động khi có thanh toán QR
- Nghiệp vụ: [Mô tả business của bạn]"

### 📊 **Thông tin cần cung cấp:**

- **Webhook URL:** `https://your-domain.com/bank/api/transaction-sync`
- **HTTP Method:** POST
- **Content-Type:** application/json
- **Timeout:** 30 seconds
- **Retry:** 3 times

## 🧪 BƯỚC 5: TEST VỚI SANDBOX

### 🔑 **Credentials từ VietQR:**

Sau khi đăng ký, bạn sẽ nhận được:

- Client ID
- API Key
- Sandbox/Test environment access
- Production environment access (sau khi test xong)

### 🛠️ **Cấu hình Environment:**

```javascript
// .env file
VIETQR_CLIENT_ID=your_client_id
VIETQR_API_KEY=your_api_key
VIETQR_ENVIRONMENT=sandbox // hoặc production
WEBHOOK_URL=https://your-domain.com/bank/api/transaction-sync
```

## 🎯 SỬ DỤNG NGROK CHO TESTING

### 🔄 **Workflow hiện tại (Testing):**

```bash
# 1. Start server
npm start

# 2. Start ngrok (terminal mới)
npx ngrok http 3000

# 3. Copy URL và báo cho VietQR support
# https://xxx.ngrok-free.app/bank/api/transaction-sync

# 4. Test với scripts
npm run test:webhook
npm run test:qr
```

### 📞 **Nói với VietQR:**

"Tôi đang test với ngrok URL: https://xxx.ngrok-free.app/bank/api/transaction-sync
Xin hỗ trợ cấu hình webhook test environment."

## 🚀 PRODUCTION DEPLOYMENT

### 📦 **Deploy script:**

```bash
# Tạo production build
npm run build

# Deploy lên Vercel
vercel --prod

# Hoặc deploy lên server
pm2 start app.js --name vietqr-webhook
```

### 🔗 **Cập nhật webhook URL:**

```bash
# Production URL example:
https://vietqr-webhook.vercel.app/bank/api/transaction-sync
```

## 📋 CHECKLIST HOÀN CHỈNH

### ✅ **Đã hoàn thành:**

- [x] Backend VietQR webhook system
- [x] Notification system (sound, log, console)
- [x] Test scripts đầy đủ
- [x] Ngrok setup cho testing

### 🔄 **Cần làm tiếp:**

- [ ] Liên hệ VietQR support đăng ký merchant
- [ ] Deploy production webhook URL
- [ ] Cấu hình webhook với VietQR
- [ ] Test với VietQR sandbox
- [ ] Go live với production

## 💬 SCRIPT CHAT VỚI VIETQR SUPPORT

### 📞 **Message template:**

```
Xin chào VietQR Support!

Tôi muốn đăng ký sử dụng VietQR API với các thông tin sau:

🏢 Thông tin doanh nghiệp:
- Tên: [Tên công ty của bạn]
- MST: [Mã số thuế]
- Địa chỉ: [Địa chỉ]
- Website: [Website của bạn]

🎯 Mục đích sử dụng:
- Tạo QR code thanh toán tự động
- Nhận callback webhook khi có thanh toán
- Tích hợp vào hệ thống [mô tả hệ thống]

🔗 Webhook URL (testing):
https://d01c-2402-800-620c-1c66-4914-6270-f1f1-f5.ngrok-free.app/bank/api/transaction-sync

🔗 Webhook URL (production - sẽ cung cấp sau):
https://your-domain.com/bank/api/transaction-sync

Xin hỗ trợ tôi setup tài khoản và cấu hình webhook.

Cảm ơn!
```

## 🎉 KẾT QUẢ MONG ĐỢI

### 📨 **Từ VietQR bạn sẽ nhận được:**

- Tài khoản developer portal
- Client ID & API Key
- Hướng dẫn integration chi tiết
- Support team riêng
- Webhook configuration

### 🚀 **Sau khi setup xong:**

- Tạo QR code real-time
- Nhận callback tự động
- Notification system hoạt động
- Production ready!

---

## 🔥 ACTION PLAN NGAY:

1. **Chat VietQR support:** https://vietqr.vn/merchant/request
2. **Deploy production URL:** Dùng Vercel/Heroku miễn phí
3. **Cung cấp webhook URL cho VietQR**
4. **Test và go live!**

**→ Hệ thống của bạn đã sẵn sàng, chỉ cần đăng ký với VietQR! 🚀**
