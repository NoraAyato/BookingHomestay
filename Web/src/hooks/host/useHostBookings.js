import { useState, useEffect, useCallback, useRef } from "react";
import { hostBookingsAPI } from "../../api/host/bookings";
import { exportBookingsToExcel } from "../../utils/excelExport";
import { handleApiResponse } from "../../utils/apiHelper";

/**
 * Custom hook để quản lý bookings của host
 * @param {Object} initialFilters - Filters ban đầu
 * @returns {Object} Booking data và methods
 */
export const useHostBookings = (initialFilters = {}) => {
  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    booked: 0,
    cancelled: 0,
    completed: 0,
    revenue: 0,
  });

  // Bookings list state
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
  });

  // Filters state
  const [filters, setFilters] = useState({
    page: 1,
    size: 5,
    status: "",
    startDate: null,
    endDate: null,
    keyword: "",
    ...initialFilters,
  });

  // Loading states
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);

  // Ref để track lần đầu mount
  const isFirstMount = useRef(true);

  /**
   * Lấy thống kê booking
   */
  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    setError(null);

    try {
      const response = await hostBookingsAPI.getBookingStats();

      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || "Không thể lấy thống kê");
      }
    } catch (err) {
      console.error("Error fetching booking stats:", err);
      setError(err.message || "Lỗi khi lấy thống kê");
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  /**
   * Lấy danh sách bookings
   */
  const fetchBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    setError(null);

    try {
      const params = {
        page: filters.page,
        size: filters.size,
        ...(filters.status && { status: filters.status }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.keyword && { keyword: filters.keyword }),
      };

      const response = await hostBookingsAPI.getBookings(params);

      if (response.success) {
        const { items, total, page, limit } = response.data;
        setBookings(items || []);
        setPagination({
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        });
      } else {
        setError(response.message || "Không thể lấy danh sách booking");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.message || "Lỗi khi lấy danh sách booking");
    } finally {
      setIsLoadingBookings(false);
    }
  }, [filters]);

  /**
   * Thay đổi filter
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset về trang 1 khi thay đổi filter (trừ khi đang thay đổi page)
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }));
  }, []);

  /**
   * Thay đổi trang
   */
  const changePage = useCallback((newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  }, []);

  /**
   * Reset filters về mặc định
   */
  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      size: 5,
      status: "",
      startDate: null,
      endDate: null,
      keyword: "",
    });
  }, []);

  /**
   * Refresh data (reload cả stats và bookings)
   */
  const refresh = useCallback(async () => {
    await Promise.all([fetchStats(), fetchBookings()]);
  }, [fetchStats, fetchBookings]);

  /**
   * Xác nhận booking
   */
  const confirmBooking = useCallback(
    async (bookingId) => {
      try {
        const response = await hostBookingsAPI.confirmBooking(bookingId);
        if (response.success) {
          // Refresh data sau khi xác nhận
          await refresh();
          return { success: true, message: "Đã xác nhận booking" };
        }
        return { success: false, message: response.message };
      } catch (err) {
        console.error("Error confirming booking:", err);
        return { success: false, message: err.message };
      }
    },
    [refresh]
  );

  /**
   * Từ chối booking
   */
  const rejectBooking = useCallback(
    async (bookingId, reason) => {
      try {
        const response = await hostBookingsAPI.rejectBooking(bookingId, reason);
        if (response.success) {
          await refresh();
          return { success: true, message: "Đã từ chối booking" };
        }
        return { success: false, message: response.message };
      } catch (err) {
        console.error("Error rejecting booking:", err);
        return { success: false, message: err.message };
      }
    },
    [refresh]
  );

  /**
   * Hủy booking
   */
  const cancelBooking = useCallback(
    async (bookingId, reason) => {
      try {
        const response = await hostBookingsAPI.cancelBooking(bookingId, reason);
        if (response.success) {
          await refresh();
          return { success: true, message: "Đã hủy booking" };
        }
        return { success: false, message: response.message };
      } catch (err) {
        console.error("Error cancelling booking:", err);
        return { success: false, message: err.message };
      }
    },
    [refresh]
  );

  /**
   * Check-in booking
   */
  const checkInBooking = useCallback(
    async (bookingId) => {
      try {
        const response = await hostBookingsAPI.checkInBooking(bookingId);
        if (response.success) {
          await refresh();
          return { success: true, message: "Check-in thành công" };
        }
        return { success: false, message: response.message };
      } catch (err) {
        console.error("Error checking in booking:", err);
        return { success: false, message: err.message };
      }
    },
    [refresh]
  );

  /**
   * Check-out booking
   */
  const checkOutBooking = useCallback(
    async (bookingId) => {
      try {
        const response = await hostBookingsAPI.checkOutBooking(bookingId);
        if (response.success) {
          await refresh();
          return { success: true, message: "Check-out thành công" };
        }
        return { success: false, message: response.message };
      } catch (err) {
        console.error("Error checking out booking:", err);
        return { success: false, message: err.message };
      }
    },
    [refresh]
  );

  /**
   * Cập nhật booking (hoàn thành)
   */
  const updateBooking = useCallback(
    async (bookingId) => {
      try {
        const response = await hostBookingsAPI.updateBooking(bookingId);
        if (response.success) {
          await refresh();
          return {
            success: true,
            message: response.message || "Cập nhật booking thành công",
          };
        }
        return { success: false, message: response.message };
      } catch (err) {
        console.error("Error updating booking:", err);
        return { success: false, message: err.message };
      }
    },
    [refresh]
  );

  /**
   * Xuất báo cáo booking
   * @param {number} days - Số ngày muốn xuất (0 = hôm nay, 7 = 7 ngày, etc.)
   * @param {Object} customFilters - Filters tùy chỉnh (status, keyword)
   */
  const exportBookings = useCallback(
    async (days = 7, customFilters = {}) => {
      setIsExporting(true);
      try {
        // Calculate date range
        const today = new Date();
        const endDate = today.toISOString().split("T")[0];

        let startDate;
        if (days === 0) {
          // Hôm nay
          startDate = endDate;
        } else {
          // N days ago
          const startDateObj = new Date();
          startDateObj.setDate(today.getDate() - days);
          startDate = startDateObj.toISOString().split("T")[0];
        }

        // Merge with custom filters
        const exportFilters = {
          status: customFilters.status || filters.status,
          keyword: customFilters.keyword || filters.keyword,
        };

        // Fetch all bookings without pagination
        const response = await hostBookingsAPI.getBookings({
          page: 1,
          size: 1000, // Large number to get all bookings
          status: exportFilters.status,
          startDate: startDate,
          endDate: endDate,
          keyword: exportFilters.keyword,
        });

        if (response.success && response.data.items.length > 0) {
          exportBookingsToExcel(response.data.items);
          handleApiResponse(
            { success: true },
            `Đã xuất ${response.data.items.length} booking thành công`,
            ""
          );
          return { success: true, count: response.data.items.length };
        } else {
          handleApiResponse(
            { success: false },
            "",
            "Không có dữ liệu để xuất trong khoảng thời gian này"
          );
          return { success: false, message: "Không có dữ liệu" };
        }
      } catch (error) {
        console.error("Error exporting bookings:", error);
        handleApiResponse(
          { success: false },
          "",
          "Có lỗi xảy ra khi xuất báo cáo"
        );
        return { success: false, message: error.message };
      } finally {
        setIsExporting(false);
      }
    },
    [filters]
  );

  // Fetch data khi component mount hoặc filters thay đổi
  useEffect(() => {
    // Bỏ qua lần đầu mount vì filters chưa có giá trị thực
    if (isFirstMount.current) {
      isFirstMount.current = false;
      fetchBookings();
      return;
    }

    // Chỉ fetch khi filters thay đổi (sau lần mount đầu)
    fetchBookings();
  }, [
    filters.page,
    filters.size,
    filters.status,
    filters.startDate,
    filters.endDate,
    filters.keyword,
  ]);

  // Fetch stats chỉ khi mount
  useEffect(() => {
    fetchStats();
  }, []);

  return {
    // Data
    stats,
    bookings,
    pagination,
    filters,

    // Loading states
    isLoadingStats,
    isLoadingBookings,
    isLoading: isLoadingStats || isLoadingBookings,
    isExporting,
    error,

    // Methods
    fetchStats,
    fetchBookings,
    updateFilters,
    changePage,
    resetFilters,
    refresh,
    exportBookings,

    // Actions
    confirmBooking,
    rejectBooking,
    cancelBooking,
    checkInBooking,
    checkOutBooking,
    updateBooking,
  };
};

export default useHostBookings;
