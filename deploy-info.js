// Script deploy lên server thật (VPS, Heroku, Railway, etc.)

// package.json cần có:
{
  "name": "vietqr-webhook",
  "version": "1.0.0",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "body-parser": "^1.20.0",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.0",
    "axios": "^1.4.0"
  }
}

// Dockerfile (nếu dùng Docker)
/*
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
*/

// .env production
/*
PORT=3000
SECRET_KEY=your-production-secret-key-256-bit
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id
*/

console.log('🚀 Deploy options:');
console.log('1. Railway: https://railway.app');
console.log('2. Render: https://render.com');
console.log('3. Heroku: https://heroku.com');
console.log('4. DigitalOcean App Platform');
console.log('5. AWS Elastic Beanstalk');
console.log('6. VPS (Ubuntu + PM2)');

// Sau khi deploy, webhook URL sẽ là:
// https://your-app-domain.com/bank/api/transaction-sync
