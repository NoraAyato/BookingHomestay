import React from "react";
import { X, AlertTriangle, CheckCircle } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  itemName = "",
  loading = false,
  confirmText = "Xác nhận",
  confirmButtonClass = "bg-red-600 hover:bg-red-700 text-white",
  type = "danger", // danger, success
}) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  const Icon = type === "success" ? CheckCircle : AlertTriangle;
  const iconBgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const iconColor = type === "success" ? "text-green-600" : "text-red-600";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}
            >
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">{message}</p>
          {itemName && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-600">Chi tiết:</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {itemName}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${confirmButtonClass}`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
