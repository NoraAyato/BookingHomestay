import React, { useState } from "react";
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";
import { useAuth } from "../../../hooks/useAuth";
import HostChatButton from "../../chat/HostChatButton";

const BookingList = ({ bookings, onViewDetail, onComplete }) => {
  const { user } = useAuth();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };
  console.log("bookings", bookings);
  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (status) => {
    // Normalize status to lowercase for case-insensitive matching
    const normalizedStatus = status?.toLowerCase();

    const statusConfig = {
      confirmed: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        label: "Đã xác nhận",
        icon: CheckCircle,
      },
      pending: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Chờ xác nhận",
        icon: Clock,
      },
      booked: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Đã đặt",
        icon: CheckCircle,
      },
      completed: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Hoàn thành",
        icon: CheckCircle,
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Đã hủy",
        icon: XCircle,
      },
    };

    const config = statusConfig[normalizedStatus] || {
      bg: "bg-gray-100",
      text: "text-gray-700",
      label: status || "Không xác định",
      icon: Clock,
    };
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    if (!status) return null;

    // Normalize status to lowercase for case-insensitive matching
    const normalizedStatus = status.toLowerCase();

    const statusConfig = {
      success: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Đã thanh toán",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Chờ thanh toán",
      },
      failed: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Thất bại",
      },
      refunded: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        label: "Đã hoàn tiền",
      },
      paid: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Đã thanh toán",
      },
    };

    const config = statusConfig[normalizedStatus] || {
      bg: "bg-gray-100",
      text: "text-gray-700",
      label: status || "Không xác định",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
        >
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={getImageUrl(booking.guestAvatar)}
                  alt={booking.guestName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {booking.guestName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-600">
                      {booking.guestEmail}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusBadge(booking.status)}
                {booking.status?.toLowerCase() !== "cancelled" &&
                  booking.status?.toLowerCase() !== "completed" &&
                  getPaymentBadge(booking.paymentStatus)}
                <button
                  onClick={() => onViewDetail(booking)}
                  className="px-3 py-1.5 bg-white border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Compact Content */}
          <div className="p-4">
            {/* Homestay Name */}
            <div className="mb-3 flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-purple-600 flex-shrink-0" />
              <span className="font-semibold text-gray-900">
                {booking.homestayName}
              </span>
            </div>

            {/* Info Grid - 2 columns */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Dates */}
              <div className="bg-blue-50 p-2.5 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-xs text-blue-700 font-semibold">
                    Lưu trú
                  </span>
                </div>
                <p className="text-xs text-gray-900 font-medium">
                  {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                </p>
                <p className="text-xs text-blue-700 font-bold mt-0.5">
                  {calculateNights(booking.checkIn, booking.checkOut)} đêm
                </p>
              </div>

              {/* Revenue */}
              <div className="bg-amber-50 p-2.5 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-xs text-amber-700 font-semibold">
                    Doanh thu
                  </span>
                </div>
                <p className="text-sm text-green-600 font-bold">
                  {formatCurrency(booking.totalAmount - booking.feeAmount)}
                </p>
                <p className="text-xs text-gray-600">
                  Tổng: {formatCurrency(booking.totalAmount)}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-center gap-4 text-xs text-gray-600 mb-3 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                <span>{booking.guestPhone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{booking.guestEmail}</span>
              </div>
            </div>

            {/* Cancellation Reason */}
            {booking.cancellationReason && (
              <div className="mb-3 p-2 bg-red-50 rounded border-l-2 border-red-400">
                <p className="text-xs text-red-700 font-semibold mb-0.5">
                  Lý do hủy:
                </p>
                <p className="text-xs text-red-900">
                  {booking.cancellationReason}
                </p>
              </div>
            )}

            {/* Action Buttons for Booked & Paid bookings */}
            {booking.status?.toLowerCase() === "booked" &&
              (booking.paymentStatus?.toLowerCase() === "success" ||
                booking.paymentStatus?.toLowerCase() === "paid") && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                  {/* Host Chat Button */}
                  <HostChatButton
                    customerId={booking.guestId}
                    customerName={booking.guestName}
                    customerAvatar={booking.guestAvatar}
                    homestayId={booking.homestayId}
                  />

                  <button
                    onClick={() => onComplete(booking)}
                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Hoàn thành
                  </button>
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
