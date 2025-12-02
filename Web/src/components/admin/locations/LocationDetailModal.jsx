import React from "react";
import {
  X,
  MapPin,
  Home,
  Calendar,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";

const LocationDetailModal = ({ location, isOpen, onClose }) => {
  if (!isOpen || !location) return null;

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
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Chi tiết khu vực
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            {/* Image */}
            <div className="mb-6">
              <div className="relative rounded-lg overflow-hidden h-64 bg-gray-100">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/800/400";
                  }}
                />
              </div>
            </div>

            {/* Info Grid */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Tên khu vực
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {location.name}
                </p>
              </div>

              {/* ID */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Mã khu vực
                </label>
                <p className="text-gray-900 font-mono">{location.id}</p>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Trạng thái
                </label>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    location.status === "active"
                      ? "bg-green-100 text-green-800"
                      : location.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {location.status === "active"
                    ? "Đang hoạt động"
                    : location.status === "pending"
                    ? "Chờ duyệt"
                    : "Tạm dừng"}
                </span>
              </div>

              {/* Description */}
              {location.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Mô tả
                  </label>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {location.description}
                  </p>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center mb-2">
                    <Home className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-900">
                      Homestay
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {location.homestaysCount}
                  </p>
                </div>

                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-emerald-600 mr-2" />
                    <span className="text-sm font-medium text-emerald-900">
                      Đặt chỗ
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {location.totalBookings}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailModal;
