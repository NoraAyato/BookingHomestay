import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/price";
import { showToast } from "../../components/common/Toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { parseMoMoReturnParams } from "../../api/bookings";
import {
  getMoMoResultMessage,
  getMoMoPayTypeDisplay,
} from "../../utils/momoResultCodes";
import { useBookings } from "../../hooks/useBookings";

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const { confirmMoMoPaymentResult, loading: confirmLoading } = useBookings();

  useEffect(() => {
    const handlePaymentReturn = async () => {
      try {
        // Sử dụng hàm parse tối ưu từ API layer
        const parsedInfo = parseMoMoReturnParams(searchParams);

        // Kiểm tra nếu không có params
        if (parsedInfo.isEmpty) {
          showToast("error", "Không tìm thấy thông tin thanh toán");
          setTimeout(() => navigate("/"), 2000);
          return;
        }

        // Lưu thông tin payment tạm thời
        setPaymentInfo(parsedInfo);

        // Nếu thanh toán thành công từ MoMo, confirm với backend
        if (parsedInfo.isSuccess && !parsedInfo.isLegacy) {
          const confirmResult = await confirmMoMoPaymentResult({
            partnerCode: parsedInfo.partnerCode,
            orderId: parsedInfo.orderId,
            requestId: parsedInfo.requestId,
            amount: parsedInfo.amount,
            orderInfo: parsedInfo.orderInfo,
            orderType: parsedInfo.orderType,
            transId: parsedInfo.transId,
            resultCode: parsedInfo.resultCode,
            message: parsedInfo.message,
            payType: parsedInfo.payType,
            responseTime: parsedInfo.responseTime,
            signature: parsedInfo.signature,
          });

          if (confirmResult) {
            setPaymentInfo((prev) => ({
              ...prev,
              backendConfirmed: true,
              confirmData: confirmResult,
            }));
          } else {
            setPaymentInfo((prev) => ({
              ...prev,
              backendConfirmed: false,
              isSuccess: false, // Override success status
            }));
          }
        } else {
          // Show toast cho các trường hợp khác
          if (parsedInfo.isCancelled) {
            showToast("warning", "Bạn đã hủy thanh toán");
          } else if (!parsedInfo.isLegacy && !parsedInfo.isSuccess) {
            showToast("error", "Thanh toán thất bại");
          }
        }

        setLoading(false);
      } catch (error) {
        showToast("error", "Có lỗi xảy ra khi xử lý kết quả thanh toán");
        setLoading(false);
      }
    };

    handlePaymentReturn();
  }, [searchParams, navigate, confirmMoMoPaymentResult]);

  // Auto countdown and redirect on success
  useEffect(() => {
    if (paymentInfo?.isSuccess || paymentInfo?.status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/user/booking-history");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentInfo, navigate]);

  // Loading state
  if (loading || confirmLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">
            {confirmLoading
              ? "Đang xác nhận thanh toán với hệ thống..."
              : "Đang xử lý kết quả thanh toán..."}
          </p>
        </div>
      </div>
    );
  }

  if (!paymentInfo) {
    return null;
  }

  // Get result message từ utility function
  const resultMessage = getMoMoResultMessage(
    paymentInfo.resultCode,
    paymentInfo.message
  );

  // Xử lý legacy format (bookingId, paymentId, status)
  if (paymentInfo.isLegacy) {
    const isSuccess = paymentInfo.status === "success";

    if (isSuccess) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full bg-green-100 animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-green-600 animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Thanh toán thành công!
              </h1>
              <p className="text-gray-600 mb-6">
                Đơn đặt phòng của bạn đã được xác nhận
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
                {paymentInfo.bookingId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID đặt phòng:</span>
                    <span className="font-mono font-bold text-gray-900">
                      {paymentInfo.bookingId}
                    </span>
                  </div>
                )}
                {paymentInfo.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID thanh toán:</span>
                    <span className="font-mono font-bold text-gray-900">
                      {paymentInfo.paymentId}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t flex justify-between">
                  <span className="text-gray-600 font-medium">Trạng thái:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                    ✓ Đã thanh toán
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 mb-8">
                <p className="text-sm text-blue-900">
                  📧 Email xác nhận đã được gửi tới hộp thư của bạn
                </p>
                <p className="text-sm text-blue-900 mt-2">
                  🔔 Chủ nhà sẽ liên hệ với bạn trong 24 giờ
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/user/booking-history")}
                  className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                >
                  Xem đặt phòng của tôi
                </button>
                <button
                  onClick={() => navigate("/homestay")}
                  className="w-full py-3 px-6 bg-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-300 transition-all"
                >
                  Tiếp tục tìm kiếm
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Đang chuyển hướng trong {countdown} giây...
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  // Xử lý MoMo format
  const { isSuccess, isCancelled } = paymentInfo;

  // Success Page
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          {/* Success Animation */}
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            {/* Checkmark Animation */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full bg-green-100 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-green-600 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m7 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {resultMessage.title}
            </h1>
            <p className="text-gray-600 mb-6">{resultMessage.description}</p>

            {/* Payment Details from MoMo */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
              {paymentInfo.bookingId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ID đặt phòng:</span>
                  <span className="font-mono font-bold text-gray-900">
                    {paymentInfo.bookingId}
                  </span>
                </div>
              )}
              {paymentInfo.orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-mono text-sm font-medium text-gray-900">
                    {paymentInfo.orderId}
                  </span>
                </div>
              )}
              {paymentInfo.transId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã GD MoMo:</span>
                  <span className="font-mono text-sm font-medium text-gray-900">
                    {paymentInfo.transId}
                  </span>
                </div>
              )}
              {paymentInfo.amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="text-lg font-bold text-emerald-600">
                    {formatPrice(paymentInfo.amount)} VNĐ
                  </span>
                </div>
              )}
              {paymentInfo.payType && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium text-gray-900">
                    {getMoMoPayTypeDisplay(paymentInfo.payType)}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t flex justify-between">
                <span className="text-gray-600 font-medium">Trạng thái:</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full font-bold text-sm ${
                    paymentInfo.backendConfirmed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {paymentInfo.backendConfirmed
                    ? "✓ Đã xác nhận"
                    : "⏳ Đang xử lý"}
                </span>
              </div>
            </div>

            {/* Backend Confirmation Status */}
            <div
              className={`rounded-xl p-4 mb-8 ${
                paymentInfo.backendConfirmed ? "bg-blue-50" : "bg-yellow-50"
              }`}
            >
              {paymentInfo.backendConfirmed ? (
                <>
                  <p className="text-sm text-blue-900">
                    ✅ Thanh toán đã được xác nhận với hệ thống
                  </p>
                  <p className="text-sm text-blue-900 mt-2">
                    📧 Email xác nhận đã được gửi tới hộp thư của bạn
                  </p>
                  <p className="text-sm text-blue-900 mt-2">
                    🔔 Chủ nhà sẽ liên hệ với bạn trong 24 giờ
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-yellow-900 font-medium">
                    ⚠️ Thanh toán thành công nhưng chưa xác nhận được với hệ
                    thống
                  </p>
                  <p className="text-sm text-yellow-900 mt-2">
                    Vui lòng liên hệ CSKH nếu booking không xuất hiện trong vòng
                    15 phút
                  </p>
                </>
              )}
            </div>

            {/* Next Steps - Only show if backend confirmed */}
            {!paymentInfo.backendConfirmed && (
              <div className="bg-gray-50 rounded-xl p-4 mb-8 border-l-4 border-yellow-500">
                <p className="text-sm text-gray-700 font-medium">
                  💡 Mẹo: Hệ thống đang xử lý thanh toán
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  • Kiểm tra lại sau 5-10 phút
                </p>
                <p className="text-sm text-gray-600">
                  • Hoặc liên hệ: hotline@sapavn.com
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/user/booking-history")}
                className="w-full py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                Xem đặt phòng của tôi
              </button>
              <button
                onClick={() => navigate("/homestay")}
                className="w-full py-3 px-6 bg-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-300 transition-all"
              >
                Tiếp tục tìm kiếm
              </button>
            </div>

            {/* Auto Redirect Message */}
            <p className="text-sm text-gray-500 mt-6">
              Đang chuyển hướng trong {countdown} giây...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Failure Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <div
                className={`absolute inset-0 rounded-full animate-pulse ${
                  isCancelled ? "bg-amber-100" : "bg-red-100"
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {isCancelled ? (
                  <svg
                    className="w-16 h-16 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-16 h-16 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {resultMessage.title}
          </h1>
          <p className="text-gray-600 mb-6">{resultMessage.description}</p>

          {/* Payment Details */}
          {(paymentInfo.orderId || paymentInfo.amount > 0) && (
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left space-y-3">
              {paymentInfo.bookingId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">ID đặt phòng:</span>
                  <span className="font-mono text-sm font-medium text-gray-900">
                    {paymentInfo.bookingId}
                  </span>
                </div>
              )}
              {paymentInfo.orderId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-mono text-sm font-medium text-gray-900">
                    {paymentInfo.orderId}
                  </span>
                </div>
              )}
              {paymentInfo.amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(paymentInfo.amount)} VNĐ
                  </span>
                </div>
              )}
              <div className="pt-3 border-t flex justify-between">
                <span className="text-gray-600 font-medium">Trạng thái:</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full font-bold text-sm ${
                    isCancelled
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isCancelled ? "Đã hủy" : "Thất bại"}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {paymentInfo.bookingId ? (
              <button
                onClick={() =>
                  navigate(`/booking?bookingId=${paymentInfo.bookingId}`)
                }
                className={`w-full py-3 px-6 bg-gradient-to-r text-white font-bold rounded-xl transition-all shadow-lg ${
                  isCancelled
                    ? "from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    : "from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                }`}
              >
                Thử lại thanh toán
              </button>
            ) : (
              <button
                onClick={() => navigate("/homestay")}
                className="w-full py-3 px-6 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all shadow-lg"
              >
                Tìm homestay khác
              </button>
            )}
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 px-6 bg-gray-200 text-gray-900 font-bold rounded-xl hover:bg-gray-300 transition-all"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
