import React, { useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

const DeleteServiceModal = ({ service, isOpen, onClose, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !service) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const isSuccess = await onDelete(service.id);
      if (isSuccess) {
        onClose();
      }
    } catch (error) {
    //   console.error("Error deleting service:", error);
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
              <h2 className="text-xl font-bold">Xóa Dịch vụ</h2>
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
                <p className="text-sm font-bold text-red-900 mb-1">Cảnh báo!</p>
                <p className="text-sm text-red-800">
                  Bạn sắp xóa dịch vụ này. Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>
          </div>

          {/* Service Info */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Thông tin dịch vụ sẽ bị xóa:
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Tên dịch vụ:</span>
                <span className="font-semibold text-gray-900 text-right">
                  {service.name}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Homestay:</span>
                <span className="font-medium text-gray-900 text-right">
                  {service.homestayName}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-gray-600">Giá:</span>
                <span className="font-medium text-gray-900 text-right">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  }).format(service.price)}
                </span>
              </div>
              {service.description && (
                <div className="flex flex-col pt-2 border-t border-gray-200">
                  <span className="text-gray-600 mb-1">Mô tả:</span>
                  <span className="text-gray-900 text-sm">
                    {service.description}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Confirmation Text */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              Dữ liệu sau khi xóa sẽ không thể khôi phục. Bạn có chắc chắn muốn
              tiếp tục?
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-white font-medium transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Đang xóa...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Xác nhận xóa
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteServiceModal;
