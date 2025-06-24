require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');
const qrRoutes = require('./routes/generateQR');


const app = express();
app.use(bodyParser.json());

// Routes
app.use('/vqr/api', authRoutes);
app.use('/bank/api', transactionRoutes);
app.use('/api', qrRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
