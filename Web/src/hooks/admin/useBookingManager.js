import { useState, useCallback, useEffect } from "react";
import {
  getAdminBookings,
  getBookingStats,
} from "../../api/admin/bookingManager";
import { handleApiResponse } from "../../utils/apiHelper";


export function useAdminBookings(initialPage = 1, pageSize = 10) {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: pageSize,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    status: null,
    startDate: null,
    endDate: null,
    keyword: null,
  });

  // Fetch bookings
  const fetchBookings = useCallback(
    async (page = 1, currentFilters) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAdminBookings({
          page,
          size: pageSize,
          ...currentFilters,
        });

        if (response?.success && response?.data) {
          const { items, total, page: currentPage, limit } = response.data;

          setBookings(items);
          setPagination({
            page: currentPage,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          });
        } else {
          setError(response?.message || "Không thể tải danh sách đặt phòng");
          setBookings([]);
        }
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
        setBookings([]);
        console.error("Error fetching admin bookings:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await getBookingStats();

      if (response?.success && response?.data) {
        setStats(response.data);
      } else {
        console.error("Failed to fetch booking stats:", response?.message);
      }
    } catch (err) {
      console.error("Error fetching booking stats:", err);
    }
  }, []); // Change page
  const changePage = useCallback(
    (page) => {
      setFilters((currentFilters) => {
        fetchBookings(page, currentFilters);
        return currentFilters;
      });
    },
    [fetchBookings]
  );

  // Update filters
  const updateFilters = useCallback(
    (newFilters) => {
      setFilters((prev) => {
        const updated = { ...prev, ...newFilters };
        // Reset về trang 1 khi filter thay đổi
        fetchBookings(1, updated);
        return updated;
      });
    },
    [fetchBookings]
  );

  // Refetch data
  const refetch = useCallback(() => {
    setFilters((currentFilters) => {
      setPagination((currentPagination) => {
        fetchBookings(currentPagination.page, currentFilters);
        return currentPagination;
      });
      return currentFilters;
    });
    fetchStats();
  }, [fetchBookings, fetchStats]);

  // Initial fetch
  useEffect(() => {
    fetchBookings(initialPage, {
      status: null,
      startDate: null,
      endDate: null,
      keyword: null,
    });
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    bookings,
    stats,
    loading,
    error,
    pagination,
    filters,
    setFilters: updateFilters,
    changePage,
    refetch,
  };
}

/**
 * Hook để lấy chi tiết booking (dự phòng cho tương lai)
 */
export function useBookingDetail(bookingId) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Implement when API is available
    setLoading(false);
  }, [bookingId]);

  return {
    booking,
    loading,
    error,
  };
}
