# 🌐 NGROK URL - CỐ ĐỊNH HAY THAY ĐỔI?

## 📋 TÀI KHOẢN MIỄN PHÍ (Free)

### ❌ **KHÔNG CỐ ĐỊNH**

- Mỗi lần chạy `ngrok http 3000` sẽ tạo URL mới
- URL có format: `https://abc123.ngrok-free.app` (random)
- Khi dừng ngrok và chạy lại → URL hoàn toàn khác

### ⏱️ **THỜI GIAN SỐNG**

- URL tồn tại khi ngrok đang chạy
- Đóng ngrok → URL ngay lập tức hết hiệu lực
- Không thể sử dụng lại URL cũ

### 📊 **VÍ DỤ:**

```
Lần 1: https://abc123.ngrok-free.app
Lần 2: https://def456.ngrok-free.app
Lần 3: https://ghi789.ngrok-free.app
```

## 💎 TÀI KHOẢN TRẢ PHÍ (Paid Plans)

### ✅ **CÓ THỂ CỐ ĐỊNH**

- **Basic Plan ($10/tháng):** Reserved domains
- **Pro Plan ($25/tháng):** Custom domains + nhiều features
- **Business Plan ($50/tháng):** Unlimited features

### 🔗 **CUSTOM DOMAIN**

```
Thay vì: https://abc123.ngrok-free.app
Có thể:  https://yourapp.ngrok.io
Hoặc:    https://webhook.yourcompany.com
```

## 🛠️ GIẢI PHÁP CHO VIETQR

### 1. **SỬ DỤNG NGROK MIỄN PHÍ (Khuyến nghị cho test)**

#### 🔄 **Workflow thông thường:**

```bash
# Terminal 1: Chạy server
npm start

# Terminal 2: Tạo ngrok tunnel
npx ngrok http 3000

# Copy URL mới mỗi lần
# Ví dụ: https://new123.ngrok-free.app
```

#### 📝 **Cập nhật URL trong code:**

```javascript
// Thay đổi trong test files
const NGROK_URL = "https://new123.ngrok-free.app";
```

### 2. **TỰ ĐỘNG CẬP NHẬT URL**

Tôi đã tạo tool để tự động cập nhật URL:

```bash
# Chạy tool tự động
npm run ngrok

# Hoặc setup thủ công
node ngrok-setup.js
```

### 3. **DEPLOY LÊN SERVER THẬT (Khuyến nghị cho production)**

#### 🌐 **Các options:**

- **Vercel:** Free hosting với domain cố định
- **Heroku:** Free tier với domain cố định
- **Railway:** Free tier với domain cố định
- **DigitalOcean:** VPS với domain tùy chỉnh

#### 🔗 **Ví dụ domain cố định:**

```
https://your-vietqr-backend.vercel.app/bank/api/transaction-sync
https://your-app.herokuapp.com/bank/api/transaction-sync
```

## 🚀 HƯỚNG DẪN SETUP NHANH

### Option 1: Ngrok Miễn Phí (Cho Test)

```bash
# 1. Khởi động server
npm start

# 2. Tạo ngrok tunnel (terminal mới)
npx ngrok http 3000

# 3. Copy URL mới
# https://xxx.ngrok-free.app

# 4. Sử dụng URL này cho webhook:
# https://xxx.ngrok-free.app/bank/api/transaction-sync
```

### Option 2: Tool Tự Động

```bash
# Chạy tool để tự động tạo và cập nhật URL
npm run ngrok
```

### Option 3: Deploy Production

```bash
# Deploy lên Vercel (miễn phí)
npm install -g vercel
vercel

# Sẽ có domain cố định như:
# https://your-project.vercel.app
```

## 💡 KHUYẾN NGHỊ

### 🧪 **Cho Testing:**

- Sử dụng ngrok miễn phí
- Chạy tool tự động cập nhật URL
- Mỗi session test sẽ có URL mới

### 🏭 **Cho Production:**

- Deploy lên cloud service (Vercel, Heroku...)
- Có domain cố định
- Đăng ký domain này với VietQR

### 💰 **Nếu cần ngrok cố định:**

- Nâng cấp lên Basic Plan ($10/tháng)
- Có reserved subdomain
- Phù hợp cho development dài hạn

## 🔧 WORKFLOW HIỆN TẠI

Với setup hiện tại của bạn:

1. **Mỗi lần test:**

   ```bash
   # Tạo ngrok tunnel mới
   npx ngrok http 3000
   # → Sẽ có URL mới
   ```

2. **Copy URL mới và sử dụng:**

   ```
   https://new-random-url.ngrok-free.app/bank/api/transaction-sync
   ```

3. **Tool tự động cập nhật:**
   ```bash
   npm run ngrok  # Tự động cập nhật trong test files
   ```

## 📞 SUMMARY

- ❌ **Ngrok miễn phí = URL thay đổi mỗi lần**
- ✅ **Ngrok trả phí = URL cố định được**
- 🚀 **Cloud hosting = URL cố định miễn phí**
- 🛠️ **Tool tự động = Dễ dàng cập nhật URL**

**→ Cho VietQR testing: Dùng ngrok miễn phí + tool tự động là đủ!**
