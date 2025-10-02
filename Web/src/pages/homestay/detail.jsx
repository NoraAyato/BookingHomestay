import React, { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useLocation as useRouterLocation,
} from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ImageGallery from "../../components/common/ImageGallery";
import Breadcrumb from "../../components/common/Breadcrumb";
import RoomsList from "../../components/homestay/RoomsList";
import ReviewsList from "../../components/homestay/ReviewsList";
import LocationMap from "../../components/homestay/LocationMap";
import { useHomestayData } from "../../hooks/useHomestay";
import { renderDescription } from "../../utils/string";
import { getImageUrl } from "../../utils/imageUrl";
import { formatPrice } from "../../utils/price";
import { formatCheckInCheckoOutDate } from "../../utils/date";
const HomestayDetail = () => {
  const { id } = useParams();
  const routerLocation = useRouterLocation();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const getInitialDates = () => {
    const params = new URLSearchParams(routerLocation.search);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return {
      checkIn: params.get("checkIn") || formatCheckInCheckoOutDate(today),
      checkOut: params.get("checkOut") || formatCheckInCheckoOutDate(tomorrow),
    };
  };
  const [selectedDates, setSelectedDates] = useState(getInitialDates);
  const [totalNights, setTotalNights] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const {
    homestayDetail,
    loadingDetail,
    errorDetail,
    fetchHomestayDetail,
    availableRooms,
    loadingRooms,
    errorRooms,
    fetchAvailableRooms,
  } = useHomestayData();
  useEffect(() => {
    // Fetch homestay detail khi id thay đổi
    fetchHomestayDetail(id);
    // Reset selected room khi chuyển homestay
    setSelectedRoom(null);
  }, [id]);

  useEffect(() => {
    const newDates = getInitialDates();
    setSelectedDates(newDates);

    // Calculate number of nights when dates change
    if (newDates.checkIn && newDates.checkOut) {
      const checkInDate = new Date(newDates.checkIn);
      const checkOutDate = new Date(newDates.checkOut);
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalNights(diffDays > 0 ? diffDays : 0);

      // Fetch available rooms if homestay is loaded
      if (homestayDetail) {
        fetchAvailableRooms({
          homestayId: homestayDetail.id,
          checkIn: newDates.checkIn,
          checkOut: newDates.checkOut,
        });
      }
    } else {
      setTotalNights(0);
    }
  }, [routerLocation.search, homestayDetail]);

  useEffect(() => {
    // Calculate nights when manual date selection
    if (selectedDates.checkIn && selectedDates.checkOut) {
      const checkInDate = new Date(selectedDates.checkIn);
      const checkOutDate = new Date(selectedDates.checkOut);
      const diffTime = checkOutDate.getTime() - checkInDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalNights(diffDays > 0 ? diffDays : 0);

      if (homestayDetail) {
        fetchAvailableRooms({
          homestayId: homestayDetail.id,
          checkIn: selectedDates.checkIn,
          checkOut: selectedDates.checkOut,
        });
      }
    } else {
      setTotalNights(0);
    }
  }, [selectedDates.checkIn, selectedDates.checkOut, homestayDetail]);

  // Auto-select first room when rooms are loaded
  useEffect(() => {
    if (availableRooms && availableRooms.length > 0 && !selectedRoom) {
      setSelectedRoom(availableRooms[0]);
    }
  }, [availableRooms, selectedRoom]);

  // Helper để lấy ngày tối đa cho phép nhận phòng (30 ngày từ hôm nay)
  const getMaxCheckInDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 30);
    return today.toISOString().split("T")[0];
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "checkIn") {
      const maxCheckIn = getMaxCheckInDate();
      if (value > maxCheckIn) {
        setSelectedDates({
          ...selectedDates,
          checkIn: maxCheckIn,
        });
        return;
      }
    }
    setSelectedDates({
      ...selectedDates,
      [name]: value,
    });
  };

  // Handle booking form submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();

    // Check if room is selected
    if (!selectedRoom) {
      alert("Vui lòng chọn phòng trước khi đặt");
      return;
    }

    // Check if dates are selected
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      alert("Vui lòng chọn ngày nhận phòng và trả phòng");
      return;
    }

    // Prepare booking data
    const bookingData = {
      homestayId: id,
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      checkIn: selectedDates.checkIn,
      checkOut: selectedDates.checkOut,
      nights: totalNights,
      pricePerNight: selectedRoom.discountPrice || selectedRoom.price,
      totalPrice:
        totalNights * (selectedRoom.discountPrice || selectedRoom.price),
      serviceFee:
        totalNights * (selectedRoom.discountPrice || selectedRoom.price) * 0.1,
      grandTotal:
        totalNights * (selectedRoom.discountPrice || selectedRoom.price) * 1.1,
    };

    alert(
      `Đặt phòng thành công!\nPhòng: ${selectedRoom.name}\nNgày: ${
        selectedDates.checkIn
      } - ${selectedDates.checkOut}\nTổng tiền: ${formatPrice(
        bookingData.grandTotal
      )}đ`
    );
  };

  if (loadingDetail) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (errorDetail) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>{errorDetail}</p>
          <Link
            to="/Homestay/Index"
            className="text-rose-600 font-medium mt-2 inline-block"
          >
            ← Quay lại trang tìm kiếm
          </Link>
        </div>
      </div>
    );
  }

  // Lấy dữ liệu từ homestayDetail
  const homestay = homestayDetail;
  const loading = loadingDetail;
  const error = errorDetail;

  if (!homestay) return null;

  const {
    title,
    description,
    location,
    address,
    price,
    discountPrice,
    rating,
    reviews,
    images,
    amenities,
    host,
    tags,
  } = homestay;

  // Calculate display price based on homestay price or selected room price
  const displayPrice = selectedRoom
    ? selectedRoom.discountPrice || selectedRoom.price
    : discountPrice || price;

  const totalPrice = totalNights * displayPrice;

  // Calculate discount percentage if discount price exists
  const discountPercentage = discountPrice
    ? Math.round(100 - (discountPrice * 100) / price)
    : 0;

  return (
    <div className="homestay-detail pb-12">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Trang chủ", link: "/" },
          { label: "Homestay", link: "/homestay" },
          { label: title },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Title and rating section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            <div className="flex items-center text-sm text-gray-600 flex-wrap gap-2">
              <div className="flex items-center mr-4">
                <svg
                  className="w-4 h-4 text-amber-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">{rating}</span>
                <span className="mx-1">·</span>
                <span>{reviews} đánh giá</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-gray-500 mr-1"
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
                <span>{address}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center">
            <button className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Chia sẻ
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Lưu
            </button>
          </div>
        </div>

        {/* Image gallery */}
        <div className="mb-12">
          <div className="md:max-h-[500px] overflow-hidden rounded-lg">
            {/* Main Image Gallery */}
            <ImageGallery
              images={images}
              title={title}
              mode="slider"
              autoPlay={true}
              className="mb-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {/* Host info section */}
            <div className="border-b pb-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-xl font-bold text-gray-900">
                    {host.isSuperhost && (
                      <span className="bg-rose-100 text-rose-700 text-xs font-semibold mr-2 px-2 py-0.5 rounded">
                        SUPERHOST
                      </span>
                    )}
                    Chủ nhà {host.hostName}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Tham gia từ {host.joined}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <img
                    src={getImageUrl(host.avatar)}
                    alt={host.hostName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                </div>
              </div>
            </div>
            {/* Description section */}
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả</h2>
              <div className="prose max-w-none text-gray-600">
                <p>{renderDescription(description)}</p>
              </div>
            </div>
            {/* Tags section */}
            {tags && tags.length > 0 && (
              <div className="border-b pb-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Đặc điểm
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Rooms section */}
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Danh sách phòng
              </h2>
              {loadingRooms ? (
                <div className="py-8 text-center">
                  <LoadingSpinner />
                </div>
              ) : errorRooms ? (
                <p className="text-red-500">{errorRooms}</p>
              ) : availableRooms && availableRooms.length > 0 ? (
                <RoomsList
                  rooms={availableRooms}
                  selectedRoom={selectedRoom}
                  onSelectRoom={(room) => {
                    setSelectedRoom(room);
                    document
                      .getElementById("booking-form")
                      .scrollIntoView({ behavior: "smooth", block: "nearest" });
                  }}
                />
              ) : (
                <p className="text-gray-500">Không có thông tin phòng</p>
              )}
            </div>
            {/* Policies section */}
            {homestay.policies && (
              <div className="border-b pb-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Chính sách đặt phòng
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Thời gian nhận/trả phòng
                      </h3>
                      <div className="flex flex-col text-gray-700 space-y-1">
                        <div className="flex items-center">
                          <i className="fas fa-sign-in-alt text-rose-500 w-6"></i>
                          <span>
                            Nhận phòng: từ {homestay.policies.checkIn}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-sign-out-alt text-rose-500 w-6"></i>
                          <span>
                            Trả phòng: trước {homestay.policies.checkOut}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        Chính sách hủy phòng
                      </h3>
                      <div className="text-gray-700">
                        <div className="flex items-start">
                          <i className="fas fa-calendar-alt text-rose-500 mt-1 mr-2"></i>
                          <span>{homestay.policies.cancellation}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Location section */}
            <LocationMap address={address} title={title} />
            {/* Reviews section */}
            <div className="border-b pb-6 mb-6">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mr-2">
                  Đánh giá
                </h2>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-amber-500 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">{rating}</span>
                  <span className="mx-1">·</span>
                  <span>{reviews} đánh giá</span>
                </div>
              </div>

              {/* Reviews list with pagination */}
              {/* <ReviewsList reviews={reviewsList} /> */}
            </div>
            {/* Host section */}
            <div className="pb-6">
              <div className="flex items-start">
                <img
                  src={getImageUrl(host.avatar)}
                  alt={host.hostName}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Chủ nhà {host.hostName}
                  </h2>
                  <p className="text-gray-500 text-sm mb-2">
                    Thành viên từ {host.joined}
                  </p>
                  <div className="flex items-center text-sm text-gray-600 mb-3 flex-wrap">
                    <div className="flex items-center mr-4">
                      <svg
                        className="w-4 h-4 text-gray-500 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Tỷ lệ phản hồi: {host.responseRate}%</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-gray-500 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Thời gian phản hồi: {host.responseTime}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    Xin chào! Tôi là {host.hostName}, rất vui được đón tiếp bạn
                    tại homestay của tôi. Tôi luôn cố gắng cung cấp trải nghiệm
                    tốt nhất cho khách hàng và sẵn sàng hỗ trợ bạn 24/7.
                  </p>
                  <button className="mt-4 px-4 py-2 border border-gray-900 rounded-md font-medium hover:bg-gray-50">
                    Liên hệ chủ nhà
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Booking form */}
          <div className="lg:col-span-1">
            <div
              id="booking-form"
              className="sticky top-12 bg-white rounded-xl border shadow-lg p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
                Thông tin đặt phòng
              </h2>
              <div className="flex items-center justify-between mb-6">
                <div>
                  {selectedRoom ? (
                    selectedRoom.discountPrice ? (
                      <>
                        <p className="text-gray-400 text-sm line-through">
                          {formatPrice(selectedRoom.price)}đ{" "}
                          <span className="text-xs">/đêm</span>
                        </p>
                        <div className="flex items-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {formatPrice(selectedRoom.discountPrice)}đ{" "}
                            <span className="text-sm font-normal">/đêm</span>
                          </p>
                          <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">
                            Giảm{" "}
                            {Math.round(
                              100 -
                                (selectedRoom.discountPrice * 100) /
                                  selectedRoom.price
                            )}
                            %
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(selectedRoom.price)}đ{" "}
                        <span className="text-sm font-normal">/đêm</span>
                      </p>
                    )
                  ) : discountPrice ? (
                    <>
                      <div className="mb-1 text-sm text-gray-500">
                        Giá chỉ từ
                      </div>
                      <p className="text-gray-400 text-sm line-through">
                        {formatPrice(price)}đ{" "}
                        <span className="text-xs">/đêm</span>
                      </p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(discountPrice)}đ{" "}
                          <span className="text-sm font-normal">/đêm</span>
                        </p>
                        <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">
                          Giảm {discountPercentage}%
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-1 text-sm text-gray-500">
                        Giá chỉ từ
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(displayPrice)}đ{" "}
                        <span className="text-sm font-normal">/đêm</span>
                      </p>
                    </>
                  )}
                </div>
                <div className="flex items-center">
                  {/* Rating đã được xóa khỏi booking form theo yêu cầu */}
                </div>
              </div>

              <form className="space-y-4">
                {selectedRoom && (
                  <div className="bg-blue-50 p-3 rounded-md text-blue-800 mb-4">
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">
                          Phòng đã chọn: {selectedRoom.name}
                        </p>
                        <p className="text-sm">
                          Tối đa {selectedRoom.maxOccupancy} khách
                        </p>
                        <button
                          type="button"
                          className="text-xs text-blue-700 hover:text-blue-900 underline mt-1"
                          onClick={() => setSelectedRoom(null)}
                        >
                          Đổi phòng khác
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Nhận phòng
                    </label>
                    <input
                      type="date"
                      name="checkIn"
                      value={selectedDates.checkIn}
                      onChange={handleDateChange}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      min={new Date().toISOString().split("T")[0]}
                      max={getMaxCheckInDate()}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Trả phòng
                    </label>
                    <input
                      type="date"
                      name="checkOut"
                      value={selectedDates.checkOut}
                      onChange={handleDateChange}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      min={
                        selectedDates.checkIn ||
                        new Date().toISOString().split("T")[0]
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-rose-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-rose-700 transition-colors"
                  disabled={
                    !selectedDates.checkIn ||
                    !selectedDates.checkOut ||
                    !selectedRoom
                  }
                  onClick={handleBookingSubmit}
                >
                  {!selectedRoom ? "Vui lòng chọn phòng" : "Đặt phòng"}
                </button>
              </form>

              {totalNights > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>
                      {formatPrice(displayPrice)}đ x {totalNights} đêm
                    </span>
                    <span>{formatPrice(displayPrice * totalNights)}đ</span>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between font-bold">
                    <span>Tổng tiền</span>
                    <span>{formatPrice(totalPrice + totalPrice * 0.1)}đ</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomestayDetail;
