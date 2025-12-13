import React from "react";
import {
  Edit,
  Eye,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  DoorOpen,
  Trash2,
  Utensils,
  Home as HomeIcon,
} from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";

const HomestaysList = ({
  homestays,
  loading,
  onView,
  onEdit,
  onDelete,
  onViewRooms,
  onViewServices,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase();

    const statusConfig = {
      active: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Đang hoạt động",
        icon: CheckCircle,
      },
      inactive: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "Ngừng hoạt động",
        icon: XCircle,
      },
    };

    const config = statusConfig[normalizedStatus] || statusConfig.inactive;
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
          >
            <div className="h-40 bg-gray-200" />
            <div className="p-3 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-16 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (homestays.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <HomeIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy homestay
          </h3>
          <p className="text-gray-600 mb-6">
            Thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {homestays.map((homestay) => (
        <div
          key={homestay.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group"
        >
          {/* Image */}
          <div className="relative h-40 overflow-hidden">
            <img
              src={getImageUrl(homestay.image)}
              alt={homestay.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2">
              {getStatusBadge(homestay.status)}
            </div>
            <div className="absolute top-2 left-2">
              <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs font-semibold text-gray-900">
                  {homestay.rating || 0}
                </span>
                <span className="text-xs text-gray-600">
                  ({homestay.reviews || 0})
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-3">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                {homestay.name}
              </h3>
              <div className="flex items-center text-xs text-gray-600">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="line-clamp-1">
                  {homestay.locationName || homestay.location}
                </span>
              </div>
            </div>

            {/* Room Info */}
            <div className="mb-3">
              <div className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded border border-purple-100">
                <div className="flex items-center gap-1.5">
                  <DoorOpen className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-purple-600 font-semibold">
                      Tổng phòng
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      {homestay.totalRooms || 0}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <p className="text-xs text-gray-600">Phòng trống</p>
                  </div>
                  <p className="text-base font-bold text-green-600">
                    {homestay.availableRooms || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Đặt phòng</p>
                <p className="text-sm font-semibold text-gray-900">
                  {homestay.totalBookings || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Doanh thu</p>
                <p className="text-xs font-semibold text-green-600">
                  {formatCurrency(homestay.revenue || 0)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onViewRooms && onViewRooms(homestay)}
                  className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center justify-center gap-1 text-xs shadow-sm"
                >
                  <DoorOpen className="h-3.5 w-3.5" />
                  Phòng
                </button>
                <button
                  onClick={() => onViewServices && onViewServices(homestay)}
                  className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded hover:from-green-700 hover:to-green-800 transition-all font-semibold flex items-center justify-center gap-1 text-xs shadow-sm"
                >
                  <Utensils className="h-3.5 w-3.5" />
                  Dịch vụ
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => onView(homestay)}
                  className="px-2 py-1.5 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors flex items-center justify-center gap-1 text-xs font-medium"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Xem
                </button>
                <button
                  onClick={() => onEdit(homestay)}
                  className="px-2 py-1.5 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors flex items-center justify-center gap-1 text-xs font-medium"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Sửa
                </button>
                <button
                  onClick={() => onDelete(homestay)}
                  className="px-2 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-xs font-medium"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomestaysList;
