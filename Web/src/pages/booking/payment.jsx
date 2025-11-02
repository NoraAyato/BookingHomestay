import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/price";
import { showToast } from "../../components/common/Toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PromotionsSection from "../../components/booking/PromotionsSection";
import { useBookings } from "../../hooks/useBookings";
import { getDaysBetween } from "../../utils/date";
import { getImageUrl } from "../../utils/imageUrl";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    fetchBookingDetail,
    fetchBookingAvailablePromotions,
    applyPromotionToBooking,
    initiateMoMoPayment,
    loading,
  } = useBookings();
  const [bookingData, setBookingData] = useState(null);
  const [availablePromotions, setAvailablePromotions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("momo");
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Lấy bookingId từ URL và gọi API
  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    if (!bookingId) {
      showToast("error", "Không tìm thấy thông tin đặt phòng");
      navigate("/");
      return;
    }

    // Gọi API lấy chi tiết booking
    const loadBookingDetail = async () => {
      try {
        const data = await fetchBookingDetail(bookingId);
        if (data) {
          console.log("Booking detail data:", data);
          setBookingData(data);
          // Sau khi có booking data, load promotions và truyền data để check promotionId
          loadAvailablePromotions(bookingId, data);
        } else {
          showToast("error", "Không thể lấy thông tin đặt phòng");
          navigate("/");
        }
      } catch (error) {
        showToast("error", "Lỗi khi tải thông tin đặt phòng");
        navigate("/");
      }
    };

    // Gọi API lấy promotions có thể áp dụng
    const loadAvailablePromotions = async (bookingId, bookingData) => {
      try {
        const promotions = await fetchBookingAvailablePromotions(bookingId);
        if (promotions) {
          setAvailablePromotions(promotions);

          // Nếu booking đã có promotionId, tự động chọn promotion đó
          if (bookingData?.promotionId) {
            const preSelectedPromo = promotions.find(
              (promo) => promo.id === bookingData.promotionId
            );
            if (preSelectedPromo) {
              setSelectedPromotion(preSelectedPromo);
              console.log("Auto-selected promotion:", preSelectedPromo);
            }
          }
        }
      } catch (error) {
        setAvailablePromotions([]);
      }
    };

    loadBookingDetail();
  }, [
    searchParams,
    navigate,
    fetchBookingDetail,
    fetchBookingAvailablePromotions,
  ]);

  // Show loading spinner while fetching data
  if (loading || !bookingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Tính toán số đêm từ checkIn và checkOut
  const nights = getDaysBetween(bookingData.checkIn, bookingData.checkOut);

  // Tính tổng giá phòng và dịch vụ
  const totalRoomPrice = bookingData.rooms.reduce((sum, room) => {
    return sum + room.price * nights;
  }, 0);

  const servicesPrice = bookingData.rooms.reduce((sum, room) => {
    const roomServicesTotal = room.services.reduce((serviceSum, service) => {
      return serviceSum + service.price;
    }, 0);
    return sum + roomServicesTotal;
  }, 0);

  const { bookingId, homestayName, checkIn, checkOut, rooms, location } =
    bookingData;

  // Calculate discount based on selected promotion (chỉ giảm giá phòng)
  const calculateDiscount = () => {
    if (!selectedPromotion) return 0;

    let discount = 0;
    const discountType = selectedPromotion.discountType?.toLowerCase();

    if (discountType === "percentage") {
      discount = Math.floor(
        (totalRoomPrice * selectedPromotion.discountValue) / 100
      );
    } else if (discountType === "fixed") {
      discount = selectedPromotion.discountValue;
    }

    // Don't exceed maxDiscount if it exists
    if (selectedPromotion.maxDiscount) {
      return Math.min(discount, selectedPromotion.maxDiscount);
    }

    return discount;
  };

  // Calculate final prices
  const discount = calculateDiscount(); // Giảm giá chỉ áp dụng cho phòng
  const finalRoomPrice = totalRoomPrice - discount; // Giá phòng sau giảm
  const finalDepositAmount = Math.floor((finalRoomPrice * 15) / 100); // 15% tiền cọc chỉ tính từ tiền phòng
  const totalPrice = finalRoomPrice + servicesPrice; // Tổng = (Phòng sau giảm) + Dịch vụ
  const remainingAmount = totalPrice - finalDepositAmount; // Còn lại = Tổng - Tiền cọc

  // Check if promotion is eligible
  const isPromotionEligible = (promo) => {
    return totalPrice >= promo.minSpend;
  };

  const handlePromotionSelect = (promotion) => {
    // Nếu booking đã có promotionId (đã apply từ trước), không cho thay đổi
    if (bookingData?.promotionId) {
      showToast("info", "Khuyến mãi đã được áp dụng cho đơn hàng này");
      return;
    }

    if (isPromotionEligible(promotion)) {
      setSelectedPromotion(
        selectedPromotion?.id === promotion.id ? null : promotion
      );
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!agreedTerms) {
      showToast("error", "Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }

    setIsProcessing(true);

    try {
      if (selectedPromotion && !bookingData?.promotionId) {
        try {
          const promotionResult = await applyPromotionToBooking(
            bookingId,
            selectedPromotion.code
          );

          if (!promotionResult) {
            setIsProcessing(false);
            return;
          }
        } catch (promotionError) {
          setIsProcessing(false);
          return;
        }
      } else if (bookingData?.promotionId && selectedPromotion) {
      }

      // Bước 2: Gọi API thanh toán theo phương thức được chọn
      if (selectedPaymentMethod === "momo") {

        const paymentUrl = await initiateMoMoPayment(
          bookingId,
          finalDepositAmount,
          `Đặt cọc booking ${bookingId} - ${homestayName}`
        );

        console.log("MoMo payment URL:", paymentUrl);

        if (
          paymentUrl &&
          typeof paymentUrl === "string" &&
          paymentUrl.startsWith("http")
        ) {
          // Redirect đến MoMo payment gateway
          showToast("success", "Đang chuyển tới MoMo...");
          setTimeout(() => {
            window.location.href = paymentUrl;
          }, 1000);
        } else {
          setIsProcessing(false);
          showToast(
            "error",
            "Không thể khởi tạo thanh toán MoMo. Vui lòng thử lại."
          );
        }
      } else if (selectedPaymentMethod === "vnpay") {
        // TODO: Implement VNPay payment
        showToast("info", "VNPay đang được phát triển");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment error details:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      setIsProcessing(false);

      const errorMessage =
        error.message || "Lỗi khi xử lý thanh toán. Vui lòng thử lại.";
      showToast("error", errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 rounded-xl shadow-lg border-2 border-emerald-300 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl mr-4 shadow-md">
                <svg
                  className="w-9 h-9 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-emerald-800 mb-1">
                  Thanh toán
                </h1>
                <p className="text-sm text-emerald-700 font-medium">
                  Hoàn tất thanh toán cọc để xác nhận đặt phòng
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-2.5 rounded-lg shadow-md">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-sm font-bold text-white">Bảo mật 100%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              {/* Booking Summary */}
              <div className="mb-6 pb-6 border-b">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Chi tiết đặt phòng
                </h2>

                {/* Homestay & Date Info */}
                <div className="bg-gray-50 rounded-md p-3 mb-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-gray-500">Homestay</p>
                      <p className="font-semibold text-sm text-gray-900">
                        {homestayName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Lưu trú</p>
                      <p className="font-semibold text-sm text-gray-900">
                        {nights} đêm
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center text-xs text-gray-600">
                      <svg
                        className="w-3.5 h-3.5 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {checkIn} — {checkOut}
                    </div>
                  </div>
                </div>

                {/* Rooms List */}
                <div className="space-y-2.5">
                  {rooms.map((room, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-md p-3 hover:border-rose-400 transition-colors"
                    >
                      <div className="flex gap-3">
                        {/* Room Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={
                              getImageUrl(room.image) ??
                              "https://via.placeholder.com/150?text=Room"
                            }
                            alt={room.roomType}
                            className="w-20 h-20 object-cover rounded-md"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/150?text=Room";
                            }}
                          />
                        </div>

                        {/* Room Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm text-gray-900 mb-0.5">
                                {room.roomType}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {formatPrice(room.price)}đ
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-sm text-gray-900">
                                {formatPrice(room.price)}đ
                              </p>
                            </div>
                          </div>

                          {/* Services */}
                          {room.services && room.services.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {room.services.map((service, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded"
                                >
                                  <svg
                                    className="w-2.5 h-2.5 mr-0.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {service.name} - {formatPrice(service.price)}đ
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promotions Section */}
              <div className="mb-6">
                <PromotionsSection
                  availablePromotions={availablePromotions}
                  selectedPromotion={selectedPromotion}
                  priceBreakdown={{
                    basePrice: totalRoomPrice,
                    servicesTotal: servicesPrice,
                  }}
                  bookingData={bookingData}
                  onPromotionSelect={handlePromotionSelect}
                  isLocked={!!bookingData?.promotionId}
                />
              </div>

              {/* Payment Methods */}
              <div className="mb-6 pb-6 border-b">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Phương thức thanh toán
                </h2>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* MoMo */}
                  <div
                    onClick={() => setSelectedPaymentMethod("momo")}
                    className={`flex flex-col items-center p-3 rounded-md border-2 cursor-pointer transition-colors ${
                      selectedPaymentMethod === "momo"
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 bg-white hover:border-pink-300"
                    }`}
                  >
                    <div className="w-12 h-12 mb-1.5">
                      <img
                        src="/icon/payment/momo.png"
                        alt="MoMo"
                        className="w-full h-full object-contain rounded-md"
                      />
                    </div>
                    <p className="font-semibold text-gray-900 text-xs">
                      Ví MoMo
                    </p>
                  </div>

                  {/* VNPay */}
                  <div
                    onClick={() => setSelectedPaymentMethod("vnpay")}
                    className={`flex flex-col items-center p-3 rounded-md border-2 cursor-pointer transition-colors ${
                      selectedPaymentMethod === "vnpay"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <div className="w-12 h-12 mb-1.5">
                      <img
                        src="/icon/payment/vnpay.jpg"
                        alt="VNPay"
                        className="w-full h-full object-contain rounded-md"
                      />
                    </div>
                    <p className="font-semibold text-gray-900 text-xs">VNPay</p>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mb-5">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded mt-0.5 flex-shrink-0"
                  />
                  <span className="ml-2.5 text-xs text-gray-700">
                    Tôi đồng ý với{" "}
                    <button className="text-rose-600 hover:underline font-medium">
                      Điều khoản dịch vụ
                    </button>{" "}
                    và{" "}
                    <button className="text-rose-600 hover:underline font-medium">
                      Chính sách bảo mật
                    </button>
                  </span>
                </label>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePaymentSubmit}
                disabled={isProcessing || !agreedTerms}
                className={`w-full py-3 px-6 rounded-md font-semibold text-sm transition-colors flex items-center justify-center ${
                  isProcessing || !agreedTerms
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-rose-600 text-white hover:bg-rose-700"
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Thanh toán ngay
                  </>
                )}
              </button>

              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="w-full mt-2 py-2 px-6 rounded-md font-medium text-xs text-gray-600 hover:bg-gray-50 transition-colors border border-gray-200"
              >
                Quay lại
              </button>
            </div>
          </div>

          {/* Payment Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-rose-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Tổng thanh toán
              </h3>

              {/* Price Breakdown */}
              <div className="space-y-2.5 mb-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Tổng giá phòng</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(totalRoomPrice)}đ
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Tổng giá dịch vụ</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(servicesPrice)}đ
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center bg-green-50 p-2 rounded-md">
                    <span className="text-green-700 font-medium text-xs">
                      Giảm giá (áp dụng cho phòng)
                    </span>
                    <span className="font-semibold text-green-600 text-xs">
                      -{formatPrice(discount)}đ
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs pt-2 border-t">
                  <span className="text-gray-900 font-semibold">Tổng cộng</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(totalPrice)}đ
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="bg-rose-50 rounded-md p-3">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs text-gray-700 font-medium">
                      Tiền cọc (15%)
                    </span>
                    <span className="text-lg font-bold text-rose-600">
                      {formatPrice(finalDepositAmount)}đ
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Còn lại: {formatPrice(remainingAmount)}đ thanh toán khi nhận
                    phòng
                  </p>
                </div>
              </div>

              {/* Info Cards */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-start text-xs text-gray-600 p-2 bg-blue-50 rounded-md">
                  <svg
                    className="w-3.5 h-3.5 text-blue-600 mt-0.5 mr-1.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-medium text-blue-900">
                    Hủy miễn phí trước 3 ngày
                  </p>
                </div>

                <div className="flex items-start text-xs text-gray-600 p-2 bg-green-50 rounded-md">
                  <svg
                    className="w-3.5 h-3.5 text-green-600 mt-0.5 mr-1.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-medium text-green-900">
                    Xác nhận ngay lập tức
                  </p>
                </div>

                <div className="flex items-start text-xs text-gray-600 p-2 bg-gray-50 rounded-md border border-gray-200">
                  <svg
                    className="w-3.5 h-3.5 text-gray-600 mt-0.5 mr-1.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="font-medium text-gray-900">
                    Thanh toán bảo mật SSL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Cần giúp đỡ?{" "}
            <button className="text-rose-600 hover:text-rose-700 font-medium">
              Liên hệ hỗ trợ
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
