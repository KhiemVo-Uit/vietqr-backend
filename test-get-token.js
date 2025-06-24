const axios = require('axios');

async function testGetToken() {
  try {
    console.log('🔄 Testing Get Token API...');
    
    const response = await axios.get('http://localhost:3000/api/token');
    
    console.log('✅ Response Status:', response.status);
    console.log('📋 Full Response:', JSON.stringify(response.data, null, 2));
    
    const token = response.data.token;
    console.log('\n🎯 Token Details:');
    console.log('📄 Token:', token);
    console.log('⏰ Expires in:', response.data.expiresIn);
    console.log('📏 Token length:', token.length, 'characters');
    
    // Decode JWT để xem thông tin (không verify signature)
    try {
      const tokenParts = token.split('.');
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      console.log('\n🔍 Token Payload:');
      console.log('👤 User:', payload.user);
      console.log('🔐 Authorities:', payload.authorities);
      console.log('⌚ Issued at:', new Date(payload.iat * 1000).toLocaleString());
      console.log('⏰ Expires at:', new Date(payload.exp * 1000).toLocaleString());
    } catch (decodeError) {
      console.log('ℹ️ Token decode info not available');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testGetToken();
