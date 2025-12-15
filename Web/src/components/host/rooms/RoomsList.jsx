import React from "react";
import {
  Edit,
  Trash2,
  Users,
  Bed,
  DoorOpen,
  Wifi,
  Tv,
  Wind,
  Coffee,
  Sparkles,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";

const RoomsList = ({ rooms, loading, onView, onEdit, onDelete }) => {
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

  const getAmenityIcon = (iconName) => {
    const icons = {
      Wifi: Wifi,
      Tv: Tv,
      Wind: Wind,
      Coffee: Coffee,
    };
    return icons[iconName] || Sparkles;
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

  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <DoorOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Không tìm thấy phòng
        </h3>
        <p className="text-gray-500">Thử thay đổi bộ lọc hoặc thêm phòng mới</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        >
          {/* Room Image */}
          <div className="relative h-48 bg-gray-200">
            {room.images && room.images.length > 0 ? (
              <img
                src={getImageUrl(room.images[0])}
                alt={room.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <DoorOpen className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <div className="absolute top-3 right-3">
              {getStatusBadge(room.status)}
            </div>
            {room.images && room.images.length > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
                +{room.images.length - 1} ảnh
              </div>
            )}
          </div>

          <div className="p-5">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                {room.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{room.homestayName}</p>
              <p className="text-xs text-gray-400 mt-1">ID: {room.id}</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Bed className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Loại: {room.roomType}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>Sức chứa: {room.capacity} người</span>
              </div>

              {/* Amenities */}
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-2 font-medium">
                  Tiện nghi:
                </p>
                {room.amenities && room.amenities.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity.id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        {amenity.name}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{room.amenities.length - 3}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Không có</p>
                )}
              </div>

              <div className="text-lg font-bold text-blue-600 mt-3">
                {formatCurrency(room.price)}/đêm
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => onView(room)}
                className="flex-1 px-3 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-1 text-sm"
              >
                <DoorOpen className="h-4 w-4" />
                Chi tiết
              </button>
              <button
                onClick={() => onEdit && onEdit(room)}
                className="flex-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 text-sm"
              >
                <Edit className="h-4 w-4" />
                Sửa
              </button>
              <button
                onClick={() => onDelete && onDelete(room)}
                className="px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomsList;
