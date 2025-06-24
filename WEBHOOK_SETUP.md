# Hướng dẫn expose local server bằng ngrok

## Cài đặt ngrok:

1. Download: https://ngrok.com/download
2. Giải nén và đặt vào PATH
3. Đăng ký tài khoản ngrok (free)
4. Lấy auth token từ dashboard

## Sử dụng:

```bash
# 1. Cài đặt auth token (chỉ làm 1 lần)
ngrok authtoken your_auth_token_here

# 2. Chạy server local
node app.js

# 3. Expose server ra internet (terminal khác)
ngrok http 3000

# 4. Copy HTTPS URL từ ngrok (ví dụ: https://abc123.ngrok.io)
```

## Kết quả:

- Local server: http://localhost:3000
- Public URL: https://abc123.ngrok.io
- Webhook endpoint: https://abc123.ngrok.io/bank/api/transaction-sync

## Đăng ký với VietQR:

Khi tạo QR, set webhookUrl = "https://abc123.ngrok.io/bank/api/transaction-sync"
