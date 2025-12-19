import { useState, useCallback } from "react";
import {
  createPayment,
  verifyPaymentStatus,
  getBookingForPayment,
} from "../api/payment";
import { isAuthError, showErrorToastIfNotAuth } from "../utils/apiHelper";

export function usePayment() {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(false);

  // Fetch booking details
  const fetchBookingDetails = useCallback(async (bookingId) => {
    setLoadingBooking(true);
    setError(null);
    try {
      const response = await getBookingForPayment(bookingId);
      if (response.data) {
        setBookingDetails(response.data);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || "Lỗi khi tải thông tin đặt phòng";
      setError(errorMessage);
      throw err;
    } finally {
      setLoadingBooking(false);
    }
  }, []);

  // Create payment
  const processPayment = useCallback(
    async (bookingId, depositAmount, paymentMethod) => {
      setLoading(true);
      setError(null);
      try {
        const response = await createPayment(
          bookingId,
          depositAmount,
          paymentMethod
        );

        // Check auth error
        if (isAuthError(response)) {
          return response;
        }

        // Show error if not auth error
        if (!response.success) {
          showErrorToastIfNotAuth(response, "Không thể khởi tạo thanh toán");
          setError(response.message || "Không thể khởi tạo thanh toán");
        } else if (response.data) {
          setPaymentData(response.data);
        }

        return response;
      } catch (err) {
        const errorMessage = err.message || "Lỗi khi khởi tạo thanh toán";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Verify payment status
  const verifyPayment = useCallback(async (paymentId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await verifyPaymentStatus(paymentId);
      return response;
    } catch (err) {
      const errorMessage =
        err.message || "Lỗi khi kiểm tra trạng thái thanh toán";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset state
  const resetPayment = useCallback(() => {
    setPaymentData(null);
    setError(null);
    setBookingDetails(null);
  }, []);

  return {
    paymentData,
    loading,
    error,
    bookingDetails,
    loadingBooking,
    processPayment,
    verifyPayment,
    fetchBookingDetails,
    resetPayment,
  };
}
