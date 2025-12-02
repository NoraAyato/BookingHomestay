import { useState, useEffect, useCallback } from "react";
import {
  getDashboardStats,
  getRevenueTrend,
  getBookingStatus,
  getAreasOverview,
  getPromotionsOverview,
  getNewsOverview,
} from "../../api/admin/dashboard";
import { handleApiResponse } from "../../utils/apiHelper";

/**
 * Hook for Dashboard Stats
 */
export const useDashboardStats = (period = 30) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDashboardStats(period);

      if (handleApiResponse(response, null, "Không thể tải dữ liệu thống kê")) {
        // Backend returns array, convert to object format for easier access
        const statsArray = response.data;
        const statsObject = {
          totalRevenue: statsArray[0], // Doanh thu
          totalBookings: statsArray[1], // Đặt phòng
          activeHomestays: statsArray[2], // Homestay hoạt động
          totalUsers: statsArray[3], // Người dùng mới
        };
        setStats(statsObject);
      } else {
        setError(response.message || "Không thể tải dữ liệu thống kê");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

/**
 * Hook for Revenue Trend Chart
 */
export const useRevenueTrend = (period = 30) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRevenueTrend = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRevenueTrend(period);

      if (
        handleApiResponse(response, null, "Không thể tải dữ liệu doanh thu")
      ) {
        // Backend returns revenue and bookings as formatted strings, convert to numbers
        const parsedData = response.data.map((item) => ({
          name: item.name,
          revenue: parseFloat(item.revenue.replace(/,/g, "")) || 0,
          bookings: parseInt(item.bookings.replace(/,/g, "")) || 0,
        }));
        setData(parsedData);
      } else {
        setError(response.message || "Không thể tải dữ liệu doanh thu");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      console.error("Error fetching revenue trend:", err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchRevenueTrend();
  }, [fetchRevenueTrend]);

  return {
    data,
    loading,
    error,
    refetch: fetchRevenueTrend,
  };
};

/**
 * Hook for Booking Status Distribution
 */
export const useBookingStatus = (period = 30) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookingStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getBookingStatus(period);

      if (response.success && response.data) {
        // Backend returns value as formatted string, convert to numbers
        const parsedData = response.data.map((item) => ({
          name: item.name,
          value: parseInt(item.value.replace(/,/g, "")) || 0,
        }));
        setData(parsedData);
      } else {
        setError(response.message || "Không thể tải dữ liệu đặt chỗ");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      console.error("Error fetching booking status:", err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchBookingStatus();
  }, [fetchBookingStatus]);

  return {
    data,
    loading,
    error,
    refetch: fetchBookingStatus,
  };
};

/**
 * Hook for Areas Overview
 */
export const useAreasOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAreasOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAreasOverview();

      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || "Không thể tải dữ liệu khu vực");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      console.error("Error fetching areas overview:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAreasOverview();
  }, [fetchAreasOverview]);

  return {
    data,
    loading,
    error,
    refetch: fetchAreasOverview,
  };
};

/**
 * Hook for Promotions Overview
 */
export const usePromotionsOverview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPromotions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPromotionsOverview();

      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || "Không thể tải dữ liệu khuyến mãi");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      console.error("Error fetching promotions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  return {
    data,
    loading,
    error,
    refetch: fetchPromotions,
  };
};

/**
 * Hook for News Overview
 */
export const useNewsOverview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNewsOverview();

      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.message || "Không thể tải dữ liệu tin tức");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return {
    data,
    loading,
    error,
    refetch: fetchNews,
  };
};
