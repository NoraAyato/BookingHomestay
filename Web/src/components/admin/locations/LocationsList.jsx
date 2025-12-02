import React from "react";
import { Eye, Edit } from "lucide-react";
import Pagination from "../common/Pagination";

const LocationsList = ({
  locations,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}) => {
  const safeLocations = Array.isArray(locations) ? locations : [];

  return (
    <div className="space-y-6">
      {/* Locations Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : safeLocations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">Không có khu vực nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeLocations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-200 group"
            >
              <div className="relative">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>

              <div className="p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {location.name}
                  </h3>
                  <p className="text-sm text-gray-500">{location.province}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-lg font-bold text-blue-600">
                      {location.homestaysCount}
                    </div>
                    <div className="text-xs text-blue-700 font-medium">
                      Homestay
                    </div>
                  </div>
                  <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="text-lg font-bold text-emerald-600">
                      {location.totalBookings}
                    </div>
                    <div className="text-xs text-emerald-700 font-medium">
                      Đặt chỗ
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onView && onView(location)}
                    className="flex-1 py-2 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium border border-blue-200 hover:border-blue-300 transition-all"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Xem</span>
                  </button>
                  <button
                    onClick={() => onEdit && onEdit(location)}
                    className="flex-1 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center justify-center gap-1.5 text-sm font-medium border border-emerald-200 hover:border-emerald-300 transition-all"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Sửa</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination - chỉ hiển thị khi có dữ liệu */}
      {!loading && safeLocations.length > 0 && (
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

export default LocationsList;
