import { parseDate, formatDateDisplay } from "../../utils/date";
import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import { motion } from "framer-motion";
import useUser from "../../hooks/useUser";
import { getImageUrl } from "../../utils/imageUrl";

const UserBookings = () => {
  const {
    bookings,
    bookingsTotal,
    bookingsPage,
    bookingsLimit,
    getCurrentUserBooking,
  } = useUser();

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
      "Đã xác nhận": "bg-emerald-100 text-emerald-800",
      "Hoàn thành": "bg-blue-100 text-blue-800",
      "Đang chờ": "bg-amber-100 text-amber-800",
      "Đã hủy": "bg-rose-100 text-rose-800",
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

      <div className="space-y-6">
        {bookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            {/* Booking header */}
            <div className="p-5 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500 mr-2">
                    MÃ ĐẶT PHÒNG:
                  </span>
                  <span className="font-semibold text-gray-800">
                    {booking.id}
                  </span>
                </div>
                <div className="flex items-center mt-1.5">
                  <span className="text-xs font-medium text-gray-500 mr-2">
                    NGÀY ĐẶT:
                  </span>
                  <span className="text-gray-700">
                    {formatDateDisplay(booking.bookingDate)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                    booking.status
                  )}`}
                >
                  {statusMap[booking.status]}
                </span>
                <div className="text-right">
                  <div className="text-xs font-medium text-gray-500">
                    TỔNG THANH TOÁN
                  </div>
                  <div className="font-bold text-rose-600">
                    {booking.totalPrice.toLocaleString("vi-VN")}đ
                  </div>
                </div>
              </div>
            </div>

            {/* Booking content (rooms) */}
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-800">
                  {booking.rooms[0].homestay}
                  {booking.rooms.length > 1 &&
                    ` (${booking.rooms.length} phòng)`}
                </h4>
                {booking.rooms.length > 1 && (
                  <button
                    onClick={() => toggleBookingDetails(booking.id)}
                    className="text-rose-600 hover:text-rose-700 text-sm font-medium flex items-center"
                  >
                    {expandedBookings[booking.id] ? (
                      <>
                        <span>Thu gọn</span>
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>Xem chi tiết</span>
                        <svg
                          className="w-4 h-4 ml-1"
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
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* First room preview (always visible) */}
              <div className="flex flex-col md:flex-row gap-4 mb-4 pb-4 border-b border-gray-100">
                <img
                  src={getImageUrl(booking.rooms[0].image)}
                  alt={booking.rooms[0].homestay}
                  className="w-full md:w-32 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-gray-800">
                        {booking.rooms[0].roomType}
                      </h5>
                      <p className="text-sm text-gray-600 mb-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {booking.rooms[0].location}
                      </p>
                    </div>
                    <div className="text-right hidden md:block">
                      <span className="font-bold text-rose-600">
                        {booking.rooms[0].price.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      Check-in: {formatDateDisplay(booking.rooms[0].checkIn)}
                    </span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      Check-out: {formatDateDisplay(booking.rooms[0].checkOut)}
                    </span>
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      {(() => {
                        const checkIn = parseDate(booking.rooms[0].checkIn);
                        const checkOut = parseDate(booking.rooms[0].checkOut);
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
                    {booking.rooms[0].services &&
                      booking.rooms[0].services.length > 0 && (
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2v2h2V7H6zm4 0v2h2V7h-2z" />
                          </svg>
                          Dịch vụ:{" "}
                          {booking.rooms[0].services
                            .map(
                              (s) =>
                                `${s.name}${
                                  s.price
                                    ? ` (${s.price.toLocaleString(
                                        "vi-VN"
                                      )}đ/ngày)`
                                    : ""
                                }`
                            )
                            .join(", ")}
                        </span>
                      )}
                  </div>
                </div>
                <div className="block md:hidden text-right">
                  <span className="font-bold text-rose-600">
                    {booking.rooms[0].price}đ
                  </span>
                </div>
              </div>

              {/* Expanded view with additional rooms */}
              {expandedBookings[booking.id] && booking.rooms.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {booking.rooms.slice(1).map((room) => (
                    <div
                      key={room.id}
                      className="flex flex-col md:flex-row gap-4 pb-4 border-b border-gray-100"
                    >
                      <img
                        src={room.image}
                        alt={room.homestay}
                        className="w-full md:w-32 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium text-gray-800">
                              {room.roomType}
                            </h5>
                            <p className="text-sm text-gray-600 mb-1 flex items-center">
                              <svg
                                className="w-4 h-4 mr-1 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {room.location}
                            </p>
                          </div>
                          <div className="text-right hidden md:block">
                            <span className="font-bold text-rose-600">
                              {room.price}đ
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                            Check-in: {room.checkIn}
                          </span>
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                            Check-out: {room.checkOut}
                          </span>
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-gray-400"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            {(() => {
                              const checkIn = parseDate(room.checkIn);
                              const checkOut = parseDate(room.checkOut);
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
                          {room.services && room.services.length > 0 && (
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-1 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5zm2 2v2h2V7H6zm4 0v2h2V7h-2z" />
                              </svg>
                              Dịch vụ:{" "}
                              {room.services
                                .map(
                                  (s) =>
                                    `${s.name}${
                                      s.price
                                        ? ` (${s.price.toLocaleString(
                                            "vi-VN"
                                          )}/ngày)`
                                        : ""
                                    }`
                                )
                                .join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="block md:hidden text-right">
                        <span className="font-bold text-rose-600">
                          {room.price}đ
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Booking actions */}
              <div className="mt-4 flex flex-wrap gap-3 justify-end">
                {booking.status === "Đã xác nhận" && (
                  <>
                    <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                      Hủy đặt phòng
                    </button>
                  </>
                )}
                {booking.status === "Hoàn thành" && (
                  <>
                    <button className="px-4 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium">
                      Đánh giá
                    </button>
                    <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                      Đặt lại
                    </button>
                  </>
                )}
                {booking.status === "Đang chờ" && (
                  <>
                    <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                      Thanh toán
                    </button>
                    <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
                      Hủy đặt phòng
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {bookings.length === 0 && (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
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
            <p className="text-gray-500 mb-4">Bạn chưa có đơn đặt phòng nào.</p>
            <button className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors inline-flex items-center">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Tìm homestay
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
