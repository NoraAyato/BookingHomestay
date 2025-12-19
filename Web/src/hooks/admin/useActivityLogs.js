import { useState, useEffect, useCallback } from "react";
import { getActivityLogs } from "../../api/admin/activityLogs";
import { subscribe, unsubscribe, onStompConnected } from "../../api/socket";
import { handleApiResponse } from "../../utils/apiHelper";
import { exportActivityLogsToExcel } from "../../utils/excelExport";

/**
 * Custom hook for managing activity logs with filters and pagination
 * @param {Object} initialFilters - Initial filter values
 * @param {boolean} enableRealtime - Enable WebSocket real-time updates (default: false)
 * @returns {Object} Activity logs state and methods
 */
export const useActivityLogs = (
  initialFilters = {},
  enableRealtime = false
) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [newActivitiesCount, setNewActivitiesCount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    limit: 20,
    activityType: "",
    action: "",
    userId: "",
    entityType: "",
    startDate: "",
    endDate: "",
    keyword: "",
    ...initialFilters,
  });

  /**
   * Fetch activity logs
   * @param {boolean} loadMore - Whether to load more (append) or refresh (replace)
   */
  const fetchActivities = useCallback(
    async (loadMore = false) => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          ...filters,
          cursor: loadMore ? cursor : null,
        };

        const response = await getActivityLogs(params);

        if (
          handleApiResponse(response, null, "Không thể tải dữ liệu hoạt động")
        ) {
          const {
            activities: newActivities,
            cursor: newCursor,
            total: totalCount,
          } = response.data;

          if (loadMore) {
            setActivities((prev) => [...prev, ...newActivities]);
          } else {
            setActivities(newActivities);
          }

          setCursor(newCursor?.next || null);
          setHasMore(newCursor?.hasMore || false);
          setTotal(totalCount || 0);
        } else {
          setError(response.message || "Không thể tải dữ liệu hoạt động");
        }
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
        console.error("Error fetching activity logs:", err);
      } finally {
        setLoading(false);
      }
    },
    [filters, cursor]
  );

  /**
   * Load more activities (pagination)
   */
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchActivities(true);
    }
  }, [loading, hasMore, fetchActivities]);

  /**
   * Refresh activities (reset pagination)
   */
  const refresh = useCallback(() => {
    setCursor(null);
    setActivities([]);
    fetchActivities(false);
  }, [fetchActivities]);

  /**
   * Update filters and refresh
   */
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    setCursor(null);
    setActivities([]);
  }, []);

  /**
   * Reset filters
   */
  const resetFilters = useCallback(() => {
    setFilters({
      limit: 20,
      activityType: "",
      action: "",
      userId: "",
      entityType: "",
      startDate: "",
      endDate: "",
      keyword: "",
    });
    setCursor(null);
    setActivities([]);
  }, []);

  /**
   * Search by keyword
   */
  const search = useCallback(
    (keyword) => {
      updateFilters({ keyword });
    },
    [updateFilters]
  );

  /**
   * Handle real-time activity update
   */
  const handleNewActivity = useCallback(
    (newActivity) => {
      // Add to beginning of list
      setActivities((prev) => [newActivity, ...prev]);

      // Increment total count
      setTotal((prev) => prev + 1);

      // Increment new activities counter if not on first page
      if (cursor !== null) {
        setNewActivitiesCount((prev) => prev + 1);
      }
    },
    [cursor]
  );

  /**
   * Clear new activities counter (call when user refreshes)
   */
  const clearNewActivitiesCount = useCallback(() => {
    setNewActivitiesCount(0);
  }, []);

  /**
   * Xuất báo cáo activity logs
   * @param {number} days - Số ngày muốn xuất (0 = hôm nay, 7 = 7 ngày, etc.)
   */
  const exportActivities = useCallback(
    async (days = 7) => {
      setIsExporting(true);
      try {
        // Calculate date range
        const today = new Date();

        let startDateObj, endDateObj;
        if (days === 0) {
          // Hôm nay - từ 00:00:00 đến 23:59:59
          startDateObj = new Date(today.setHours(0, 0, 0, 0));
          endDateObj = new Date(today.setHours(23, 59, 59, 999));
        } else {
          // N days ago
          endDateObj = new Date();
          endDateObj.setHours(23, 59, 59, 999);

          startDateObj = new Date();
          startDateObj.setDate(today.getDate() - days);
          startDateObj.setHours(0, 0, 0, 0);
        }

        // Convert to ISO DateTime format (YYYY-MM-DDTHH:mm:ss)
        const startDate = startDateObj.toISOString().slice(0, 19);
        const endDate = endDateObj.toISOString().slice(0, 19);

        // Fetch all activities - chỉ gửi limit và date range
        const response = await getActivityLogs({
          limit: 1000,
          startDate: startDate,
          endDate: endDate,
        });

        if (response.success && response.data.activities.length > 0) {
          exportActivityLogsToExcel(response.data.activities);
          handleApiResponse(
            { success: true },
            `Đã xuất ${response.data.activities.length} hoạt động thành công`,
            ""
          );
          return { success: true, count: response.data.activities.length };
        } else {
          handleApiResponse(
            { success: false },
            "",
            "Không có dữ liệu để xuất trong khoảng thời gian này"
          );
          return { success: false, message: "Không có dữ liệu" };
        }
      } catch (error) {
        console.error("Error exporting activities:", error);
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

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchActivities(false);
  }, [filters]); // Only depend on filters, not fetchActivities to avoid infinite loop

  // Subscribe to WebSocket for real-time updates
  useEffect(() => {
    if (!enableRealtime) {
      return;
    }

    // Setup subscription function
    const setupSubscription = () => {
      subscribe("/topic/admin/activities/new", handleNewActivity);
    };

    // Register callback để setup subscription khi STOMP connected
    onStompConnected(setupSubscription);

    // Cleanup
    return () => {
      unsubscribe("/topic/admin/activities/new");
    };
  }, [enableRealtime, handleNewActivity]);

  return {
    // Data
    activities,
    loading,
    error,
    hasMore,
    total,
    filters,
    newActivitiesCount,
    isExporting,

    // Methods
    loadMore,
    refresh,
    updateFilters,
    resetFilters,
    search,
    clearNewActivitiesCount,
    exportActivities,
  };
};

export default useActivityLogs;
