import { useState, useCallback, useEffect } from "react";
import {
  getAdminTopics,
  getTopicStats,
  deleteTopic,
  createTopic,
  updateTopic,
} from "../../api/admin/topicManager";
import { handleApiResponse } from "../../utils/apiHelper";

/**
 * Custom hook để quản lý chủ đề/danh mục bài viết trong admin panel
 * Hỗ trợ tìm kiếm, phân trang
 */
export function useAdminTopics(initialPage = 1, pageSize = 5) {
  const [topics, setTopics] = useState([]);
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
  });

  // Fetch topics
  const fetchTopics = useCallback(
    async (page = 1, currentFilters) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAdminTopics({
          page,
          size: pageSize,
          ...currentFilters,
        });

        if (response?.success && response?.data) {
          const { items, total, page: currentPage, limit } = response.data;

          // Transform backend data to UI format
          const transformedTopics = items.map((item) => ({
            ...item,
            isActive: item.active, // Backend uses 'active', UI uses 'isActive'
          }));

          setTopics(transformedTopics);
          setPagination({
            page: currentPage,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          });
        } else {
          setError(response?.message || "Không thể tải danh sách chủ đề");
          setTopics([]);
        }
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
        setTopics([]);
        console.error("Error fetching admin topics:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await getTopicStats();

      if (response?.success && response?.data) {
        // Transform backend stats to UI format
        const transformedStats = {
          totalTopics: response.data.total,
          activeTopics: response.data.active,
          inactiveTopics: response.data.inactive,
          totalArticles: response.data.totalArticles,
        };
        setStats(transformedStats);
      } else {
        console.error("Failed to fetch topic stats:", response?.message);
      }
    } catch (err) {
      console.error("Error fetching topic stats:", err);
    }
  }, []);

  // Change page
  const changePage = useCallback(
    (page) => {
      setFilters((currentFilters) => {
        fetchTopics(page, currentFilters);
        return currentFilters;
      });
    },
    [fetchTopics]
  );

  // Update filters
  const updateFilters = useCallback(
    (newFilters) => {
      setFilters((prev) => {
        const updated = { ...prev, ...newFilters };
        // Reset về trang 1 khi filter thay đổi
        fetchTopics(1, updated);
        return updated;
      });
    },
    [fetchTopics]
  );

  // Delete topic
  const handleDeleteTopic = useCallback(
    async (topicId) => {
      try {
        const response = await deleteTopic(topicId);

        const success = handleApiResponse(
          response,
          "Xóa chủ đề thành công!",
          "Không thể xóa chủ đề"
        );

        if (success) {
          // Refresh danh sách sau khi xóa thành công
          setFilters((currentFilters) => {
            setPagination((currentPagination) => {
              fetchTopics(currentPagination.page, currentFilters);
              return currentPagination;
            });
            return currentFilters;
          });
          fetchStats();
          return { success: true, data: response.data };
        }
        return { success: false };
      } catch (err) {
        console.error("Error deleting topic:", err);
        handleApiResponse(
          { success: false, message: err.message },
          null,
          "Có lỗi xảy ra khi xóa chủ đề"
        );
        return { success: false };
      }
    },
    [fetchTopics, fetchStats]
  );

  // Create topic
  const handleCreateTopic = useCallback(
    async (data) => {
      try {
        const response = await createTopic(data);

        const success = handleApiResponse(
          response,
          "Thêm chủ đề mới thành công!",
          "Không thể thêm chủ đề"
        );

        if (success) {
          // Refresh danh sách sau khi tạo thành công
          fetchTopics(1, filters);
          fetchStats();
          return { success: true, data: response.data };
        }
        return { success: false };
      } catch (err) {
        console.error("Error creating topic:", err);
        handleApiResponse(
          { success: false, message: err.message },
          null,
          "Có lỗi xảy ra khi thêm chủ đề"
        );
        return { success: false };
      }
    },
    [fetchTopics, fetchStats, filters]
  );

  // Update topic
  const handleUpdateTopic = useCallback(
    async (topicId, data) => {
      try {
        const response = await updateTopic(topicId, data);

        const success = handleApiResponse(
          response,
          "Cập nhật chủ đề thành công!",
          "Không thể cập nhật chủ đề"
        );

        if (success) {
          // Refresh danh sách sau khi cập nhật thành công
          setFilters((currentFilters) => {
            setPagination((currentPagination) => {
              fetchTopics(currentPagination.page, currentFilters);
              return currentPagination;
            });
            return currentFilters;
          });
          fetchStats();
          return { success: true, data: response.data };
        }
        return { success: false };
      } catch (err) {
        console.error("Error updating topic:", err);
        handleApiResponse(
          { success: false, message: err.message },
          null,
          "Có lỗi xảy ra khi cập nhật chủ đề"
        );
        return { success: false };
      }
    },
    [fetchTopics, fetchStats]
  );

  // Refetch data
  const refetch = useCallback(() => {
    setFilters((currentFilters) => {
      setPagination((currentPagination) => {
        fetchTopics(currentPagination.page, currentFilters);
        return currentPagination;
      });
      return currentFilters;
    });
    fetchStats();
  }, [fetchTopics, fetchStats]);

  // Initial fetch
  useEffect(() => {
    fetchTopics(initialPage, {
      search: null,
    });
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    topics,
    stats,
    loading,
    error,
    pagination,
    filters,
    setFilters: updateFilters,
    changePage,
    createTopic: handleCreateTopic,
    updateTopic: handleUpdateTopic,
    deleteTopic: handleDeleteTopic,
    refetch,
  };
}

/**
 * Hook để lấy chi tiết topic (dự phòng cho tương lai)
 */
export function useTopicDetail(topicId) {
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Implement when API is available
    setLoading(false);
  }, [topicId]);

  return {
    topic,
    loading,
    error,
  };
}
