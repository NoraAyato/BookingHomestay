import React from "react";
import { Eye, Edit, Trash2, MapPin, Star, Users } from "lucide-react";
import Pagination from "../common/Pagination";

const HomestaysList = ({
  homestays,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}) => {
  const safeHomestays = Array.isArray(homestays) ? homestays : [];

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
    };

    const statusLabels = {
      active: "Hoạt động",
      inactive: "Không hoạt động",
      pending: "Chờ duyệt",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}
      >
        {statusLabels[status]}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Homestays Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : safeHomestays.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">Không có homestay nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {safeHomestays.map((homestay) => (
            <div
              key={homestay.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={homestay.image}
                  alt={homestay.name}
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                    {homestay.name}
                  </h3>
                  {getStatusBadge(homestay.status)}
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {homestay.location}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{homestay.rating}</span>
                    <span className="mx-1">•</span>
                    <span>{homestay.reviews} đánh giá</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{homestay.rooms} phòng</span>
                  </div>
                </div>

                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Giá/đêm</span>
                    <span className="font-semibold">
                      {formatCurrency(homestay.pricePerNight)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Tổng đặt chỗ</span>
                    <span className="font-semibold">
                      {homestay.totalBookings}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Doanh thu</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(homestay.revenue)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <span className="text-sm text-gray-500">
                    Chủ: {homestay.host ?? "Chưa cập nhật"}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView && onView(homestay)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit && onEdit(homestay)}
                      className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(homestay)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && safeHomestays.length > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default HomestaysList;
