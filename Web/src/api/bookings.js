import http from "./http";
import { BASE_URL, Ngrok_URL } from "./config";

export async function createBooking(maPhong, ngayDen, ngayDi) {
  return await http.post(
    `/api/Booking`,
    {
      maPhong: maPhong,
      ngayDen: ngayDen,
      ngayDi: ngayDi,
    },
    {
      requireAuth: true,
    }
  );
}

export async function bookingConfirm({
  bookingId,
  serviceIds = [],
  roomIds = [],
}) {
  console.log("Booking Confirm Payload:", { bookingId, serviceIds, roomIds });
  return await http.post(
    "/api/Booking/confirm",
    {
      bookingId,
      serviceIds,
      roomIds,
    },
    {
      requireAuth: true,
    }
  );
}

export async function getBookingDetail(bookingId) {
  return await http.get(`/api/Booking/detail/${bookingId}`, {
    requireAuth: true,
  });
}

export async function getBookingAvailablePromotion(bookingId) {
  return await http.get(
    `/api/promotions/available-promotions?maPDPhong=${bookingId}`,
    {
      requireAuth: true,
    }
  );
}

export async function addPromotionToBooking(bookingId, promotionCode) {
  return await http.post(
    `/api/Booking/addPromotion/${bookingId}`,
    {
      promotionCode: promotionCode,
    },
    {
      requireAuth: true,
    }
  );
}

export async function createMoMoPayment(bookingId, amount, description) {
  return await http.post(
    `/api/payment/momo/create`,
    {
      bookingId: bookingId,
      soTien: amount,
      noiDung: description || `Paid For booking ${bookingId}`,
      returnUrl: `${window.location.origin}/booking/confirm`, // URL user được redirect về
      notifyUrl: `${Ngrok_URL}/api/payment/momo/callback`, // Backend callback URL
    },
    {
      requireAuth: true,
    }
  );
}

export function parseMoMoReturnParams(searchParams) {
  // Nếu không truyền searchParams, tạo từ window.location
  const params = searchParams || new URLSearchParams(window.location.search);

  // Parse tất cả params từ MoMo
  const partnerCode = params.get("partnerCode");
  const orderId = params.get("orderId");
  const requestId = params.get("requestId");
  const amount = params.get("amount");
  const orderInfo = params.get("orderInfo");
  const orderType = params.get("orderType");
  const transId = params.get("transId");
  const resultCode = params.get("resultCode");
  const message = params.get("message");
  const payType = params.get("payType");
  const responseTime = params.get("responseTime");
  const signature = params.get("signature");

  // Check nếu không có params từ MoMo (legacy format)
  if (!orderId && !resultCode) {
    const bookingId = params.get("bookingId");
    const paymentId = params.get("paymentId");
    const status = params.get("status");

    // Legacy format
    if (bookingId || paymentId || status) {
      return {
        bookingId,
        paymentId,
        status,
        isLegacy: true,
        isSuccess: status === "success",
        isCancelled: false,
        isEmpty: false,
      };
    }

    // Không có params nào
    return { isEmpty: true };
  }

  const bookingId = extractBookingIdFromOrderInfo(orderInfo);

  // Xác định trạng thái thanh toán
  const isSuccess = resultCode === "0";
  const isCancelled = resultCode === "1006";

  return {
    // MoMo raw data
    partnerCode,
    orderId,
    requestId,
    amount: amount ? parseInt(amount) : 0,
    orderInfo: orderInfo ? decodeURIComponent(orderInfo) : "",
    orderType,
    transId,
    resultCode,
    message: message ? decodeURIComponent(message) : "",
    payType,
    responseTime,
    signature,

    // Parsed/computed fields
    bookingId,
    isSuccess,
    isCancelled,
    isLegacy: false,
    isEmpty: false,
  };
}

export function extractBookingIdFromOrderInfo(orderInfo) {
  if (!orderInfo) return null;

  const match = orderInfo.match(/booking\s+(BK-[a-zA-Z0-9-]+)/i);
  return match ? match[1] : null;
}

export async function confirmMoMoPayment(paymentParams) {
  return await http.post(`/api/payment/momo/confirm`, paymentParams, {
    requireAuth: true,
  });
}
