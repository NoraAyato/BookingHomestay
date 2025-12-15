import React from "react";
import {
  X,
  MapPin,
  Star,
  Bed,
  Bath,
  Users,
  Calendar,
  TrendingUp,
  DoorOpen,
  Wifi,
  Coffee,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";
const ViewHomestayModal = ({ homestay, isOpen, onClose }) => {
  if (!isOpen || !homestay) return null;

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
        label: "Tạm dừng",
        icon: XCircle,
      },
      pending: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Chờ duyệt",
        icon: AlertCircle,
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

  const getRoomStatusBadge = (status) => {
    if (status === "available") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">
          <CheckCircle className="h-3 w-3" />
          Còn trống
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">
        <XCircle className="h-3 w-3" />
        Đã đặt
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between shadow-md z-10">
          <div>
            <h2 className="text-2xl font-bold">Chi tiết Homestay</h2>
            <p className="text-blue-100 text-sm mt-0.5">
              Thông tin đầy đủ về homestay của bạn
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-4">
            {/* Image */}
            <div className="relative rounded-lg overflow-hidden shadow-md mx-auto max-w-2xl">
              <img
                src={getImageUrl(homestay.image)}
                alt={homestay.name}
                className="w-full h-80 object-cover"
              />
            </div>

            {/* Basic Info */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {homestay.name}
                  </h3>
                  <div className="flex items-center gap-3 text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-xs">
                        {homestay.locationName || homestay.location}
                      </span>
                    </div>
                    {homestay.rating !== undefined && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-current" />
                        <span className="text-xs font-semibold">
                          {homestay.rating}
                        </span>
                        <span className="text-xs">
                          ({homestay.reviews} đánh giá)
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-700 mb-2">
                    <strong>Địa chỉ:</strong> {homestay.address}
                  </p>
                  <p className="text-xs text-gray-700">
                    {homestay.description}
                  </p>
                </div>
                <div>{getStatusBadge(homestay.status)}</div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                {homestay.totalRooms !== undefined && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <DoorOpen className="h-5 w-5" />
                      <span className="text-xs font-medium">Tổng phòng</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {homestay.totalRooms}
                    </p>
                  </div>
                )}

                {homestay.availableRooms !== undefined && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-green-600 mb-1">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-xs font-medium">Phòng trống</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {homestay.availableRooms}
                    </p>
                  </div>
                )}

                {homestay.totalBookings !== undefined && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                      <Calendar className="h-5 w-5" />
                      <span className="text-xs font-medium">Đặt phòng</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {homestay.totalBookings}
                    </p>
                  </div>
                )}

                {homestay.revenue !== undefined && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-xs font-medium">Doanh thu</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(homestay.revenue)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {homestay.amenities && homestay.amenities.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-blue-600" />
                  Tiện nghi ({homestay.amenities.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {homestay.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100"
                    >
                      {amenity.name || amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Services List */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Coffee className="h-4 w-4 text-blue-600" />
                Dịch vụ ({homestay.services?.length || 0})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {homestay.services?.map((service) => (
                  <div
                    key={service.id}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md p-3 border border-blue-100"
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <h5 className="text-sm font-bold text-gray-900 flex-1">
                        {service.name}
                      </h5>
                      <p className="text-sm font-bold text-blue-600 ml-2">
                        {service.price === 0
                          ? "Miễn phí"
                          : formatCurrency(service.price)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mb-1.5">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 bg-white text-blue-700 rounded-full font-medium text-[10px]">
                        {service.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {(!homestay.services || homestay.services.length === 0) && (
                <p className="text-xs text-gray-500 text-center py-3">
                  Chưa có dịch vụ nào
                </p>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {homestay.createdAt && (
                  <div>
                    <p className="text-gray-600">
                      <strong>Ngày tạo:</strong>{" "}
                      {formatDate(homestay.createdAt)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">
                    <strong>Mã homestay:</strong> {homestay.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewHomestayModal;
