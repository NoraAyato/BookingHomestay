import http from "../http";

/**
 * Get dashboard statistics
 * GET /api/admin/dashboard/stats?period={period}
 */
export const getDashboardStats = async (period = 30) => {
  try {
    const response = await http.get(
      `/api/admin/dashboard/stats?period=${period}`,
      {
        requireAuth: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Get revenue trend chart data
 * GET /api/admin/dashboard/revenue-trend?period={period}
 */
export const getRevenueTrend = async (period = 30) => {
  try {
    const response = await http.get(
      `/api/admin/dashboard/revenue-trend?period=${period}`,
      {
        requireAuth: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching revenue trend:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Get booking status distribution
 * GET /api/admin/dashboard/booking-status?period={period}
 */
export const getBookingStatus = async (period = 30) => {
  try {
    const response = await http.get(
      `/api/admin/dashboard/booking-status?period=${period}`,
      {
        requireAuth: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching booking status:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Get areas overview
 * GET /api/admin/dashboard/areas
 */
export const getAreasOverview = async () => {
  try {
    const response = await http.get("/api/admin/dashboard/areas", {
      requireAuth: true,
    });
    return response;
  } catch (error) {
    console.error("Error fetching areas overview:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Get promotions overview
 * GET /api/admin/dashboard/promotions?status={status}&limit={limit}
 */
export const getPromotionsOverview = async () => {
  try {
    const response = await http.get(`/api/admin/dashboard/promotions`, {
      requireAuth: true,
    });
    return response;
  } catch (error) {
    console.error("Error fetching promotions overview:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Get news overview
 * GET /api/admin/dashboard/news?status={status}&limit={limit}
 */
export const getNewsOverview = async () => {
  try {
    const response = await http.get(`/api/admin/dashboard/news`, {
      requireAuth: true,
    });
    return response;
  } catch (error) {
    console.error("Error fetching news overview:", error);
    return { success: false, message: error.message };
  }
};
