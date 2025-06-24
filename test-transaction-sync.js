const axios = require('axios');

async function testTransactionSync() {
  try {
    console.log('🔄 Testing Transaction Sync với dữ liệu thực tế...');
    
    // Dữ liệu giao dịch thực tế từ thông báo của bạn
    const transactionData = {
      transactionid: "FT25175239477018",
      transactiontime: Math.floor(new Date('2025-06-24T15:14:00').getTime() / 1000),
      referencenumber: "9963825765",
      amount: 2000,
      content: "VQR72a6888148.MBVCB.9963825765.251106.VQR72a6888148 VQR thanh toan test.CT tu 0721000613087 NGUYEN PHUOC DAI toi 0397733970 NGUYEN PHUOC DAI tai MB",
      bankaccount: "0397733970",
      orderId: "VQR72a6888148",
      sign: "test_signature",
      terminalCode: "MB",
      urlLink: "",
      serviceCode: "VIETQR",
      subTerminalCode: ""
    };
    
    console.log('📊 Dữ liệu giao dịch:');
    console.log('🆔 Transaction ID:', transactionData.transactionid);
    console.log('⏰ Thời gian:', new Date(transactionData.transactiontime * 1000).toLocaleString('vi-VN'));
    console.log('💰 Số tiền:', transactionData.amount.toLocaleString('vi-VN'), 'VNĐ');
    console.log('💳 Tài khoản:', transactionData.bankaccount);
    console.log('📝 Nội dung:', transactionData.content);
    console.log('🏦 Ngân hàng: MBBank');
    console.log('✅ Trạng thái: Thành công');
      // Tạo JWT token để test (thực tế sẽ từ VietQR)
    const jwt = require('jsonwebtoken');
    const SECRET_KEY = 'your-256-bit-secret'; // Giống trong .env
    const testToken = jwt.sign(
      { 
        sub: 'vietqr-system',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      }, 
      SECRET_KEY
    );
    
    console.log('\n🔐 Test Token:', testToken);
    
    // Gửi request đến Transaction Sync API
    const response = await axios.post('http://localhost:3000/bank/api/transaction-sync', transactionData, {
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ RESPONSE FROM TRANSACTION SYNC:');
    console.log('📋 Status:', response.status);
    console.log('🎯 Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.error === false) {
      console.log('\n🎉 TRANSACTION SYNC THÀNH CÔNG!');
      console.log('🔗 Reference Transaction ID:', response.data.object.reftransactionid);
      console.log('💬 Message:', response.data.toastMessage);
    }
    
  } catch (error) {
    console.error('\n❌ LỖI TRANSACTION SYNC:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testTransactionSync();
