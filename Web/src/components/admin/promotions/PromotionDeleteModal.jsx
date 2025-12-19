import React from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";

const PromotionDeleteModal = ({
  promotion,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen || !promotion) return null;

  const handleConfirm = () => {
    onConfirm(promotion.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm"
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
          className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Xác nhận xóa khuyến mãi
                  </h3>
                  <p className="text-red-100 text-sm">
                    Hành động này không thể hoàn tác
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                disabled={isLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium mb-1">
                    Bạn có chắc chắn muốn xóa khuyến mãi này?
                  </p>
                  <p className="text-sm text-red-700">
                    Khuyến mãi sẽ bị xóa vĩnh viễn và không thể khôi phục. Tất
                    cả dữ liệu liên quan sẽ bị mất.
                  </p>
                </div>
              </div>
            </div>

            {/* Promotion Info */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tên khuyến mãi:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {promotion.name}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Mã khuyến mãi:</span>
                <span className="text-sm font-semibold text-gray-900 font-mono">
                  {promotion.code}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Loại giảm giá:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {promotion.type === "percentage" ? "Phần trăm" : "Cố định"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Giá trị:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {promotion.type === "percentage"
                    ? `${promotion.value}%`
                    : new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(promotion.value)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trạng thái:</span>
                <span
                  className={`text-sm font-semibold ${
                    promotion.status === "active"
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {promotion.status === "active"
                    ? "Đang hoạt động"
                    : "Tạm dừng"}
                </span>
              </div>

              {promotion.usageCount !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Đã sử dụng:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {promotion.usageCount}/{promotion.usageLimit}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Thời gian:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {promotion.startDate} - {promotion.endDate}
                </span>
              </div>

              {promotion.createdBy && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tạo bởi:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {promotion.createdBy}
                  </span>
                </div>
              )}
            </div>

            {/* Warning if promotion has usage */}
            {promotion.usageCount > 0 && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-amber-800 font-medium mb-1">
                      Cảnh báo: Khuyến mãi đã được sử dụng
                    </p>
                    <p className="text-sm text-amber-700">
                      Khuyến mãi này đã được sử dụng {promotion.usageCount} lần.
                      Việc xóa có thể ảnh hưởng đến lịch sử đặt phòng.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Đang xóa...</span>
                </>
              ) : (
                <>
                  <Trash2 className="h-5 w-5" />
                  <span>Xóa khuyến mãi</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDeleteModal;
