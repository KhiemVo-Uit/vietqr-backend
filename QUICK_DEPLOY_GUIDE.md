# 🚀 QUICK DEPLOY GUIDE CHO VIETQR WEBHOOK

## 📋 TÓM TẮT TÌNH HÌNH

### ✅ **Đã có sẵn:**

- Hệ thống VietQR webhook hoàn chỉnh
- Ngrok URL testing: `https://d01c-2402-800-620c-1c66-4914-6270-f1f1-f5.ngrok-free.app`
- All test scripts đã được cập nhật

### 🎯 **Cần làm ngay:**

1. **Deploy lên production** → URL cố định
2. **Đăng ký với VietQR** → Merchant account
3. **Cấu hình webhook** → Nhận callback thật

## ⚡ DEPLOY NHANH LÊN VERCEL

### 1. Cài đặt Vercel:

```bash
npm install -g vercel
```

### 2. Deploy:

```bash
# Trong thư mục d:\fullstack\my-backend
vercel

# Làm theo hướng dẫn:
# ? Set up and deploy "d:\fullstack\my-backend"? [Y/n] y
# ? Which scope do you want to deploy to? [Your username]
# ? Link to existing project? [y/N] n
# ? What's your project's name? vietqr-webhook
# ? In which directory is your code located? ./
```

### 3. Kết quả:

```
✅ Production: https://vietqr-webhook-xxx.vercel.app [copied to clipboard]
📋 Webhook URL: https://vietqr-webhook-xxx.vercel.app/bank/api/transaction-sync
```

## 📞 LIÊN HỆ VIETQR

### 🔗 **Chat với VietQR Support:**

Truy cập: https://vietqr.vn/merchant/request

### 💬 **Message template:**

```
Xin chào VietQR Support!

Tôi muốn đăng ký merchant account để sử dụng VietQR API với webhook callback.

🏢 Thông tin:
- Tên: [Tên của bạn/công ty]
- Email: [Email của bạn]
- Phone: [Số điện thoại]
- Website: [Website nếu có]

🎯 Mục đích:
- Tạo QR code thanh toán
- Nhận callback tự động khi có thanh toán
- Tích hợp vào hệ thống [mô tả nghiệp vụ]

🔗 Webhook URL:
Production: https://vietqr-webhook-xxx.vercel.app/bank/api/transaction-sync
Testing: https://d01c-2402-800-620c-1c66-4914-6270-f1f1-f5.ngrok-free.app/bank/api/transaction-sync

Xin hỗ trợ tôi setup tài khoản và cấu hình webhook.

Cảm ơn!
```

## 🔧 CẬP NHẬT PRODUCTION URL

### Sau khi deploy, cập nhật URL trong code:

```javascript
// Production webhook URL
const PRODUCTION_WEBHOOK_URL =
  "https://vietqr-webhook-xxx.vercel.app/bank/api/transaction-sync";

// Khi tạo QR trong production
const qrData = {
  bankAccount: "0397733970",
  amount: "50000",
  content: "Thanh toan don hang",
  webhookUrl: PRODUCTION_WEBHOOK_URL,
};
```

## 🧪 TEST PRODUCTION

### 1. Test API endpoint:

```bash
curl https://vietqr-webhook-xxx.vercel.app/api/token
```

### 2. Test webhook:

```bash
curl -X POST https://vietqr-webhook-xxx.vercel.app/bank/api/transaction-sync \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 📊 WORKFLOW HOÀN CHỈNH

### 🔄 **Development:**

```bash
npm start                    # Local server
npx ngrok http 3000         # Public URL cho test
npm run test:webhook        # Test với ngrok
```

### 🚀 **Production:**

```bash
vercel                      # Deploy production
# Update VietQR webhook URL
# Test với QR thật
```

## 🎯 NEXT ACTIONS

1. **Deploy ngay:** `vercel` trong terminal
2. **Chat VietQR:** https://vietqr.vn/merchant/request
3. **Cung cấp webhook URL** cho VietQR
4. **Test và go live!**

---

## 🔥 TL;DR - LÀM NGAY:

```bash
# 1. Deploy
npm install -g vercel
vercel

# 2. Chat VietQR với URL production
# 3. Profit! 🎉
```

**→ Hệ thống đã sẵn sàng 100%, chỉ cần deploy và đăng ký VietQR!**
