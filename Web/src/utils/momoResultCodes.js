
export const MOMO_RESULT_CODES = {
  SUCCESS: "0",
  CANCELLED_BY_USER: "1006",
  TIMEOUT: "1001",
  DECLINED: "1002",
  AMOUNT_EXCEEDED: "1004",
};

export function getMoMoResultMessage(resultCode, customMessage) {
  const messages = {
    [MOMO_RESULT_CODES.SUCCESS]: {
      title: "Thanh toán thành công!",
      description:
        "Đơn đặt phòng của bạn đã được xác nhận. Chúng tôi sẽ liên hệ với bạn sớm.",
    },
    [MOMO_RESULT_CODES.CANCELLED_BY_USER]: {
      title: "Đã hủy thanh toán",
      description:
        "Bạn đã hủy giao dịch. Vui lòng thử lại nếu muốn tiếp tục đặt phòng.",
    },
    [MOMO_RESULT_CODES.TIMEOUT]: {
      title: "Giao dịch thất bại",
      description: "Giao dịch vượt quá thời gian thanh toán.",
    },
    [MOMO_RESULT_CODES.DECLINED]: {
      title: "Giao dịch thất bại",
      description: "Giao dịch bị từ chối bởi nhà phát hành.",
    },
    [MOMO_RESULT_CODES.AMOUNT_EXCEEDED]: {
      title: "Số tiền không hợp lệ",
      description: "Số tiền giao dịch vượt quá hạn mức cho phép.",
    },
  };

  // Default message nếu không tìm thấy result code
  const defaultMessage = {
    title: "Giao dịch thất bại",
    description: customMessage || "Đã có lỗi xảy ra. Vui lòng thử lại.",
  };

  return messages[resultCode] || defaultMessage;
}


export function isMoMoPaymentSuccess(resultCode) {
  return resultCode === MOMO_RESULT_CODES.SUCCESS;
}

export function isMoMoPaymentCancelled(resultCode) {
  return resultCode === MOMO_RESULT_CODES.CANCELLED_BY_USER;
}

export function getMoMoPayTypeDisplay(payType) {
  const payTypes = {
    qr: "Quét mã QR",
    aio_qr: "Quét mã QR",
    web: "Ví MoMo",
    app: "App MoMo",
    credit: "Thẻ tín dụng",
    napas: "Thẻ ATM",
  };

  return payTypes[payType] || "Ví MoMo";
}
