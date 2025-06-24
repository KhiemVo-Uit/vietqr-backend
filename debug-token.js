const axios = require('axios');

async function showFullToken() {
  try {
    console.log('🔄 Đang lấy token đầy đủ...\n');
    
    const response = await axios.get('http://localhost:3000/api/token');
    
    const token = response.data.token;
    
    console.log('📋 THÔNG TIN TOKEN ĐẦY ĐỦ:');
    console.log('=' .repeat(80));
    console.log('🎯 Full Token:');
    console.log(token);
    console.log('\n📏 Token Length:', token.length, 'characters');
    console.log('⏰ Expires In:', response.data.expiresIn);
    console.log('✅ Success:', response.data.success);
    console.log('💬 Message:', response.data.message);
    
    // Tách token thành các phần
    const tokenParts = token.split('.');
    console.log('\n🔍 TOKEN STRUCTURE:');
    console.log('=' .repeat(50));
    console.log('📄 Header:', tokenParts[0]);
    console.log('📦 Payload:', tokenParts[1]);
    console.log('🔐 Signature:', tokenParts[2]);
    
    // Decode header và payload
    try {
      const header = JSON.parse(Buffer.from(tokenParts[0], 'base64').toString());
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      
      console.log('\n🔓 DECODED INFORMATION:');
      console.log('=' .repeat(50));
      console.log('📋 Header:', JSON.stringify(header, null, 2));
      console.log('📦 Payload:', JSON.stringify(payload, null, 2));
      
      console.log('\n📅 TIME INFORMATION:');
      console.log('=' .repeat(30));
      console.log('⌚ Issued At:', new Date(payload.iat * 1000).toLocaleString('vi-VN'));
      console.log('⏰ Expires At:', new Date(payload.exp * 1000).toLocaleString('vi-VN'));
      console.log('⏳ Valid for:', Math.round((payload.exp - payload.iat) / 60), 'minutes');
      
      console.log('\n👤 USER INFORMATION:');
      console.log('=' .repeat(30));
      console.log('🔑 User ID:', payload.user);
      console.log('🛡️ Authorities:', payload.authorities.join(', '));
      
    } catch (decodeError) {
      console.log('❌ Không thể decode token:', decodeError.message);
    }
    
    console.log('\n' + '=' .repeat(80));
    console.log('✅ HIỂN THỊ TOKEN HOÀN TẤT');
    
  } catch (error) {
    console.error('❌ Lỗi khi lấy token:', error.response?.data || error.message);
  }
}

showFullToken();
