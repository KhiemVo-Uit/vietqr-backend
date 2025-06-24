const axios = require('axios');

const username = 'customer-vietgiaiph-user25325';
const password = 'Y3VzdG9tZXItdmlldGdpYWlwaC11c2VyMjUzMjU=';

// 👉 Ghép lại chuỗi "username:password"
const authString = `${username}:${password}`;
const encodedAuth = Buffer.from(authString).toString('base64'); // Base64 mã hóa

axios.post('https://dev.vietqr.org/vqr/api/token_generate', {}, {
  headers: {
    'Authorization': `Basic ${encodedAuth}`,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('✅ Access Token:', response.data.access_token);
})
.catch(error => {
  console.error('❌ Token Error:', error.response?.data || error.message);
});
