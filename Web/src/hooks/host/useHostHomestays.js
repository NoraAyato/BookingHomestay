import { useState, useEffect, useCallback } from "react";
import {
  getHomestayStats,
  getHostHomestays,
  getHostHomestaysSelectList,
  updateHostHomestay,
  deleteHostHomestay,
} from "../../api/host/homestays";
import { handleApiResponse } from "../../utils/apiHelper";

export const useHostHomestays = () => {
  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    totalRevenue: 0,
  });

  // Homestays list state
  const [homestays, setHomestays] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(4);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Select list state
  const [homestaysSelectList, setHomestaysSelectList] = useState([]);
  const [selectListLoading, setSelectListLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [locationId, setLocationId] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await getHomestayStats();
      if (response?.success) {
        setStats(
          response.data || {
            total: 0,
            active: 0,
            inactive: 0,
            totalRevenue: 0,
          }
        );
      }
    } catch (err) {
      console.error("Error fetching homestay stats:", err);
    }
  }, []);

  // Fetch homestays list
  const fetchHomestays = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHostHomestays({
        page,
        size,
        search,
        status,
        locationId,
        sortBy,
      });

      if (response?.success) {
        setHomestays(response.data.items || []);
        setTotal(response.data.total || 0);
        setPage(response.data.page || 1);
        setSize(response.data.limit || 4);
      } else {
        throw new Error(response?.message || "Lỗi khi tải dữ liệu homestay");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu homestay");
      console.error("Error fetching homestays:", err);
    } finally {
      setLoading(false);
    }
  }, [page, size, search, status, locationId, sortBy]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Fetch homestays when filters change
  useEffect(() => {
    fetchHomestays();
  }, [fetchHomestays]);

  // Fetch homestays select list
  const fetchHomestaysSelectList = useCallback(async () => {
    setSelectListLoading(true);
    try {
      const response = await getHostHomestaysSelectList();
      if (response?.success) {
        setHomestaysSelectList(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching homestays select list:", err);
    } finally {
      setSelectListLoading(false);
    }
  }, []);

  // Fetch select list on mount
  useEffect(() => {
    fetchHomestaysSelectList();
  }, [fetchHomestaysSelectList]);

  const refresh = useCallback(() => {
    fetchStats();
    fetchHomestays();
    fetchHomestaysSelectList();
  }, [fetchStats, fetchHomestays, fetchHomestaysSelectList]);

  // Update homestay
  const updateHomestay = useCallback(
    async (homestayId, formData) => {
      try {
        // Create FormData object for multipart upload
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("address", formData.address);
        data.append("locationId", formData.locationId);
        data.append("status", formData.status);

        // Only append image if a new one was selected
        if (formData.image) {
          data.append("image", formData.image);
        }

        // Debug: Log FormData contents
        console.log("=== FormData Debug ===");
        for (let [key, value] of data.entries()) {
          console.log(`${key}:`, value);
        }

        const response = await updateHostHomestay(homestayId, data);

        const isSuccess = handleApiResponse(
          response,
          response?.message || "Cập nhật homestay thành công",
          "Có lỗi xảy ra khi cập nhật homestay"
        );

        if (isSuccess) {
          // Refresh data after successful update
          await refresh();
        }

        return isSuccess;
      } catch (error) {
        console.error("Error updating homestay:", error);
        return false;
      }
    },
    [refresh]
  );

  // Delete homestay
  const deleteHomestay = useCallback(
    async (homestayId) => {
      try {
        const response = await deleteHostHomestay(homestayId);

        const isSuccess = handleApiResponse(
          response,
          response?.message || "Xóa homestay thành công!",
          "Có lỗi xảy ra khi xóa homestay"
        );

        if (isSuccess) {
          // Refresh data after successful delete
          await refresh();
        }

        return isSuccess;
      } catch (error) {
        console.error("Error deleting homestay:", error);
        return false;
      }
    },
    [refresh]
  );

  return {
    // Stats
    stats,

    // Homestays
    homestays,
    page,
    size,
    total,
    loading,
    error,

    // Select list
    homestaysSelectList,
    selectListLoading,

    // Filters
    search,
    status,
    locationId,
    sortBy,
    setPage,
    setSize,
    setSearch,
    setStatus,
    setLocationId,
    setSortBy,

    // Actions
    refresh,
    updateHomestay,
    deleteHomestay,
  };
};
