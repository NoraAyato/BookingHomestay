import React, { useState } from "react";
import { X, Trash2, AlertTriangle, Info } from "lucide-react";

const DeleteHomestayModal = ({ homestay, isOpen, onClose, deleteHomestay }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !homestay) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const isSuccess = await deleteHomestay(homestay.id);
      if (isSuccess) {
        onClose();
      }
    } catch (error) {
      console.error("Error deleting homestay:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Trash2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Xóa Homestay</h2>
              <p className="text-red-100 text-sm">
                Hành động không thể hoàn tác
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Warning Alert */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-900 mb-1">
                  Cảnh báo nghiêm trọng!
                </p>
                <p className="text-sm text-red-800">
                  Bạn sắp xóa homestay này vĩnh viễn. Hành động này không thể
                  hoàn tác và sẽ xóa tất cả dữ liệu liên quan.
                </p>
              </div>
            </div>
          </div>

          {/* Homestay Info */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Thông tin homestay sẽ bị xóa:
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tên:</span>
                <span className="font-semibold text-gray-900">
                  {homestay.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Địa điểm:</span>
                <span className="font-medium text-gray-900">
                  {homestay.locationName || homestay.location}
                </span>
              </div>
              {homestay.totalRooms && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng phòng:</span>
                  <span className="font-medium text-gray-900">
                    {homestay.totalRooms} phòng
                  </span>
                </div>
              )}
              {homestay.totalBookings !== undefined && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Đặt phòng:</span>
                  <span className="font-medium text-gray-900">
                    {homestay.totalBookings} lượt
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteHomestayModal;
