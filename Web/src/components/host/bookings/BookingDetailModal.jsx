import React from "react";
import {
  X,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  CreditCard,
  Clock,
  MessageCircle,
  Users,
} from "lucide-react";
import RoomServiceAccordion from "./RoomServiceAccordion";
import { getImageUrl } from "../../../utils/imageUrl";

const BookingDetailModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;
  console.log("BookingDetailModal rendered with booking:", booking);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusConfig = (status) => {
    const configs = {
      Confirmed: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        label: "Đã xác nhận",
      },
      Pending: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Chờ xác nhận",
      },
      Booked: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Đã đặt",
      },
      Completed: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Hoàn thành",
      },
      Cancelled: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Đã hủy",
      },
      confirmed: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        label: "Đã xác nhận",
      },
      pending: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Chờ xác nhận",
      },
      completed: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Hoàn thành",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Đã hủy",
      },
    };
    return configs[status] || configs.Pending;
  };

  const getPaymentConfig = (status) => {
    if (!status) return null;
    const configs = {
      Success: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Đã thanh toán",
      },
      Pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Chờ thanh toán",
      },
      Failed: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Thất bại",
      },
      Refunded: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        label: "Đã hoàn tiền",
      },
      paid: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Đã thanh toán",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Chờ thanh toán",
      },
      refunded: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        label: "Đã hoàn tiền",
      },
    };
    return configs[status] || configs.Pending;
  };

  const statusConfig = getStatusConfig(booking.status);
  const paymentConfig = getPaymentConfig(booking.paymentStatus);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Chi tiết đặt phòng
                </h3>
                <p className="text-blue-100 text-xs mt-0.5">
                  {booking.guestName} - {formatDate(booking.checkIn)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Guest Information */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-3 mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Thông tin khách hàng
              </h4>
              <div className="flex items-start gap-3">
                <img
                  src={getImageUrl(booking.guestAvatar)}
                  alt={booking.guestName}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                />
                <div className="flex-1 space-y-1.5">
                  <p className="text-base font-bold text-gray-900">
                    {booking.guestName}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-gray-400" />
                      <span>{booking.guestPhone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      <span>{booking.guestEmail}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Information - U Shape Layout */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 mb-4">
              {/* Hàng trên: Homestay | Ngày đặt */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Homestay - Trái */}
                <div className="flex items-start gap-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Homestay</p>
                    <p className="text-sm font-bold text-gray-900">
                      {booking.homestayName}
                    </p>
                  </div>
                </div>

                {/* Ngày đặt - Phải */}
                <div className="flex items-start gap-2 justify-end">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ngày đặt</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(booking.bookingDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hàng dưới: Lưu trú - Dàn ngang rộng */}
              <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Lưu trú</p>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(booking.checkIn)}
                      </p>
                      <span className="text-gray-400">→</span>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(booking.checkOut)}
                      </p>
                    </div>
                    <p className="text-xs text-blue-600 font-semibold mt-1">
                      {calculateNights(booking.checkIn, booking.checkOut)} đêm
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Reason */}
            {booking.cancellationReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <X className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-red-900 mb-0.5">
                      Lý do hủy
                    </p>
                    <p className="text-xs text-red-700">
                      {booking.cancellationReason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Rooms & Services */}
            {booking.bookedRooms && booking.bookedRooms.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Thông tin phòng và dịch vụ
                </h4>
                {booking.bookedRooms.map((room, index) => (
                  <div
                    key={index}
                    className="mb-3 bg-white rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {room.roomName}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatCurrency(room.pricePerNight)}/đêm
                        </p>
                      </div>
                    </div>
                    {room.services && room.services.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-1">
                          Dịch vụ:
                        </p>
                        {room.services.map((service, sIndex) => (
                          <div
                            key={sIndex}
                            className="flex justify-between text-xs text-gray-600 mb-1"
                          >
                            <span>
                              {service.serviceName} x{service.quantity}
                            </span>
                            <span>
                              {formatCurrency(
                                service.pricePerUnit * service.quantity
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : booking.rooms && booking.rooms.length > 0 ? (
              <RoomServiceAccordion
                rooms={booking.rooms}
                commonServices={booking.commonServices}
                pricing={booking.pricing}
              />
            ) : null}

            {/* Pricing Summary */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-green-600" />
                Chi tiết thanh toán
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(booking.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Phí nền tảng (15% tiền phòng):
                  </span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(booking.feeAmount)}
                  </span>
                </div>
                <div className="border-t border-green-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">
                      Doanh thu của bạn:
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatCurrency(booking.totalAmount - booking.feeAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Đóng
              </button>
              {booking.status === "confirmed" && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Nhắn tin khách
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
