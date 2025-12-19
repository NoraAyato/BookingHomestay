import React from "react";
import PropTypes from "prop-types";
import { formatPrice } from "../../../utils/price";
import { formatDateDisplay } from "../../../utils/date";
import { getImageUrl } from "../../../utils/imageUrl";

/**
 * Component hiển thị danh sách booking gần đây
 */
const RecentBookings = ({ bookings, onViewAll }) => {
  // Map status từ backend sang tiếng Việt và màu
  const getStatusInfo = (status) => {
    const statusMap = {
      Pending: {
        label: "Chờ xác nhận",
        color: "bg-yellow-100 text-yellow-800",
      },
      Confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
      Completed: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
      Cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
      CheckedIn: {
        label: "Đã check-in",
        color: "bg-purple-100 text-purple-800",
      },
      CheckedOut: { label: "Đã check-out", color: "bg-gray-100 text-gray-800" },
    };
    return (
      statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" }
    );
  };

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Đặt phòng gần đây
          </h2>
        </div>
        <div className="flex items-center justify-center h-32 text-gray-500">
          Chưa có booking nào
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Đặt phòng gần đây
        </h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem tất cả →
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Khách hàng
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Homestay
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Check-in
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Check-out
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Tổng tiền
              </th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.status);
              return (
                <tr
                  key={booking.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getImageUrl(booking.guestAvatar)}
                        alt={booking.guestName}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = "/avatar/default-avatar.png";
                        }}
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {booking.guestName}
                        </p>
                        <p className="text-xs text-gray-500">{booking.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900">{booking.homestay}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-700">
                      {formatDateDisplay(booking.checkIn)}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-700">
                      {formatDateDisplay(booking.checkOut)}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatPrice(booking.totalAmount)}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

RecentBookings.propTypes = {
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      guestName: PropTypes.string.isRequired,
      guestAvatar: PropTypes.string,
      homestay: PropTypes.string.isRequired,
      homestayId: PropTypes.string.isRequired,
      checkIn: PropTypes.string.isRequired,
      checkOut: PropTypes.string.isRequired,
      totalAmount: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  onViewAll: PropTypes.func,
};

export default RecentBookings;
