// Code của bạn + thêm notification đơn giản

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

const SECRET_KEY = 'your-256-bit-secret';
const BEARER_PREFIX = 'Bearer ';

app.use(bodyParser.json());

// Model classes (giữ nguyên)
class TransactionCallback {
    constructor(transactionid, transactiontime, referencenumber, amount, content, bankaccount, orderId, sign, terminalCode, urlLink, serviceCode, subTerminalCode) {
        this.transactionid = transactionid;
        this.transactiontime = transactiontime;
        this.referencenumber = referencenumber;
        this.amount = amount;
        this.content = content;
        this.bankaccount = bankaccount;
        this.orderId = orderId;
        this.sign = sign;
        this.terminalCode = terminalCode;
        this.urlLink = urlLink;
        this.serviceCode = serviceCode;
        this.subTerminalCode = subTerminalCode;
    }
}

class SuccessResponse {
    constructor(error, errorReason, toastMessage, object) {
        this.error = error;
        this.errorReason = errorReason;
        this.toastMessage = toastMessage;
        this.object = object;
    }
}

class ErrorResponse {
    constructor(error, errorReason, toastMessage, object) {
        this.error = error;
        this.errorReason = errorReason;
        this.toastMessage = toastMessage;
        this.object = object;
    }
}

class TransactionResponseObject {
    constructor(reftransactionid) {
        this.reftransactionid = reftransactionid;
    }
}

// 🎉 THÊM FUNCTION THÔNG BÁO ĐỠN GIẢN
function notifyPayment(transaction, refId) {
    console.log('\n🎉 ===== CÓ KHÁCH THANH TOÁN! =====');
    console.log('💰 Số tiền:', Number(transaction.amount).toLocaleString('vi-VN'), 'VNĐ');
    console.log('🆔 Mã GD:', transaction.transactionid);
    console.log('📝 Nội dung:', transaction.content);
    console.log('🔗 Ref ID:', refId);
    console.log('⏰ Thời gian:', new Date(transaction.transactiontime * 1000).toLocaleString('vi-VN'));
    console.log('================================\n');
    
    // Phát âm thanh (Windows)
    try {
        const { spawn } = require('child_process');
        spawn('powershell', ['-c', '[System.Media.SystemSounds]::Beep.Play()'], { stdio: 'ignore' });
        console.log('🔊 Đã phát âm thanh thông báo!');
    } catch (e) {
        console.log('⚠️ Không thể phát âm thanh');
    }
}

// API transaction-sync (sửa một chút)
app.post('/bank/api/transaction-sync', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
        return res.status(401).json(new ErrorResponse(true, "INVALID_AUTH_HEADER", "Authorization header is missing or invalid", null));
    }

    const token = authHeader.substring(BEARER_PREFIX.length).trim();

    if (!validateToken(token)) {
        return res.status(401).json(new ErrorResponse(true, "INVALID_TOKEN", "Invalid or expired token", null));
    }

    const transactionCallback = new TransactionCallback(
        req.body.transactionid,
        req.body.transactiontime,
        req.body.referencenumber,
        req.body.amount,
        req.body.content,
        req.body.bankaccount,
        req.body.orderId,
        req.body.sign,
        req.body.terminalCode,
        req.body.urlLink,
        req.body.serviceCode,
        req.body.subTerminalCode
    );

    try {
        // Sinh mã ref ID với timestamp để unique
        const refTransactionId = "REF" + Date.now();
        
        // 🎉 THÔNG BÁO THANH TOÁN (THÊM DÒNG NÀY!)
        notifyPayment(transactionCallback, refTransactionId);

        return res.status(200).json(new SuccessResponse(false, null, "Transaction processed successfully", new TransactionResponseObject(refTransactionId)));
    } catch (error) {
        return res.status(400).json(new ErrorResponse(true, "TRANSACTION_FAILED", error.message, null));
    }
});

const validateToken = (token) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return true;
    } catch (error) {
        return false;
    }
};

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 Webhook endpoint: http://localhost:${PORT}/bank/api/transaction-sync`);
    console.log(`🎉 Sẵn sàng nhận thông báo thanh toán!`);
});
