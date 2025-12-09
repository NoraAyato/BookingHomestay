import React from "react";
import {
  X,
  MapPin,
  User,
  Star,
  MessageSquare,
  DoorOpen,
  DollarSign,
  Calendar,
  TrendingUp,
} from "lucide-react";

const HomestayDetailModal = ({ homestay, isOpen, onClose }) => {
  if (!isOpen || !homestay) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Hoạt động",
      },
      inactive: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Không hoạt động",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Chờ duyệt",
      },
    };

    const config = statusConfig[status] || statusConfig.inactive;

    return (
      <span
        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <DoorOpen className="w-5 h-5 mr-2 text-gray-700" />
                Chi tiết Homestay
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 font-mono">
                {homestay.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Image */}
            <div className="mb-5">
              <div className="relative rounded-lg overflow-hidden h-48 bg-gray-100">
                <img
                  src={homestay.image}
                  alt={homestay.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/800/400";
                  }}
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              {/* Name & Status */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    {homestay.name}
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {homestay.location}
                  </div>
                </div>
                {getStatusBadge(homestay.status)}
              </div>

              {/* Host */}
              {homestay.host && homestay.host.trim() !== "" && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-sm">
                    <User className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600 mr-2">Chủ nhà:</span>
                    <span className="font-medium text-gray-900">
                      {homestay.host}
                    </span>
                  </div>
                </div>
              )}

              {/* Description */}
              {homestay.description && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {homestay.description}
                  </p>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center mb-1">
                    <Star className="w-4 h-4 text-amber-500 mr-1.5 fill-current" />
                    <span className="text-xs font-medium text-gray-600">
                      Đánh giá
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {homestay.rating > 0 ? homestay.rating.toFixed(1) : "--"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center mb-1">
                    <MessageSquare className="w-4 h-4 text-gray-600 mr-1.5" />
                    <span className="text-xs font-medium text-gray-600">
                      Reviews
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {homestay.reviews}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center mb-1">
                    <DoorOpen className="w-4 h-4 text-gray-600 mr-1.5" />
                    <span className="text-xs font-medium text-gray-600">
                      Số phòng
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {homestay.rooms}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center mb-1">
                    <DollarSign className="w-4 h-4 text-gray-600 mr-1.5" />
                    <span className="text-xs font-medium text-gray-600">
                      Giá/đêm
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(homestay.pricePerNight)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center mb-1">
                    <Calendar className="w-4 h-4 text-gray-600 mr-1.5" />
                    <span className="text-xs font-medium text-gray-600">
                      Đặt chỗ
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {homestay.totalBookings}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center mb-1">
                    <TrendingUp className="w-4 h-4 text-gray-600 mr-1.5" />
                    <span className="text-xs font-medium text-gray-600">
                      Doanh thu
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(homestay.revenue)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end bg-white">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomestayDetailModal;
