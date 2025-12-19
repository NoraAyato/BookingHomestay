import http from "../http";

/**
 * API service cho Host Bookings Management
 */
export const hostBookingsAPI = {
  /**
   * Lấy thống kê booking của host
   * @returns {Promise} Response chứa booking stats (total, pending, booked, cancelled, completed, revenue)
   */
  getBookingStats: async () => {
    try {
      const response = await http.get("/api/host/bookings/stats", {
        requireAuth: true,
      });
      return response;
    } catch (error) {
      console.error("Error fetching booking stats:", error);
      throw error;
    }
  },

  /**
   * Lấy danh sách bookings với filter và pagination
   * @param {Object} params - Query parameters
   * @param {number} params.page - Số trang (default: 1)
   * @param {number} params.size - Số items mỗi trang (default: 5)
   * @param {string} params.status - Filter theo trạng thái (Pending, Booked, Completed, Cancelled)
   * @param {string} params.startDate - Ngày bắt đầu filter (YYYY-MM-DD)
   * @param {string} params.endDate - Ngày kết thúc filter (YYYY-MM-DD)
   * @param {string} params.keyword - Từ khóa tìm kiếm
   * @returns {Promise} Response chứa paginated booking list
   */
  getBookings: async (params = {}) => {
    try {
      const queryParams = {
        page: params.page || 1,
        size: params.size || 5,
        ...(params.status && { status: params.status }),
        ...(params.startDate && { startDate: params.startDate }),
        ...(params.endDate && { endDate: params.endDate }),
        ...(params.keyword && { keyword: params.keyword }),
      };

      const response = await http.get("/api/host/bookings", {
        params: queryParams,
        requireAuth: true,
      });
      return response;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết một booking
   * @param {string} bookingId - ID của booking
   * @returns {Promise} Response chứa booking detail
   */
  getBookingDetail: async (bookingId) => {
    try {
      const response = await http.get(`/api/host/bookings/${bookingId}`, {
        requireAuth: true,
      });
      return response;
    } catch (error) {
      console.error("Error fetching booking detail:", error);
      throw error;
    }
  },

  /**
   * Xác nhận booking
   * @param {string} bookingId - ID của booking
   * @returns {Promise} Response
   */
  confirmBooking: async (bookingId) => {
    try {
      const response = await http.put(
        `/api/host/bookings/${bookingId}/confirm`,
        {},
        {
          requireAuth: true,
        }
      );
      return response;
    } catch (error) {
      console.error("Error confirming booking:", error);
      throw error;
    }
  },

  /**
   * Từ chối booking
   * @param {string} bookingId - ID của booking
   * @param {string} reason - Lý do từ chối
   * @returns {Promise} Response
   */
  rejectBooking: async (bookingId, reason) => {
    try {
      const response = await http.put(
        `/api/host/bookings/${bookingId}/reject`,
        { reason },
        {
          requireAuth: true,
        }
      );
      return response;
    } catch (error) {
      console.error("Error rejecting booking:", error);
      throw error;
    }
  },

  /**
   * Hủy booking
   * @param {string} bookingId - ID của booking
   * @param {string} reason - Lý do hủy
   * @returns {Promise} Response
   */
  cancelBooking: async (bookingId, reason) => {
    try {
      const response = await http.put(
        `/api/host/bookings/${bookingId}/cancel`,
        { reason },
        {
          requireAuth: true,
        }
      );
      return response;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      throw error;
    }
  },

  /**
   * Check-in booking
   * @param {string} bookingId - ID của booking
   * @returns {Promise} Response
   */
  checkInBooking: async (bookingId) => {
    try {
      const response = await http.put(
        `/api/host/bookings/${bookingId}/check-in`,
        {},
        {
          requireAuth: true,
        }
      );
      return response;
    } catch (error) {
      console.error("Error checking in booking:", error);
      throw error;
    }
  },

  /**
   * Check-out booking (hoàn thành)
   * @param {string} bookingId - ID của booking
   * @returns {Promise} Response
   */
  checkOutBooking: async (bookingId) => {
    try {
      const response = await http.put(
        `/api/host/bookings/${bookingId}/check-out`,
        {},
        {
          requireAuth: true,
        }
      );
      return response;
    } catch (error) {
      console.error("Error checking out booking:", error);
      throw error;
    }
  },

  /**
   * Cập nhật booking (hoàn thành đơn)
   * @param {string} bookingId - ID của booking
   * @returns {Promise} Response
   */
  updateBooking: async (bookingId) => {
    try {
      const response = await http.put(
        `/api/host/bookings/${bookingId}`,
        {},
        {
          requireAuth: true,
        }
      );
      return response;
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  },
};

export default hostBookingsAPI;
