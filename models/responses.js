// Class chứa thông tin callback từ phía ngân hàng
class TransactionCallback {
  constructor(
    transactionid,
    transactiontime,
    referencenumber,
    amount,
    content,
    bankaccount,
    orderId,
    sign,
    terminalCode,
    urlLink,
    serviceCode,
    subTerminalCode
  ) {
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

// Class định nghĩa cấu trúc trả về khi xử lý thành công
class SuccessResponse {
  constructor(error, errorReason, toastMessage, object) {
    this.error = error;
    this.errorReason = errorReason;
    this.toastMessage = toastMessage;
    this.object = object;
  }
}

// Class định nghĩa cấu trúc trả về khi lỗi xảy ra
class ErrorResponse {
  constructor(error, errorReason, toastMessage, object) {
    this.error = error;
    this.errorReason = errorReason;
    this.toastMessage = toastMessage;
    this.object = object;
  }
}

// Class đối tượng con trả về trong phản hồi thành công
class TransactionResponseObject {
  constructor(reftransactionid) {
    this.reftransactionid = reftransactionid;
  }
}

// Export các class để sử dụng bên ngoài
module.exports = {
  TransactionCallback,
  SuccessResponse,
  ErrorResponse,
  TransactionResponseObject
};
