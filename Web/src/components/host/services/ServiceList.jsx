import React from "react";
import { Edit, Trash2, DollarSign, Home, Briefcase } from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";

const ServiceList = ({ services, loading, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
          >
            <div className="h-48 bg-gray-200" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Không tìm thấy dịch vụ
        </h3>
        <p className="text-gray-500">
          Thử thay đổi bộ lọc hoặc thêm dịch vụ mới
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <div
          key={service.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          {/* Service Image */}
          <div className="relative h-48 w-full overflow-hidden bg-gray-100">
            {service.image ? (
              <img
                src={getImageUrl(service.image)}
                alt={service.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Briefcase className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Service Content */}
          <div className="p-5">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {service.name}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate">
                  {service.homestayName}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {service.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center mb-4 pb-4 border-b">
              <DollarSign className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Giá dịch vụ</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(service.price)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => onEdit && onEdit(service)}
                className="flex-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
              >
                <Edit className="h-4 w-4" />
                Sửa
              </button>
              <button
                onClick={() => onDelete && onDelete(service)}
                className="flex-1 px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Xóa
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
