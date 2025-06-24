require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');
const qrRoutes = require('./routes/generateQR');


const app = express();
app.use(bodyParser.json());

// Routes
app.use('/bank/api', authRoutes);  // Token generate endpoint
app.use('/vqr/bank/api/test', transactionRoutes);  // Callback endpoint
app.use('/api', qrRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
