const express = require('express');
const axios = require('axios');
const router = express.Router();

const username = 'customer-vietgiaiph-user25325';
const password = 'Y3VzdG9tZXItdmlldGdpYWlwaC11c2VyMjUzMjU=';

// Route để lấy token
router.post('/token', async (req, res) => {
  try {
    const authString = `${username}:${password}`;
    const encodedAuth = Buffer.from(authString).toString('base64');

    const response = await axios.post('https://dev.vietqr.org/vqr/api/token_generate', {}, {
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Access Token generated');
    res.json({
      success: true,
      message: 'Token generated successfully',
      data: {
        access_token: response.data.access_token
      }
    });

  } catch (error) {
    console.error('❌ Token Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Token generation failed',
      error: error.response?.data || error.message
    });
  }
});

module.exports = router;
