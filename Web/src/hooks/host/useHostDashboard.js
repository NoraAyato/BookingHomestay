import { useState, useEffect, useCallback } from "react";
import { hostDashboardAPI } from "../../api/host/dashboard";
import {
  isAuthError,
  isAccessDenied,
  handleAccessDenied,
} from "../../utils/apiHelper";

/**
 * Custom hook để quản lý data cho Host Dashboard
 * @param {number} revenuePeriod - Số tháng cho revenue chart (mặc định: 6)
 */
export const useHostDashboard = (revenuePeriod = 6) => {
  const statsPeriod = 7; // Mặc định 7 ngày cho stats
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Parse revenue string "6,275,000" thành number 6275000
   */
  const parseRevenue = (revenueStr) => {
    if (!revenueStr) return 0;
    return parseFloat(revenueStr.replace(/,/g, ""));
  };

  /**
   * Parse bookings string "11" thành number 11
   */
  const parseBookings = (bookingsStr) => {
    if (!bookingsStr) return 0;
    return parseInt(bookingsStr, 10);
  };

  /**
   * Format revenue data từ API
   */
  const formatRevenueData = (data) => {
    return data.map((item) => ({
      month: item.month,
      revenue: parseRevenue(item.revenue),
      bookings: parseBookings(item.bookings),
    }));
  };

  /**
   * Format stats data - làm tròn rating tới 1 số thập phân
   */
  const formatStatsData = (data) => {
    return {
      ...data,
      averageRating: data.averageRating
        ? parseFloat(data.averageRating.toFixed(1))
        : 0,
    };
  };

  /**
   * Fetch tất cả dashboard data
   */
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    console.log(
      "[Hook] fetchDashboardData called with revenuePeriod:",
      revenuePeriod
    );

    try {
      const [statsRes, revenueRes, bookingsRes] = await Promise.all([
        hostDashboardAPI.getStats(statsPeriod),
        hostDashboardAPI.getRevenueTrend(revenuePeriod),
        hostDashboardAPI.getRecentBookings(),
      ]);

      // Check for auth errors
      if (
        isAuthError(statsRes) ||
        isAuthError(revenueRes) ||
        isAuthError(bookingsRes)
      ) {
        setError("Phiên đăng nhập đã hết hạn");
        setLoading(false);
        return;
      }

      // Check for access denied
      if (
        isAccessDenied(statsRes) ||
        isAccessDenied(revenueRes) ||
        isAccessDenied(bookingsRes)
      ) {
        handleAccessDenied();
        setLoading(false);
        return;
      }

      // Stats response
      if (statsRes?.success && statsRes?.data) {
        setStats(formatStatsData(statsRes.data));
      } else if (!statsRes?.success) {
        console.error("Failed to fetch stats:", statsRes?.message);
      }

      // Revenue response
      if (revenueRes?.success && revenueRes?.data) {
        setRevenueData(formatRevenueData(revenueRes.data));
      } else if (!revenueRes?.success) {
        console.error("Failed to fetch revenue:", revenueRes?.message);
      }

      // Bookings response
      if (bookingsRes?.success && bookingsRes?.data) {
        setRecentBookings(bookingsRes.data);
      } else if (!bookingsRes?.success) {
        console.error("Failed to fetch bookings:", bookingsRes?.message);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err.response?.data?.message || "Đã có lỗi xảy ra khi tải dữ liệu"
      );
    } finally {
      setLoading(false);
    }
  }, [revenuePeriod]);

  /**
   * Refresh dashboard data
   */
  const refresh = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    revenueData,
    recentBookings,
    loading,
    error,
    refresh,
  };
};
