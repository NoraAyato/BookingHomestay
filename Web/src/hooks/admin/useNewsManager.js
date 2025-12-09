import { useState, useCallback, useEffect } from "react";
import {
  getAdminNews,
  getNewsStats,
  deleteNews,
  createNews,
  updateNews,
} from "../../api/admin/newsManager";
import { handleApiResponse } from "../../utils/apiHelper";

/**
 * Custom hook để quản lý tin tức trong admin panel
 * Hỗ trợ tìm kiếm, lọc theo status, category, khoảng ngày, phân trang
 */
export function useAdminNews(initialPage = 1, pageSize = 5) {
  const [news, setNews] = useState([]);
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
    search: null,
    startDate: null,
    endDate: null,
    status: null,
    category: null,
  });

  // Fetch news
  const fetchNews = useCallback(
    async (page = 1, currentFilters) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAdminNews({
          page,
          size: pageSize,
          ...currentFilters,
        });

        if (response?.success && response?.data) {
          const { items, total, page: currentPage, limit } = response.data;

          setNews(items);
          setPagination({
            page: currentPage,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          });
        } else {
          setError(response?.message || "Không thể tải danh sách tin tức");
          setNews([]);
        }
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
        setNews([]);
        console.error("Error fetching admin news:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await getNewsStats();

      if (response?.success && response?.data) {
        setStats(response.data);
      } else {
        console.error("Failed to fetch news stats:", response?.message);
      }
    } catch (err) {
      console.error("Error fetching news stats:", err);
    }
  }, []);

  // Change page
  const changePage = useCallback(
    (page) => {
      setFilters((currentFilters) => {
        fetchNews(page, currentFilters);
        return currentFilters;
      });
    },
    [fetchNews]
  );

  // Update filters
  const updateFilters = useCallback(
    (newFilters) => {
      setFilters((prev) => {
        const updated = { ...prev, ...newFilters };
        // Reset về trang 1 khi filter thay đổi
        fetchNews(1, updated);
        return updated;
      });
    },
    [fetchNews]
  );

  // Delete news
  const handleDeleteNews = useCallback(
    async (newsId) => {
      try {
        const response = await deleteNews(newsId);

        const success = handleApiResponse(
          response,
          "Xóa tin tức thành công!",
          "Không thể xóa tin tức"
        );

        if (success) {
          // Refresh danh sách sau khi xóa thành công
          setFilters((currentFilters) => {
            setPagination((currentPagination) => {
              fetchNews(currentPagination.page, currentFilters);
              return currentPagination;
            });
            return currentFilters;
          });
          fetchStats();
          return { success: true, data: response.data };
        }
        return { success: false };
      } catch (err) {
        console.error("Error deleting news:", err);
        handleApiResponse(
          { success: false, message: err.message },
          null,
          "Có lỗi xảy ra khi xóa tin tức"
        );
        return { success: false };
      }
    },
    [fetchNews, fetchStats]
  );

  // Create news
  const handleCreateNews = useCallback(
    async (data) => {
      try {
        const response = await createNews(data);

        const success = handleApiResponse(
          response,
          "Tạo tin tức thành công!",
          "Không thể tạo tin tức"
        );

        if (success) {
          // Refresh danh sách sau khi tạo thành công
          fetchNews(1, filters);
          fetchStats();
          return { success: true, data: response.data };
        }
        return { success: false };
      } catch (err) {
        console.error("Error creating news:", err);
        handleApiResponse(
          { success: false, message: err.message },
          null,
          "Có lỗi xảy ra khi tạo tin tức"
        );
        return { success: false };
      }
    },
    [fetchNews, fetchStats, filters]
  );

  // Update news
  const handleUpdateNews = useCallback(
    async (newsId, data) => {
      try {
        const response = await updateNews(newsId, data);

        const success = handleApiResponse(
          response,
          "Cập nhật tin tức thành công!",
          "Không thể cập nhật tin tức"
        );

        if (success) {
          // Refresh danh sách sau khi cập nhật thành công
          setFilters((currentFilters) => {
            setPagination((currentPagination) => {
              fetchNews(currentPagination.page, currentFilters);
              return currentPagination;
            });
            return currentFilters;
          });
          fetchStats();
          return { success: true, data: response.data };
        }
        return { success: false };
      } catch (err) {
        console.error("Error updating news:", err);
        handleApiResponse(
          { success: false, message: err.message },
          null,
          "Có lỗi xảy ra khi cập nhật tin tức"
        );
        return { success: false };
      }
    },
    [fetchNews, fetchStats]
  );

  // Refetch data
  const refetch = useCallback(() => {
    setFilters((currentFilters) => {
      setPagination((currentPagination) => {
        fetchNews(currentPagination.page, currentFilters);
        return currentPagination;
      });
      return currentFilters;
    });
    fetchStats();
  }, [fetchNews, fetchStats]);

  // Initial fetch
  useEffect(() => {
    fetchNews(initialPage, {
      search: null,
      startDate: null,
      endDate: null,
      status: null,
      category: null,
    });
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    news,
    stats,
    loading,
    error,
    pagination,
    filters,
    setFilters: updateFilters,
    changePage,
    createNews: handleCreateNews,
    updateNews: handleUpdateNews,
    deleteNews: handleDeleteNews,
    refetch,
  };
}

/**
 * Hook để lấy chi tiết news (dự phòng cho tương lai)
 */
export function useNewsDetail(newsId) {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Implement when API is available
    setLoading(false);
  }, [newsId]);

  return {
    news,
    loading,
    error,
  };
}
