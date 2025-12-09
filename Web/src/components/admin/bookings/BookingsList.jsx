import React from "react";
import { Eye } from "lucide-react";

const BookingsList = ({
  bookings,
  onView,
  formatDate,
  formatCurrency,
  getStatusBadge,
  getPaymentBadge,
  getPaymentMethodLabel,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Danh sách đặt chỗ</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mã đặt chỗ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Khách hàng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Homestay
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ngày lưu trú
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tổng tiền
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thanh toán
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-blue-600">
                    {booking.id}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(booking.bookingDate)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.guestName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {booking.guestPhone}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">
                    {booking.homestay}
                  </div>
                  <div className="text-xs text-gray-500">
                    Host: {booking.hostName}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(booking.checkIn)}
                  </div>
                  <div className="text-xs text-gray-500">
                    đến {formatDate(booking.checkOut)} ({booking.nights} đêm)
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(booking.totalAmount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {getPaymentMethodLabel(booking.paymentMethod)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {getPaymentBadge(booking.paymentStatus)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onView(booking)}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bookings.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          <p className="text-lg font-medium">Không tìm thấy đặt chỗ nào</p>
          <p className="text-sm mt-1">Hãy thử thay đổi bộ lọc hoặc tìm kiếm</p>
        </div>
      )}
    </div>
  );
};

export default BookingsList;
