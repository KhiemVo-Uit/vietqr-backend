@echo off
echo 🚀 Starting ngrok tunnel for VietQR webhook...
echo.
echo ⚠️  Make sure your server is running at http://localhost:3000
echo.
pause
npx ngrok http 3000
