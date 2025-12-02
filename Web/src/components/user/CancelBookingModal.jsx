import React, { useState } from "react";
import { useBookings } from "../../hooks/useBookings";
import { showToast } from "../common/Toast";

const CancelBookingModal = ({ isOpen, onClose, onSubmit, booking }) => {
  const [form, setForm] = useState({
    reason: "",
    bankName: "",
    bankAccount: "",
  });
  const { cancelBooking, loading } = useBookings();

  if (!isOpen || !booking) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const cancelData = {
        maPDPhong: booking.bookingId,
        lyDoHuy: form.reason,
        tenNganHang: form.bankName,
        soTaiKhoan: form.bankAccount,
      };

      const result = await cancelBooking(cancelData);
      if (result) {
        showToast("success", "Đã gửi yêu cầu hủy đặt phòng thành công!");
        if (onSubmit) {
          onSubmit(booking.bookingId, form, true);
        }
        handleClose();
      }
    } catch (error) {
      console.error("Lỗi khi hủy đặt phòng:", error);
    }
  };

  const handleClose = () => {
    setForm({ reason: "", bankName: "", bankAccount: "" });
    onClose();
  };

  const isFormValid = () => {
    return (
      form.reason.trim() && form.bankName.trim() && form.bankAccount.trim()
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-2">Hủy đặt phòng</h3>
              <p className="text-red-100 text-sm">{booking.homestayName}</p>
              <p className="text-red-200 text-xs mt-1">
                Booking ID: #{booking.bookingId}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Body */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Lý do hủy đặt phòng
            </label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Nhập lý do hủy..."
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Tên ngân hàng
            </label>
            <input
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              placeholder="Nhập tên ngân hàng..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block font-semibold text-gray-900 mb-2">
              Số tài khoản
            </label>
            <input
              name="bankAccount"
              value={form.bankAccount}
              onChange={handleChange}
              placeholder="Nhập số tài khoản..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t-2 border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </div>
              ) : (
                "Xác nhận hủy"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
