import React from "react";
import {
  X,
  Calendar,
  Gift,
  Percent,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  Moon,
  CalendarClock,
  UserCheck,
  Image as ImageIcon,
} from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";

const PromotionDetailModal = ({
  promotion,
  isOpen,
  onClose,
  formatCurrency,
  formatValue,
}) => {
  if (!isOpen || !promotion) return null;

  // Check if promotion is expired
  const isExpired = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const promoEndDate = new Date(promotion.endDate);
    promoEndDate.setHours(0, 0, 0, 0);
    return promoEndDate < currentDate;
  };

  const getStatusInfo = () => {
    if (isExpired()) {
      return {
        label: "Hết hạn",
        color: "text-red-600",
        bgColor: "bg-red-50",
        icon: XCircle,
      };
    }
    if (promotion.status === "active") {
      return {
        label: "Đang hoạt động",
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: CheckCircle,
      };
    }
    return {
      label: "Tạm dừng",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      icon: XCircle,
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const getUsagePercentage = () => {
    if (!promotion.usageLimit || promotion.usageLimit === 0) return 0;
    return Math.round((promotion.usageCount / promotion.usageLimit) * 100);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          aria-hidden="true"
        ></div>

        {/* Center modal */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient or image */}
          <div className="relative">
            {promotion.image ? (
              <div className="h-48 w-full relative">
                <img
                  src={getImageUrl(promotion.image)}
                  alt={promotion.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=No+Image";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            ) : (
              <div className="h-48 w-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Gift className="h-20 w-20 text-white opacity-50" />
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors shadow-lg"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            {/* Status badge overlay */}
            <div className="absolute bottom-4 left-4">
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${statusInfo.bgColor} backdrop-blur-sm`}
              >
                <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                <span className={`text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            {/* Title and Type */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {promotion.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    promotion.type === "Percentage"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {promotion.type === "Percentage" ? (
                    <span className="flex items-center">
                      <Percent className="h-3 w-3 mr-1" />
                      Phần trăm
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Gift className="h-3 w-3 mr-1" />
                      Cố định
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Promotion Code */}
            <div className="mb-4">
              <span className="text-sm text-gray-500">Mã khuyến mãi:</span>
              <div className="font-mono font-semibold text-lg text-gray-900 bg-gray-100 px-3 py-2 rounded mt-1 inline-block">
                {promotion.code}
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <Gift className="h-4 w-4 mr-2" />
                  Giá trị khuyến mãi
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatValue(promotion.type, promotion.value)}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Giá trị tối thiểu
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatCurrency(promotion.minBookingAmount)}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  Số ngày đặt trước
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {promotion.bookedTimes || 0} ngày
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <Moon className="h-4 w-4 mr-2" />
                  Số đêm tối thiểu
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {promotion.minNights || 0} đêm
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <Users className="h-4 w-4 mr-2" />
                  Giới hạn sử dụng
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {promotion.usageLimit} lần
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Khách hàng mới
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {promotion.forNewCustomer ? "Có" : "Không"}
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="bg-blue-50 rounded-lg p-4 mb-5">
              <div className="flex items-center text-blue-700 text-sm font-medium mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                Thời gian áp dụng
              </div>
              <div className="flex items-center justify-between text-gray-700">
                <div>
                  <div className="text-xs text-gray-500">Bắt đầu</div>
                  <div className="font-semibold">{promotion.startDate}</div>
                </div>
                <div className="text-gray-400">→</div>
                <div>
                  <div className="text-xs text-gray-500">Kết thúc</div>
                  <div className="font-semibold">{promotion.endDate}</div>
                </div>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  Lượt sử dụng
                </div>
                <span className="font-medium text-gray-900">
                  {promotion.usageCount} / {promotion.usageLimit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getUsagePercentage()}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1 text-right">
                {getUsagePercentage()}% đã sử dụng
              </div>
            </div>

            {/* Applicable Homestays */}
            {promotion.applicableHomestays &&
              promotion.applicableHomestays.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <span className="text-sm text-gray-600 font-medium">
                    Áp dụng cho homestay:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {promotion.applicableHomestays.map((homestayId, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {homestayId}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailModal;
