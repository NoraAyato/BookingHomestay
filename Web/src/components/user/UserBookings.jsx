import { parseDate, formatDateDisplay } from "../../utils/date";
import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import useUser from "../../hooks/useUser";
import { getImageUrl } from "../../utils/imageUrl";
import { formatPrice } from "../../utils/price";

const UserBookings = () => {
  const {
    bookings,
    bookingsTotal,
    bookingsPage,
    bookingsLimit,
    getCurrentUserBooking,
  } = useUser();
  console.log(bookings);
  const [expandedBookings, setExpandedBookings] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(bookingsTotal / bookingsLimit);
  useEffect(() => {
    getCurrentUserBooking(bookingsPage, bookingsLimit);
  }, []);
  const toggleBookingDetails = (bookingId) => {
    setExpandedBookings((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
  };

  const statusMap = {
    Booked: "Đã xác nhận",
    Cancelled: "Đã hủy",
    Pending: "Đang chờ",
    Complete: "Hoàn thành",
  };

  const getStatusStyles = (status) => {
    const viStatus = statusMap[status] || status;
    const statusConfig = {
      "Đã xác nhận":
        "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm",
      "Hoàn thành":
        "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200 shadow-sm",
      "Đang chờ":
        "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200 shadow-sm",
      "Đã hủy":
        "bg-gradient-to-r from-rose-100 to-rose-50 text-rose-700 border border-rose-200 shadow-sm",
    };
    return statusConfig[viStatus] || "bg-gray-100 text-gray-800";
  };

  const scrollToBookingsTitle = () => {
    const el = document.getElementById("bookings-title");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleChangePage = (newPage) => {
    getCurrentUserBooking(newPage, bookingsLimit);
    setCurrentPage(newPage);
    setExpandedBookings({});
    setTimeout(scrollToBookingsTitle, 0);
  };

  return (
    <div>
      <h3
        id="bookings-title"
        className="text-xl font-bold text-gray-900 mb-6 flex items-center"
      >
        <svg
          className="w-5 h-5 mr-2 text-rose-500"
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
        Lịch sử đặt phòng của bạn
      </h3>

      <div className="space-y-4">
        {bookings.map((booking, index) => (
          <div
            key={booking.bookingId}
            className="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden"
          >
            {/* Enhanced Booking header with gradient */}
            <div className="px-4 py-3 bg-gradient-to-r from-rose-100 via-rose-50 to-blue-100 border-b-2 border-rose-200 flex flex-wrap justify-between items-center gap-2 shadow-sm">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-xs text-gray-500">
                    #{booking.bookingId}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{booking.invId}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(
                    booking.status
                  )}`}
                >
                  {statusMap[booking.status]}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-xs font-medium text-gray-600">
                  Tổng tiền:
                </span>
                <span className="text-base font-bold text-rose-600">
                  {formatPrice(booking.totalPrice)}đ
                </span>
              </div>
            </div>

            {/* Compact Content */}
            <div className="p-2">
              {/* Homestay Info */}
              <div className="flex items-start justify-between gap-3 mb-2 pb-2 border-b-2 border-gray-100">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-base mb-1 truncate flex items-center">
                    <svg
                      className="w-4 h-4 mr-1.5 text-rose-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    {booking.homestayName}
                  </h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <svg
                      className="w-3.5 h-3.5 mr-1 flex-shrink-0"
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
                    <span className="truncate">{booking.location}</span>
                  </div>
                </div>
                {booking.rooms.length > 1 && (
                  <button
                    onClick={() => toggleBookingDetails(booking.bookingId)}
                    className="text-rose-600 hover:text-rose-700 text-xs font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-rose-50 transition-colors flex-shrink-0"
                  >
                    <span>
                      {expandedBookings[booking.bookingId]
                        ? "Thu gọn"
                        : `${booking.rooms.length} phòng`}
                    </span>
                    <svg
                      className={`w-3.5 h-3.5 transition-transform ${
                        expandedBookings[booking.bookingId] ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* First room preview - Enhanced */}
              <div className="flex gap-2 mb-2 pb-2 border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-transparent p-1.5 rounded-lg">
                <div className="relative">
                  <img
                    src={getImageUrl(booking.rooms[0].image)}
                    alt={booking.roomType}
                    className="w-20 h-16 object-cover rounded-lg shadow-md flex-shrink-0 border-2 border-white"
                  />
                  <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                    Phòng 1
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-800 text-xs mb-1 truncate">
                        {booking.rooms[0].roomType}
                      </h5>
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-gray-600 mb-1">
                        <span className="flex items-center">
                          <svg
                            className="w-2.5 h-2.5 mr-0.5 text-blue-500 flex-shrink-0"
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
                          <span className="truncate">
                            {formatDateDisplay(booking.checkIn)}
                          </span>
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="flex items-center">
                          <svg
                            className="w-2.5 h-2.5 mr-0.5 text-rose-500 flex-shrink-0"
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
                          <span className="truncate">
                            {formatDateDisplay(booking.checkOut)}
                          </span>
                        </span>
                        <span className="flex items-center text-purple-600">
                          <svg
                            className="w-2.5 h-2.5 mr-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            />
                          </svg>
                          {(() => {
                            const checkIn = parseDate(booking.checkIn);
                            const checkOut = parseDate(booking.checkOut);
                            if (!checkIn || !checkOut) return "- đêm";
                            const nights = Math.max(
                              1,
                              Math.round(
                                (checkOut - checkIn) / (1000 * 60 * 60 * 24)
                              )
                            );
                            return `${nights} đêm`;
                          })()}
                        </span>
                      </div>
                      <div className="mt-1">
                        <div className="text-[9px] font-medium text-gray-600 mb-0.5">
                          Dịch vụ đã đăng ký:
                        </div>
                        {booking.rooms[0].services &&
                        booking.rooms[0].services.length > 0 ? (
                          <div className="flex flex-wrap gap-0.5">
                            {booking.rooms[0].services.map((service, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-[9px] leading-tight border border-blue-200 shadow-sm font-medium"
                              >
                                <svg
                                  className="w-2 h-2 mr-0.5 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="truncate">{service.name}</span>
                                {service.price && (
                                  <span className="ml-1 font-bold text-blue-800">
                                    {formatPrice(service.price)}đ
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[9px] text-gray-400 italic">
                            Không có dịch vụ nào
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 bg-gradient-to-br from-rose-50 to-rose-100 px-2 py-1.5 rounded-lg border border-rose-200 shadow-sm">
                      <div className="text-[9px] font-medium text-rose-700 mb-0.5">
                        Giá phòng
                      </div>
                      <span className="font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-500 whitespace-nowrap">
                        {formatPrice(booking.rooms[0].price)}đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded view with additional rooms - Enhanced */}
              {expandedBookings[booking.bookingId] &&
                booking.rooms.length > 1 && (
                  <div className="space-y-2 bg-gradient-to-b from-blue-50/30 to-transparent p-1.5 rounded-lg">
                    {booking.rooms.slice(1).map((room, roomIdx) => (
                      <div
                        key={roomIdx}
                        className="flex gap-2 pb-2 border-b-2 border-gray-100 last:border-0 bg-white p-1.5 rounded-lg shadow-sm"
                      >
                        <div className="relative">
                          <img
                            src={getImageUrl(room.image)}
                            alt={room.roomType}
                            className="w-20 h-16 object-cover rounded-lg shadow-md flex-shrink-0 border-2 border-white"
                          />
                          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                            Phòng {roomIdx + 2}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-gray-800 text-xs mb-1 truncate">
                                {room.roomType}
                              </h5>
                              <div className="mt-1">
                                <div className="text-[9px] font-medium text-gray-600 mb-0.5">
                                  Dịch vụ đã đăng ký:
                                </div>
                                {room.services && room.services.length > 0 ? (
                                  <div className="flex flex-wrap gap-0.5">
                                    {room.services.map((service, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-[9px] leading-tight border border-blue-200 shadow-sm font-medium"
                                      >
                                        <svg
                                          className="w-2 h-2 mr-0.5 flex-shrink-0"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        <span className="truncate">
                                          {service.name}
                                        </span>
                                        {service.price && (
                                          <span className="ml-1 font-bold text-blue-800">
                                            {formatPrice(service.price)}đ
                                          </span>
                                        )}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[9px] text-gray-400 italic">
                                    Không có dịch vụ nào
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0 bg-gradient-to-br from-rose-50 to-rose-100 px-2 py-1.5 rounded-lg border border-rose-200 shadow-sm">
                              <div className="text-[9px] font-medium text-rose-700 mb-0.5">
                                Giá phòng
                              </div>
                              <span className="font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-500 whitespace-nowrap">
                                {formatPrice(room.price)}đ
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              <div className="mt-2 pt-2 border-t-2 border-gray-100 bg-gradient-to-r from-transparent to-gray-50/50 p-1.5 rounded-lg">
                {/* Hiển thị tiền cọc cho Pending và tiền còn lại cho Booked */}
                {booking.status === "Pending" &&
                  booking.haveToPayPrice !== undefined &&
                  booking.haveToPayPrice > 0 && (
                    <div className="mb-2 flex items-center justify-between bg-gradient-to-r from-red-50 to-rose-50 px-3 py-2 rounded-lg border-2 border-red-300 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <span className="text-xs font-semibold text-red-800">
                          Chưa thanh toán tiền cọc:
                        </span>
                      </div>
                      <span className="text-base font-extrabold text-red-600">
                        {formatPrice(booking.haveToPayPrice)}đ
                      </span>
                    </div>
                  )}

                {booking.status === "Booked" &&
                  booking.haveToPayPrice !== undefined &&
                  booking.haveToPayPrice > 0 && (
                    <div className="mb-2 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-2 rounded-lg border-2 border-amber-300 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5 text-amber-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-xs font-semibold text-amber-800">
                          Còn phải thanh toán tại homestay:
                        </span>
                      </div>
                      <span className="text-base font-extrabold text-orange-600">
                        {formatPrice(booking.haveToPayPrice)}đ
                      </span>
                    </div>
                  )}

                <div className="flex flex-wrap gap-1.5 justify-end">
                  {booking.status === "Booked" && (
                    <button className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 text-[10px] font-bold shadow-md">
                      Hủy đặt phòng
                    </button>
                  )}
                  {booking.status === "Complete" && (
                    <>
                      <button className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 text-[10px] font-bold shadow-md">
                        ⭐ Đánh giá
                      </button>
                      <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-[10px] font-bold shadow-md">
                        🔄 Đặt lại
                      </button>
                    </>
                  )}
                  {booking.status === "Pending" && (
                    <>
                      <button className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 text-[10px] font-bold shadow-md">
                        💳 Thanh toán ngay
                      </button>
                      <button className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 text-[10px] font-bold shadow-md">
                        Hủy đặt phòng
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="bg-gradient-to-br from-gray-50 via-white to-rose-50 rounded-2xl p-10 text-center border-2 border-gray-100 shadow-lg">
            <div className="bg-gradient-to-br from-rose-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg
                className="w-10 h-10 text-rose-600"
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
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">
              Chưa có lịch sử đặt phòng
            </h4>
            <p className="text-gray-500 mb-4 text-sm max-w-md mx-auto">
              Bạn chưa có đơn đặt phòng nào. Hãy khám phá và đặt homestay yêu
              thích của bạn ngay!
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 inline-flex items-center text-sm font-bold shadow-lg">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Khám phá homestay
            </button>
          </div>
        )}
      </div>

      <Pagination
        currentPage={bookingsPage}
        totalPages={totalPages}
        onChangePage={handleChangePage}
        prevLabel="Trước"
        nextLabel="Sau"
      />
    </div>
  );
};

export default UserBookings;
