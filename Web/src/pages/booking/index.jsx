import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { showToast } from "../../components/common/Toast";
import { useHomestayData } from "../../hooks/useHomestay";
import { formatPrice } from "../../utils/price";
import { formatDateDisplay, getDaysBetween } from "../../utils/date";
import { getImageUrl } from "../../utils/imageUrl";

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data cho khuyến mãi
  const availablePromotions = [
    {
      id: "promo1",
      title: "Giảm 15% cho khách hàng mới",
      description: "Áp dụng cho lần đặt phòng đầu tiên",
      discountType: "percentage",
      discountValue: 15,
      minSpend: 500000,
      code: "WELCOME15"
    },
    {
      id: "promo2", 
      title: "Giảm 100,000đ cho đơn từ 1,500,000đ",
      description: "Giảm giá cố định cho đơn hàng lớn",
      discountType: "fixed",
      discountValue: 100000,
      minSpend: 1500000,
      code: "SAVE100K"
    },
    {
      id: "promo3",
      title: "Giảm 10% cuối tuần",
      description: "Áp dụng cho đặt phòng thứ 6-chủ nhật",
      discountType: "percentage", 
      discountValue: 10,
      minSpend: 300000,
      code: "WEEKEND10"
    }
  ];

  // Mock data cho dịch vụ
  const availableServices = [
    {
      id: "service1",
      name: "Đưa đón sân bay",
      description: "Dịch vụ đưa đón từ sân bay về homestay và ngược lại",
      price: 200000,
      icon: "🚗"
    },
    {
      id: "service2",
      name: "Bữa sáng",
      description: "Bữa sáng truyền thống với đặc sản địa phương",
      price: 80000,
      icon: "🍽️"
    },
    {
      id: "service3", 
      name: "Tour thành phố",
      description: "Tour tham quan các điểm nổi tiếng trong thành phố",
      price: 350000,
      icon: "🗺️"
    },
    {
      id: "service4",
      name: "Massage thư giãn",
      description: "Dịch vụ massage thư giãn tại phòng",
      price: 300000,
      icon: "💆‍♀️"
    },
    {
      id: "service5",
      name: "Thuê xe máy",
      description: "Thuê xe máy theo ngày để tự do khám phá",
      price: 150000,
      icon: "🏍️"
    }
  ];

  const { homestayDetail, fetchHomestayDetail, loadingDetail } = useHomestayData();

  // Lấy thông tin từ URL params
  useEffect(() => {
    const homestayId = searchParams.get("homestayId");
    const roomId = searchParams.get("roomId");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const roomName = searchParams.get("roomName");
    const pricePerNight = searchParams.get("pricePerNight");

    if (!homestayId || !roomId || !checkIn || !checkOut) {
      showToast("error", "Thông tin đặt phòng không hợp lệ");
      navigate("/homestay");
      return;
    }

    // Tính toán thông tin booking
    const nights = getDaysBetween(checkIn, checkOut);
    const totalPrice = parseInt(pricePerNight) * nights;
    const serviceFee = totalPrice * 0.1;
    const grandTotal = totalPrice + serviceFee;

    setBookingData({
      homestayId,
      roomId,
      roomName: decodeURIComponent(roomName || ""),
      checkIn,
      checkOut,
      nights,
      pricePerNight: parseInt(pricePerNight),
      totalPrice,
      serviceFee,
      grandTotal,
    });

    // Fetch homestay detail
    fetchHomestayDetail(homestayId);
  }, [searchParams, navigate, fetchHomestayDetail]);

  // Tính toán giá cuối cùng với khuyến mãi và dịch vụ
  const calculateFinalPrice = () => {
    if (!bookingData) return {};

    const basePrice = bookingData.totalPrice;
    const servicesTotal = selectedServices.reduce((sum, serviceId) => {
      const service = availableServices.find(s => s.id === serviceId);
      return sum + (service ? service.price * bookingData.nights : 0);
    }, 0);

    let discountAmount = 0;
    let isValidPromotion = false;

    if (selectedPromotion) {
      const subtotal = basePrice + servicesTotal;
      if (subtotal >= selectedPromotion.minSpend) {
        isValidPromotion = true;
        if (selectedPromotion.discountType === "percentage") {
          discountAmount = (subtotal * selectedPromotion.discountValue) / 100;
        } else {
          discountAmount = selectedPromotion.discountValue;
        }
      }
    }

    const serviceFee = (basePrice + servicesTotal - discountAmount) * 0.1;
    const finalTotal = basePrice + servicesTotal - discountAmount + serviceFee;

    return {
      basePrice,
      servicesTotal,
      discountAmount,
      serviceFee,
      finalTotal,
      isValidPromotion
    };
  };

  const priceBreakdown = calculateFinalPrice();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePromotionSelect = (promotion) => {
    setSelectedPromotion(selectedPromotion?.id === promotion.id ? null : promotion);
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.phone) {
      showToast("error", "Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Chuẩn bị data để gửi API
      const bookingPayload = {
        ...bookingData,
        customerInfo,
        selectedPromotion,
        selectedServices,
        priceBreakdown,
        finalAmount: priceBreakdown.finalTotal
      };

      console.log("Booking data:", bookingPayload);

      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast("success", "Đặt phòng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
      
      // Redirect to booking confirmation or user bookings page
      navigate("/user/bookings");
    } catch (error) {
      showToast("error", "Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingDetail || !bookingData) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!homestayDetail) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>Không tìm thấy thông tin homestay</p>
          <button
            onClick={() => navigate("/homestay")}
            className="text-rose-600 font-medium mt-2 inline-block"
          >
            ← Quay lại trang tìm kiếm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Xác nhận đặt phòng</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vui lòng kiểm tra thông tin và điền đầy đủ để hoàn tất đặt phòng của bạn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
          {/* Left Column - Customer Info Form */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Thông tin khách hàng</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={customerInfo.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Yêu cầu đặc biệt
                  </label>
                  <textarea
                    name="specialRequests"
                    value={customerInfo.specialRequests}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors resize-none"
                    placeholder="Nhập yêu cầu đặc biệt (nếu có)"
                  />
                </div>

                {/* Promotions Section */}
                <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Khuyến mãi có sẵn</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {availablePromotions.map((promotion) => {
                      const isEligible = bookingData && (priceBreakdown.basePrice + priceBreakdown.servicesTotal) >= promotion.minSpend;
                      const isSelected = selectedPromotion?.id === promotion.id;
                      
                      return (
                        <div
                          key={promotion.id}
                          onClick={() => isEligible && handlePromotionSelect(promotion)}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50'
                              : isEligible
                              ? 'border-gray-300 hover:border-orange-300 bg-white'
                              : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <input
                                  type="radio"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  disabled={!isEligible}
                                  className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                                />
                                <h4 className="font-semibold text-gray-900">{promotion.title}</h4>
                                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded font-medium">
                                  {promotion.code}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 ml-7">{promotion.description}</p>
                              <p className="text-xs text-gray-500 ml-7 mt-1">
                                Áp dụng cho đơn hàng từ {formatPrice(promotion.minSpend)}
                              </p>
                              {!isEligible && (
                                <p className="text-xs text-red-500 ml-7 mt-1">
                                  Chưa đủ điều kiện áp dụng
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-orange-600">
                                {promotion.discountType === 'percentage' 
                                  ? `-${promotion.discountValue}%`
                                  : `-${formatPrice(promotion.discountValue)}`
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Services Section */}
                <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Dịch vụ bổ sung</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {availableServices.map((service) => {
                      const isSelected = selectedServices.includes(service.id);
                      
                      return (
                        <div
                          key={service.id}
                          onClick={() => handleServiceToggle(service.id)}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-blue-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 mt-1"
                              />
                              <div className="flex items-start gap-3 flex-1">
                                <span className="text-2xl">{service.icon}</span>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-1">{service.name}</h4>
                                  <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                                {formatPrice(service.price)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">per ngày</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Điều khoản và điều kiện</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Thời gian nhận phòng: 14:00 - 22:00</li>
                    <li>• Thời gian trả phòng: 08:00 - 12:00</li>
                    <li>• Có thể hủy miễn phí trước 24 giờ check-in</li>
                    <li>• Không được phép hút thuốc trong phòng</li>
                    <li>• Không được tổ chức tiệc tùng, gây ồn ào</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-12 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </div>
                  ) : (
                    "Hoàn tất đặt phòng"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sticky top-8">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Chi tiết đặt phòng</h2>
              </div>
              
              {/* Homestay Info */}
              <div className="flex items-start mb-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                <img
                  src={getImageUrl(homestayDetail.images?.[0])}
                  alt={homestayDetail.title}
                  className="w-24 h-24 rounded-xl object-cover mr-6 shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{homestayDetail.title}</h3>
                  <p className="text-gray-600 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {homestayDetail.address}
                  </p>
                  <div className="flex items-center">
                    <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                      <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold text-yellow-800">{homestayDetail.rating}</span>
                      <span className="text-yellow-600 mx-1">·</span>
                      <span className="text-yellow-700 text-sm">{homestayDetail.reviews} đánh giá</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Info */}
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-xl mb-8 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm16 3H5v7h14V10z" />
                  </svg>
                  Phòng đã chọn
                </h4>
                <p className="text-blue-800 font-medium text-lg">{bookingData.roomName}</p>
              </div>

              {/* Date Info */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Nhận phòng:</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatDateDisplay(bookingData.checkIn)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Trả phòng:</span>
                  </div>
                  <span className="font-bold text-gray-900">{formatDateDisplay(bookingData.checkOut)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-rose-50 to-orange-50 rounded-xl border border-rose-200">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-3 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="font-medium">Số đêm:</span>
                  </div>
                  <span className="font-bold text-rose-600 text-lg">{bookingData.nights} đêm</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {formatPrice(bookingData.pricePerNight)}đ x {bookingData.nights} đêm
                  </span>
                  <span>{formatPrice(priceBreakdown.basePrice)}đ</span>
                </div>

                {/* Selected Services */}
                {selectedServices.length > 0 && (
                  <>
                    <div className="text-sm font-medium text-gray-700 pt-2">Dịch vụ bổ sung:</div>
                    {selectedServices.map(serviceId => {
                      const service = availableServices.find(s => s.id === serviceId);
                      return (
                        <div key={serviceId} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {service.name} x {bookingData.nights} đêm
                          </span>
                          <span>{formatPrice(service.price * bookingData.nights)}đ</span>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Promotion Discount */}
                {selectedPromotion && priceBreakdown.isValidPromotion && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">
                      Khuyến mãi ({selectedPromotion.code})
                    </span>
                    <span>-{formatPrice(priceBreakdown.discountAmount)}đ</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Phí dịch vụ (10%)</span>
                  <span>{formatPrice(priceBreakdown.serviceFee)}đ</span>
                </div>

                <div className="flex justify-between pt-3 border-t font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-rose-600">{formatPrice(priceBreakdown.finalTotal)}đ</span>
                </div>

                {/* Savings Display */}
                {selectedPromotion && priceBreakdown.isValidPromotion && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center text-green-700">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">
                        Bạn đã tiết kiệm {formatPrice(priceBreakdown.discountAmount)}đ
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                  <p className="text-gray-700 mb-4 font-medium flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Cần hỗ trợ?
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="font-semibold">Hotline: 1900 1234</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold">support@bookinghomestay.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
