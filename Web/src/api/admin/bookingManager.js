import http from "../http";

/**
 * Lấy danh sách đặt phòng cho admin
 * GET /api/admin/bookingmanager
 *
 * @param {number} page - Trang hiện tại (default: 1)
 * @param {number} size - Số lượng items mỗi trang (default: 10)
 * @param {string} status - Lọc theo trạng thái booking (optional)
 * @param {string} startDate - Ngày bắt đầu lọc (format: YYYY-MM-DD, optional)
 * @param {string} endDate - Ngày kết thúc lọc (format: YYYY-MM-DD, optional)
 * @param {string} keyword - Từ khóa tìm kiếm (optional)
 *
 * @returns {Promise<ApiResponse<PageResponse<BookingDataResponseDto>>>}
 * Response structure:
 * {
 *   success: boolean,
 *   message: string,
 *   data: {
 *     items: Array<{
 *       id: string,
 *       guestName: string,
 *       guestEmail: string,
 *       guestPhone: string,
 *       homestay: string,
 *       hostName: string,
 *       checkIn: string (YYYY-MM-DD),
 *       checkOut: string (YYYY-MM-DD),
 *       status: string,
 *       totalAmount: number,
 *       paidAmount: number,
 *       bookingDate: string (YYYY-MM-DD),
 *       paymentMethod: string,
 *       paymentStatus: string
 *     }>,
 *     total: number,
 *     page: number,
 *     limit: number
 *   }
 * }
 */
export async function getAdminBookings({
  page = 1,
  size = 10,
  status = null,
  startDate = null,
  endDate = null,
  keyword = null,
}) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());

  if (status) params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (keyword) params.append("keyword", keyword);

  return await http.get(`/api/admin/bookingmanager?${params.toString()}`, {
    requireAuth: true,
  });
}

/**
 * Lấy thống kê bookings
 * GET /api/admin/bookingmanager/stats
 *
 * @returns {Promise<ApiResponse<BookingStats>>}
 * Response structure:
 * {
 *   success: boolean,
 *   message: string,
 *   data: {
 *     total: number,
 *     pending: number,
 *     booked: number,
 *     cancelled: number,
 *     completed: number
 *   }
 * }
 */
export async function getBookingStats() {
  return await http.get("/api/admin/bookingmanager/stats", {
    requireAuth: true,
  });
}
