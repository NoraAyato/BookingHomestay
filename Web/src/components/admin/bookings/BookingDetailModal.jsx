import React from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Home,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  MapPin,
} from "lucide-react";

const BookingDetailModal = ({
  booking,
  isOpen,
  onClose,
  formatDate,
  formatCurrency,
}) => {
  if (!isOpen || !booking) return null;

  const getStatusColor = (status) => {
    const colors = {
      Booked: "text-emerald-600 bg-emerald-50",
      Pending: "text-amber-600 bg-amber-50",
      Completed: "text-blue-600 bg-blue-50",
      Cancelled: "text-red-600 bg-red-50",
    };
    return colors[status] || "text-gray-600 bg-gray-50";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      Paid: "text-green-600 bg-green-50",
      Pending: "text-yellow-600 bg-yellow-50",
      Failed: "text-red-600 bg-red-50",
      Refunded: "text-purple-600 bg-purple-50",
      Cancelled: "text-gray-600 bg-gray-50",
    };
    return colors[status] || "text-gray-600 bg-gray-50";
  };

  const getStatusLabel = (status) => {
    const labels = {
      Booked: "Đã xác nhận",
      Pending: "Chờ xử lý",
      Completed: "Đã hoàn thành",
      Cancelled: "Đã hủy",
    };
    return labels[status] || status;
  };

  const getPaymentStatusLabel = (status) => {
    if (!status) return "Chưa có";
    const labels = {
      Paid: "Đã cọc",
      Pending: "Chờ thanh toán",
      Failed: "Thất bại",
      Refunded: "Đã hoàn tiền",
      Cancelled: "Đã hủy",
    };
    return labels[status] || status;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Chi tiết đặt chỗ
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">Mã: {booking.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Status Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div
              className={`px-4 py-3 rounded-lg ${getStatusColor(
                booking.status
              )}`}
            >
              <p className="text-xs font-medium opacity-75 mb-1">
                Trạng thái đặt chỗ
              </p>
              <p className="font-semibold">{getStatusLabel(booking.status)}</p>
            </div>
            <div
              className={`px-4 py-3 rounded-lg ${getPaymentStatusColor(
                booking.paymentStatus
              )}`}
            >
              <p className="text-xs font-medium opacity-75 mb-1">
                Trạng thái thanh toán
              </p>
              <p className="font-semibold">
                {getPaymentStatusLabel(booking.paymentStatus)}
              </p>
            </div>
          </div>

          {/* Guest Information */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Thông tin khách hàng
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2.5">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-600 w-24">Họ tên:</span>
                <span className="font-medium text-gray-900">
                  {booking.guestName}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-600 w-24">Email:</span>
                <span className="text-gray-900">{booking.guestEmail}</span>
              </div>
              {booking.guestPhone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600 w-24">Điện thoại:</span>
                  <span className="text-gray-900">{booking.guestPhone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Homestay Information */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Thông tin homestay
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2.5">
              <div className="flex items-center text-sm">
                <Home className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-600 w-24">Homestay:</span>
                <span className="font-medium text-gray-900">
                  {booking.homestay}
                </span>
              </div>
              {booking.hostName && (
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600 w-24">Chủ nhà:</span>
                  <span className="text-gray-900">{booking.hostName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Booking Information */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Thông tin đặt chỗ
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2.5">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-600 w-24">Nhận phòng:</span>
                <span className="text-gray-900">
                  {formatDate(booking.checkIn)}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-600 w-24">Trả phòng:</span>
                <span className="text-gray-900">
                  {formatDate(booking.checkOut)}
                </span>
              </div>
              {booking.nights > 0 && (
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600 w-24">Số đêm:</span>
                  <span className="font-medium text-gray-900">
                    {booking.nights} đêm
                  </span>
                </div>
              )}
              <div className="flex items-center text-sm">
                <FileText className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-600 w-24">Ngày đặt:</span>
                <span className="text-gray-900">
                  {formatDate(booking.bookingDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Thông tin thanh toán
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Tổng tiền:</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>
              {booking.paidAmount !== null &&
                booking.paidAmount !== undefined && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-600">Đã cọc:</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(booking.paidAmount)}
                    </span>
                  </div>
                )}
              {booking.paymentMethod && (
                <div className="flex items-center text-sm">
                  <CreditCard className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600 w-32">Phương thức:</span>
                  <span className="text-gray-900">{booking.paymentMethod}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
