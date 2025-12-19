import { useState, useCallback } from "react";
import {
  createBooking,
  bookingConfirm,
  getBookingDetail,
  getBookingAvailablePromotion,
  addPromotionToBooking,
  createMoMoPayment,
  confirmMoMoPayment,
  parseMoMoReturnParams,
  cancelBooking as cancelBookingApi,
} from "../api/bookings";

import {
  isAuthError,
  showErrorToastIfNotAuth,
  handleApiResponse,
} from "../utils/apiHelper";
import { showToast } from "../components/common/Toast";
import { convertToLocalDateTime } from "../utils/date";

export function useBookings() {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Tạo booking mới
  const createNewBooking = useCallback(async (maPhong, ngayDen, ngayDi) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      // Convert dates to LocalDateTime format
      const formattedNgayDen = convertToLocalDateTime(ngayDen, "00:00:00");
      const formattedNgayDi = convertToLocalDateTime(ngayDi, "00:00:00");

      const response = await createBooking(
        maPhong,
        formattedNgayDen,
        formattedNgayDi
      );

      // Dùng handleApiResponse để show toast tự động
      const isSuccess = handleApiResponse(
        response,
        "Đặt phòng thành công!",
        "Không thể tạo đơn đặt phòng"
      );

      if (isSuccess && response.data) {
        setBookingData(response.data);
        setSuccess(true);
      } else {
        setError(response.message || "Không thể tạo đơn đặt phòng");
        setSuccess(false);
      }

      return response;
    } catch (err) {
      const errorMessage = err.message || "Lỗi khi tạo đơn đặt phòng";
      setError(errorMessage);
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  // Hủy booking
  const cancelBooking = useCallback(async (cancelData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cancelBookingApi(cancelData);
      const isSuccess = handleApiResponse(
        response,
        "Hủy đặt phòng thành công!",
        "Không thể hủy đặt phòng"
      );
      if (isSuccess && response.data) {
        return response.data;
      } else {
        setError(response.message || "Không thể hủy đặt phòng");
        return null;
      }
    } catch (err) {
      const errorMessage = err.message || "Lỗi khi hủy đặt phòng";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  // Xác nhận booking
  const confirmBooking = useCallback(
    async ({ bookingId, serviceIds = [], roomIds = [] }) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const response = await bookingConfirm({
          bookingId,
          serviceIds,
          roomIds,
        });
        const isSuccess = handleApiResponse(
          response,
          "Xác nhận đặt phòng thành công! Chuyển tới trang thanh toán...",
          "Không thể xác nhận đặt phòng"
        );
        if (isSuccess && response.data) {
          setBookingData(response.data);
          setSuccess(true);
        } else {
          setError(response.message || "Không thể xác nhận đặt phòng");
          setSuccess(false);
        }
        return response;
      } catch (err) {
        const errorMessage = err.message || "Lỗi khi xác nhận đặt phòng";
        setError(errorMessage);
        setSuccess(false);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Lấy chi tiết booking
  const fetchBookingDetail = useCallback(async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBookingDetail(bookingId);
      const isSuccess = handleApiResponse(
        response,
        null,
        "Không thể lấy chi tiết đặt phòng"
      );
      if (isSuccess && response.data) {
        setBookingData(response.data);
        return response.data;
      } else {
        setError(response.message || "Không thể lấy chi tiết đặt phòng");
        return null;
      }
    } catch (err) {
      const errorMessage = err.message || "Lỗi khi lấy chi tiết đặt phòng";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy khuyến mãi có thể áp dụng cho booking
  const fetchBookingAvailablePromotions = useCallback(async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBookingAvailablePromotion(bookingId);
      const isSuccess = handleApiResponse(
        response,
        null,
        "Không thể lấy khuyến mãi"
      );
      if (isSuccess && response.data) {
        return response.data;
      } else {
        setError(response.message || "Không thể lấy khuyến mãi");
        return null;
      }
    } catch (err) {
      const errorMessage = err.message || "Lỗi khi lấy khuyến mãi";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Áp dụng khuyến mãi cho booking
  const applyPromotionToBooking = useCallback(
    async (bookingId, promotionId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await addPromotionToBooking(bookingId, promotionId);
        const isSuccess = handleApiResponse(
          response,
          "",
          "Không thể áp dụng khuyến mãi"
        );
        if (isSuccess && response.success) {
          return response.success;
        } else {
          setError(response.message || "Không thể áp dụng khuyến mãi");
          return null;
        }
      } catch (err) {
        const errorMessage = err.message || "Lỗi khi áp dụng khuyến mãi";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Tạo thanh toán MoMo
  const initiateMoMoPayment = useCallback(
    async (bookingId, amount, description) => {
      setLoading(true);
      setError(null);
      try {
        const response = await createMoMoPayment(
          bookingId,
          amount,
          description
        );

        const isSuccess = handleApiResponse(
          response,
          null, // Không show toast ở đây, để payment page tự xử lý
          "Không thể khởi tạo thanh toán MoMo"
        );

        if (isSuccess && response.data) {
          return response.data;
        } else {
          setError(response.message || "Không thể khởi tạo thanh toán");
          return null;
        }
      } catch (err) {
        const errorMessage = err.message || "Lỗi khi khởi tạo thanh toán MoMo";
        setError(errorMessage);
        // Không throw error, return null để payment page tự xử lý
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Xác nhận thanh toán MoMo (sau khi user redirect về từ MoMo)
  const confirmMoMoPaymentResult = useCallback(async (paymentParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await confirmMoMoPayment(paymentParams);

      // Check auth error
      if (isAuthError(response)) {
        setLoading(false);
        return null;
      }

      if (response.success) {
        return response.data || {};
      } else {
        showErrorToastIfNotAuth(response, "Không thể xác nhận thanh toán");
        setError(response.message || "Không thể xác nhận thanh toán");
        return null;
      }
    } catch (err) {
      const errorMessage = err.message || "Lỗi khi xác nhận thanh toán MoMo";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset state
  const resetBooking = useCallback(() => {
    setBookingData(null);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    bookingData,
    loading,
    error,
    success,
    createNewBooking,
    confirmBooking,
    fetchBookingDetail,
    fetchBookingAvailablePromotions,
    applyPromotionToBooking,
    initiateMoMoPayment,
    confirmMoMoPaymentResult,
    parseMoMoReturnParams,
    resetBooking,
    cancelBooking,
  };
}
