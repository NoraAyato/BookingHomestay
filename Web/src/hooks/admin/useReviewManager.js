import { useState, useCallback, useEffect } from "react";
import {
  getAdminReviews,
  getReviewStats,
  deleteReview,
} from "../../api/admin/reviewManager";
import { handleApiResponse } from "../../utils/apiHelper";

/**
 * Custom hook để quản lý đánh giá trong admin panel
 * Hỗ trợ tìm kiếm, lọc theo rating và khoảng ngày, phân trang
 */
export function useAdminReviews(initialPage = 1, pageSize = 5) {
  const [reviews, setReviews] = useState([]);
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
    rating: null,
    startDate: null,
    endDate: null,
    search: null,
  });

  // Fetch reviews
  const fetchReviews = useCallback(
    async (page = 1, currentFilters) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAdminReviews({
          page,
          size: pageSize,
          ...currentFilters,
        });

        if (response?.success && response?.data) {
          const { items, total, page: currentPage, limit } = response.data;

          setReviews(items);
          setPagination({
            page: currentPage,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          });
        } else {
          setError(response?.message || "Không thể tải danh sách đánh giá");
          setReviews([]);
        }
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
        setReviews([]);
        console.error("Error fetching admin reviews:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await getReviewStats();

      if (response?.success && response?.data) {
        setStats(response.data);
      } else {
        console.error("Failed to fetch review stats:", response?.message);
      }
    } catch (err) {
      console.error("Error fetching review stats:", err);
    }
  }, []);

  // Change page
  const changePage = useCallback(
    (page) => {
      setFilters((currentFilters) => {
        fetchReviews(page, currentFilters);
        return currentFilters;
      });
    },
    [fetchReviews]
  );

  // Update filters
  const updateFilters = useCallback(
    (newFilters) => {
      setFilters((prev) => {
        const updated = { ...prev, ...newFilters };
        // Reset về trang 1 khi filter thay đổi
        fetchReviews(1, updated);
        return updated;
      });
    },
    [fetchReviews]
  );

  // Delete review
  const handleDeleteReview = useCallback(
    async (reviewId) => {
      try {
        const response = await deleteReview(reviewId);

        const success = handleApiResponse(
          response,
          "Xóa đánh giá thành công!",
          "Không thể xóa đánh giá"
        );

        if (success) {
          // Refresh danh sách sau khi xóa thành công
          setFilters((currentFilters) => {
            setPagination((currentPagination) => {
              fetchReviews(currentPagination.page, currentFilters);
              return currentPagination;
            });
            return currentFilters;
          });
          fetchStats();
          return { success: true, data: response.data };
        }
        return { success: false };
      } catch (err) {
        console.error("Error deleting review:", err);
        handleApiResponse(
          { success: false, message: err.message },
          null,
          "Có lỗi xảy ra khi xóa đánh giá"
        );
        return { success: false };
      }
    },
    [fetchReviews, fetchStats]
  );

  // Refetch data
  const refetch = useCallback(() => {
    setFilters((currentFilters) => {
      setPagination((currentPagination) => {
        fetchReviews(currentPagination.page, currentFilters);
        return currentPagination;
      });
      return currentFilters;
    });
    fetchStats();
  }, [fetchReviews, fetchStats]);

  // Initial fetch
  useEffect(() => {
    fetchReviews(initialPage, {
      rating: null,
      startDate: null,
      endDate: null,
      search: null,
    });
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    reviews,
    stats,
    loading,
    error,
    pagination,
    filters,
    setFilters: updateFilters,
    changePage,
    deleteReview: handleDeleteReview,
    refetch,
  };
}

/**
 * Hook để lấy chi tiết review (dự phòng cho tương lai)
 */
export function useReviewDetail(reviewId) {
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Implement when API is available
    setLoading(false);
  }, [reviewId]);

  return {
    review,
    loading,
    error,
  };
}
