import React, { useState } from "react";
import { X, CheckCircle, AlertTriangle } from "lucide-react";

const CompleteBookingModal = ({ isOpen, onClose, booking, onConfirm }) => {
  const [confirmText, setConfirmText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isValid = confirmText.toLowerCase() === "hoàn thành";

  const handleSubmit = async () => {
    if (!isValid) {
      setError('Vui lòng nhập chính xác "hoàn thành" để xác nhận');
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onConfirm(booking.id);
      // Reset form
      setConfirmText("");
      onClose();
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setConfirmText("");
      setError("");
      onClose();
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            <h2 className="text-xl font-bold">Hoàn thành đơn đặt phòng</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Booking Info */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Thông tin đơn đặt</p>
            <p className="text-lg font-bold text-gray-900 mb-1">
              {booking.guestName}
            </p>
            <p className="text-sm text-gray-700">{booking.homestayName}</p>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Check-in:{" "}
                <span className="font-semibold">{booking.checkIn}</span>
              </p>
              <p className="text-xs text-gray-600">
                Check-out:{" "}
                <span className="font-semibold">{booking.checkOut}</span>
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">
                  Xác nhận hoàn thành
                </p>
                <p className="text-xs text-amber-800">
                  Bạn đang thực hiện hoàn thành đơn đặt phòng này. Hành động này
                  sẽ cập nhật trạng thái đơn đặt và không thể hoàn tác.
                </p>
              </div>
            </div>
          </div>

          {/* Confirm Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nhập "<span className="text-green-600">hoàn thành</span>" để xác
              nhận:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError("");
              }}
              placeholder="hoàn thành"
              disabled={isSubmitting}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Xác nhận hoàn thành
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteBookingModal;
