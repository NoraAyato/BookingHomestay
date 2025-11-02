import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { showToast } from "../../components/common/Toast";
import { useHomestayData } from "../../hooks/useHomestay";
import { useBookings } from "../../hooks/useBookings";
import { formatPrice } from "../../utils/price";
import { formatDateDisplay, getDaysBetween } from "../../utils/date";
import { getImageUrl } from "../../utils/imageUrl";
import { getAvailableRooms } from "../../api/homestay";
import { getUserInfo } from "../../utils/session";
import ServicesSection from "../../components/booking/ServicesSection";
import AddRoomModal from "../../components/booking/AddRoomModal";
import PoliciesSection from "../../components/homestay/PoliciesSection";

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [initialRoomId, setInitialRoomId] = useState(null); // Track initial room to prevent deletion
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingAvailableRooms, setLoadingAvailableRooms] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState({
    fullName: false,
    email: false,
    phone: false,
  });

  // Fetch homestay services khi có homestayId

  const {
    homestayDetail,
    fetchHomestayDetail,
    loadingDetail,
    homestayServices,
    fetchHomestayServices,
    loadingServices,
  } = useHomestayData();

  const { confirmBooking } = useBookings();

  // Auto-fill customer info từ user hiện tại
  useEffect(() => {
    const user = getUserInfo();
    if (user) {
      const fullName = [user.lastName, user.firstName]
        .filter(Boolean)
        .join(" ")
        .trim();

      setCustomerInfo({
        fullName: fullName || "",
        email: user.email || "",
        phone: user.phone || user.phoneNumber || "",
      });

      // Đánh dấu các field được auto-fill
      setIsAutoFilled({
        fullName: !!(fullName || user.fullName || user.name),
        email: !!user.email,
        phone: !!(user.phone || user.phoneNumber),
      });
    }
  }, []);

  // Lấy thông tin từ URL params
  useEffect(() => {
    const homestayId = searchParams.get("homestayId");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const bookingId = searchParams.get("bookingId");
    if (!homestayId || !checkIn || !checkOut) {
      showToast("error", "Thông tin đặt phòng không hợp lệ");
      navigate("/homestay");
      return;
    }

    // Get room info from URL params
    const roomId = searchParams.get("roomId");
    const roomName = searchParams.get("roomName");
    const pricePerNight = searchParams.get("pricePerNight");

    if (!roomId || !roomName || !pricePerNight) {
      showToast("error", "Vui lòng chọn phòng trước khi đặt");
      navigate("/homestay");
      return;
    }

    const roomsArray = [
      {
        roomId,
        roomName: decodeURIComponent(roomName),
        pricePerNight: parseInt(pricePerNight),
      },
    ];

    // Track initial room to prevent deletion
    setInitialRoomId(roomId);

    // Tính toán thông tin booking
    const nights = getDaysBetween(checkIn, checkOut);
    const totalPrice = roomsArray.reduce(
      (sum, room) => sum + room.pricePerNight * nights,
      0
    );
    const serviceFee = totalPrice * 0.1;
    const grandTotal = totalPrice + serviceFee;

    setBookingData({
      bookingId, // Lưu bookingId vào bookingData
      homestayId,
      checkIn,
      checkOut,
      nights,
      totalPrice,
      serviceFee,
      grandTotal,
    });

    setSelectedRooms(roomsArray);

    // Fetch homestay detail
    fetchHomestayDetail(homestayId);
    // Fetch homestay services
    fetchHomestayServices(homestayId);
  }, [searchParams, navigate, fetchHomestayDetail, fetchHomestayServices]);

  // Tính toán giá cho booking
  const calculateFinalPrice = () => {
    if (!bookingData) return {};

    const basePrice = bookingData.totalPrice;
    const servicesTotal = selectedServices.reduce((sum, serviceId) => {
      const service = homestayServices.find((s) => s.id === serviceId);
      return sum + (service ? service.price * bookingData.nights : 0);
    }, 0);

    // Tính tiền cọc: 15% tiền phòng
    const depositAmount = basePrice * 0.15;

    // Phần tiền phòng cần thanh toán tại homestay: 85% tiền phòng + dịch vụ
    const remainingRoomPrice = basePrice * 0.85;
    const totalAtHomestay = remainingRoomPrice + servicesTotal;

    return {
      basePrice,
      servicesTotal,
      depositAmount, // Tiền cọc: 15% tiền phòng thanh toán online
      totalAtHomestay, // Tiền thanh toán tại homestay: 85% phòng + dịch vụ
      finalTotal: depositAmount, // Tiền cần thanh toán ngay (tiền cọc)
    };
  };

  const priceBreakdown = calculateFinalPrice();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleAddRoom = (room) => {
    // Kiểm tra phòng đã được chọn chưa
    const isAlreadySelected = selectedRooms.some(
      (r) => r.roomId === room.roomId
    );

    if (isAlreadySelected) {
      showToast("error", "Phòng này đã được chọn rồi");
      return;
    }

    // Thêm phòng mới
    const updatedRooms = [...selectedRooms, room];
    setSelectedRooms(updatedRooms);

    // Cập nhật bookingData với giá mới
    const nights = bookingData.nights;
    const totalPrice = updatedRooms.reduce(
      (sum, r) => sum + r.pricePerNight * nights,
      0
    );
    const serviceFee = totalPrice * 0.1;
    const grandTotal = totalPrice + serviceFee;

    setBookingData((prev) => ({
      ...prev,
      totalPrice,
      serviceFee,
      grandTotal,
    }));

    setShowAddRoomModal(false);
    showToast("success", "Đã thêm phòng thành công");
  };

  // Fetch available rooms khi mở modal
  const handleOpenAddRoomModal = async () => {
    if (!bookingData) {
      showToast("error", "Không có thông tin booking");
      return;
    }

    setLoadingAvailableRooms(true);
    setShowAddRoomModal(true);

    try {
      const response = await getAvailableRooms({
        homestayId: bookingData.homestayId,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
      });

      if (response.success && Array.isArray(response.data)) {
        // Filter out rooms that are already selected
        const selectedRoomIds = selectedRooms.map((r) => r.roomId);
        const availableRoomsFiltered = response.data.filter(
          (room) => !selectedRoomIds.includes(room.id)
        );
        setAvailableRooms(availableRoomsFiltered);
      } else {
        showToast("error", response.message || "Không thể lấy danh sách phòng");
        setAvailableRooms([]);
      }
    } catch (error) {
      showToast("error", "Lỗi khi tải danh sách phòng: " + error.message);
      setAvailableRooms([]);
    } finally {
      setLoadingAvailableRooms(false);
    }
  };

  const handleRemoveRoom = (roomId) => {
    const updatedRooms = selectedRooms.filter((room) => room.roomId !== roomId);
    setSelectedRooms(updatedRooms);

    // Cập nhật bookingData với giá mới
    const nights = bookingData.nights;
    const totalPrice = updatedRooms.reduce(
      (sum, room) => sum + room.pricePerNight * nights,
      0
    );
    const serviceFee = totalPrice * 0.1;
    const grandTotal = totalPrice + serviceFee;

    setBookingData((prev) => ({
      ...prev,
      totalPrice,
      serviceFee,
      grandTotal,
    }));

    showToast("success", "Đã xóa phòng khỏi đơn đặt");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra thông tin bắt buộc
    if (
      !customerInfo.fullName?.trim() ||
      !customerInfo.email?.trim() ||
      !customerInfo.phone?.trim()
    ) {
      showToast("warning", "Vui lòng cập nhật đầy đủ thông tin tại hồ sơ");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingId = bookingData?.bookingId;
      console.log("Booking ID:", bookingId);
      if (!bookingId) {
        showToast("error", "Không tìm thấy bookingId");
        return;
      }

      // Lấy danh sách roomIds và serviceIds
      // Chỉ lấy các phòng được thêm sau, bỏ phòng đầu tiên (initialRoomId)
      const roomIds = selectedRooms
        .filter((r) => r.roomId !== initialRoomId)
        .map((r) => r.roomId);
      const serviceIds = selectedServices;

      // Gọi API xác nhận booking
      const response = await confirmBooking({
        bookingId,
        serviceIds,
        roomIds,
      });

      // Kiểm tra response thành công
      if (response && response.success !== false) {
        const confirmedBookingId = response.data?.bookingId || bookingId;
        navigate(`/booking/payment?bookingId=${confirmedBookingId}`);
      } else {
        showToast(
          "error",
          response.message || "Có lỗi xảy ra khi xác nhận đặt phòng"
        );
      }
    } catch (error) {
      showToast(
        "error",
        error.message || "Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại."
      );
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
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Xác nhận đặt phòng
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vui lòng kiểm tra thông tin và điền đầy đủ để hoàn tất đặt phòng
              của bạn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
          {/* Left Column - Customer Info Form */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5 text-rose-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Thông tin khách hàng
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={customerInfo.fullName}
                      onChange={handleInputChange}
                      readOnly={isAutoFilled.fullName}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                        isAutoFilled.fullName
                          ? "border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed"
                          : "border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      }`}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      readOnly={isAutoFilled.phone}
                      className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                        isAutoFilled.phone
                          ? "border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed"
                          : "border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      }`}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    readOnly={isAutoFilled.email}
                    className={`w-full px-4 py-3 border rounded-lg transition-colors ${
                      isAutoFilled.email
                        ? "border-gray-300 bg-gray-100 text-gray-700 cursor-not-allowed"
                        : "border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    }`}
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                </div>

                {/* Services Section */}
                <ServicesSection
                  availableServices={homestayServices}
                  selectedServices={selectedServices}
                  onServiceToggle={handleServiceToggle}
                />

                {/* Policies Section */}
                <PoliciesSection policies={homestayDetail?.policies} />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-12 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                      Xác nhận đặt phòng
                    </div>
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
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Chi tiết đặt phòng
                </h2>
              </div>

              {/* Homestay Info */}
              <div className="flex items-start mb-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                <img
                  src={getImageUrl(homestayDetail.images?.[0])}
                  alt={homestayDetail.title}
                  className="w-24 h-24 rounded-xl object-cover mr-6 shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">
                    {homestayDetail.title}
                  </h3>
                  <p className="text-gray-600 mb-3 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {homestayDetail.address}
                  </p>
                  <div className="flex items-center">
                    <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                      <svg
                        className="w-4 h-4 text-yellow-500 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold text-yellow-800">
                        {homestayDetail.rating}
                      </span>
                      <span className="text-yellow-600 mx-1">·</span>
                      <span className="text-yellow-700 text-sm">
                        {homestayDetail.reviews} đánh giá
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Info */}
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-xl mb-6 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-900 text-sm flex items-center">
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm16 3H5v7h14V10z"
                      />
                    </svg>
                    Phòng ({selectedRooms.length})
                  </h4>
                  <button
                    onClick={handleOpenAddRoomModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded text-xs font-medium transition-colors flex items-center gap-0.5"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Thêm
                  </button>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto pr-2">
                  {selectedRooms.map((room, index) => (
                    <div
                      key={`${room.roomId}-${index}`}
                      className="bg-white p-2 rounded border border-blue-200 flex justify-between items-center text-xs"
                    >
                      <div className="flex-1 truncate">
                        <span className="text-blue-900 font-medium">
                          {index + 1}. {room.roomName}
                        </span>
                        <span className="text-blue-700 font-semibold ml-2">
                          {formatPrice(room.pricePerNight)}đ
                        </span>
                      </div>
                      {selectedRooms.length > 1 &&
                        room.roomId !== initialRoomId && (
                          <button
                            onClick={() => handleRemoveRoom(room.roomId)}
                            className="text-red-500 hover:text-red-700 transition-colors ml-1 flex-shrink-0"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Info */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="font-medium">Nhận phòng:</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {formatDateDisplay(bookingData.checkIn)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-3 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="font-medium">Trả phòng:</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {formatDateDisplay(bookingData.checkOut)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-rose-50 to-orange-50 rounded-xl border border-rose-200">
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-3 text-rose-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <span className="font-medium">Số đêm:</span>
                  </div>
                  <span className="font-bold text-rose-600 text-lg">
                    {bookingData.nights} đêm
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-2 space-y-0.5 text-xs">
                <div className="font-semibold text-gray-700 pb-0.5 text-sm">
                  Giá phòng ({selectedRooms.length}):
                </div>
                {selectedRooms.map((room, index) => (
                  <div
                    key={`${room.roomId}-${index}`}
                    className="flex justify-between text-gray-600 leading-tight text-sm"
                  >
                    <span className="truncate">
                      {room.roomName}: {formatPrice(room.pricePerNight)}đ
                    </span>
                    <span className="ml-2 flex-shrink-0">
                      {formatPrice(room.pricePerNight * bookingData.nights)}đ
                    </span>
                  </div>
                ))}

                <div className="flex justify-between pt-0.5 border-t text-gray-700 font-medium leading-tight text-sm">
                  <span>Tổng</span>
                  <span>{formatPrice(priceBreakdown.basePrice)}đ</span>
                </div>

                {/* Selected Services */}
                {selectedServices.length > 0 && (
                  <>
                    <div className="font-medium text-gray-700 pt-0.5">
                      Dịch vụ:
                    </div>
                    {selectedServices.map((serviceId) => {
                      const service = homestayServices.find(
                        (s) => s.id === serviceId
                      );
                      return (
                        <div
                          key={serviceId}
                          className="flex justify-between text-gray-600 leading-tight"
                        >
                          <span className="truncate">{service.name}</span>
                          <span className="ml-2 flex-shrink-0">
                            {formatPrice(service.price * bookingData.nights)}đ
                          </span>
                        </div>
                      );
                    })}
                  </>
                )}

                {/* Price Summary Section */}
                <div className="mt-6 pt-4 border-t-2 border-gray-300 space-y-3">
                  {/* Main Notice */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                    <div className="flex items-start">
                      <svg
                        className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="font-bold text-lg mb-1">
                          Bạn chỉ cần thanh toán 15% tiền phòng
                        </p>
                        <p className="text-sm text-blue-100">
                          Số còn lại thanh toán tại homestay khi check-in
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Deposit Amount (To Pay Now) */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        💳 Thanh toán ngay
                      </span>
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                        Thanh toán trực tuyến
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm text-gray-600">
                        15% tiền phòng
                      </span>
                      <span className="text-2xl font-bold text-green-700">
                        {formatPrice(priceBreakdown.depositAmount)}đ
                      </span>
                    </div>
                    <p className="text-xs text-green-700 bg-green-100 p-2 rounded">
                      ℹ️ Khoản này là tiền cọc, sẽ được trừ từ tổng tiền khi
                      check-in
                    </p>
                  </div>

                  {/* Remaining Payment (At Homestay) */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border-2 border-amber-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        🏠 Thanh toán tại homestay
                      </span>
                      <span className="text-xs bg-amber-600 text-white px-2 py-1 rounded-full">
                        Check-in
                      </span>
                    </div>
                    <div className="space-y-1 mb-2">
                      <div className="flex justify-between text-sm text-gray-700">
                        <span>85% tiền phòng</span>
                        <span className="font-semibold text-amber-700">
                          {formatPrice(priceBreakdown.basePrice * 0.85)}đ
                        </span>
                      </div>
                      {selectedServices.length > 0 && (
                        <div className="flex justify-between text-sm text-gray-700">
                          <span>Dịch vụ</span>
                          <span className="font-semibold text-amber-700">
                            {formatPrice(priceBreakdown.servicesTotal)}đ
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-amber-200 pt-2 flex justify-between font-bold text-amber-900">
                      <span>Cần thanh toán</span>
                      <span className="text-xl text-amber-700">
                        {formatPrice(priceBreakdown.totalAtHomestay)}đ
                      </span>
                    </div>
                  </div>

                  {/* Total Summary */}
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-900">
                        Tổng giá trị đặt phòng
                      </span>
                      <span className="text-3xl font-bold text-rose-600">
                        {formatPrice(
                          priceBreakdown.basePrice +
                            priceBreakdown.servicesTotal
                        )}
                        đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                  <p className="text-gray-700 mb-4 font-medium flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    Cần hỗ trợ?
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 mr-3 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="font-semibold">Hotline: 1900 1234</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 mr-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="font-semibold">
                        support@bookinghomestay.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Room Modal */}
        <AddRoomModal
          isOpen={showAddRoomModal}
          isLoading={loadingAvailableRooms}
          availableRooms={availableRooms}
          selectedRooms={selectedRooms}
          bookingData={bookingData}
          onClose={() => setShowAddRoomModal(false)}
          onAddRoom={handleAddRoom}
        />
      </div>
    </div>
  );
};

export default BookingPage;
