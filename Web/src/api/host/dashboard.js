import http from "../http";

/**
 * API service cho Host Dashboard
 */
export const hostDashboardAPI = {
  /**
   * Lấy thống kê tổng quan cho dashboard
   * @param {number} period - Số ngày thống kê (mặc định: 7)
   * @returns {Promise} Response chứa stats data
   */
  getStats: async (period = 7) => {
    try {
      const response = await http.get("/api/host/dashboard/stats", {
        params: { period },
        requireAuth: true,
      });
      return response;
    } catch (error) {
      console.error("Error fetching host stats:", error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Lấy dữ liệu biểu đồ doanh thu theo tháng
   * @param {number} months - Số tháng thống kê (mặc định: 6)
   * @returns {Promise} Response chứa revenue trend data
   */
  getRevenueTrend: async (months = 6) => {
    try {
    
      const response = await http.get("/api/host/dashboard/revenue-trend", {
        params: { period: months },
        requireAuth: true,
      });
    
      return response;
    } catch (error) {
      console.error("Error fetching revenue trend:", error);
      return { success: false, message: error.message };
    }
  },

  /**
   * Lấy danh sách booking gần đây
   * @returns {Promise} Response chứa recent bookings data
   */
  getRecentBookings: async () => {
    try {
      const response = await http.get("/api/host/dashboard/recent-bookings", {
        requireAuth: true,
      });
      return response;
    } catch (error) {
      console.error("Error fetching recent bookings:", error);
      return { success: false, message: error.message };
    }
  },
};
