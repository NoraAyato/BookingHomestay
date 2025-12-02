import { useState, useEffect, useCallback } from "react";
import {
  getLocation,
  updateLocation,
  createLocation,
} from "../../api/admin/locationManager";

export const useLocationManager = () => {
  const [locations, setLocations] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchLocations = useCallback(
    async (searchTerm = search) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getLocation({
          page,
          limit,
          search: searchTerm,
        });

        if (response?.success) {
          setLocations(response.data.items || []);
          setTotal(response.data.total || 0);
          setPage(response.data.page || 1);
          setLimit(response.data.limit || 20);
        } else {
          throw new Error(response?.message || "Lỗi khi tải dữ liệu");
        }
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
        console.error("Error fetching locations:", err);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search]
  );

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset về trang 1 khi thay đổi limit
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    setSearch(searchTerm);
    setPage(1); // Reset về trang 1 khi tìm kiếm
  }, []);

  const refresh = useCallback(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleUpdateLocation = useCallback(
    async (locationId, data) => {
      try {
        const response = await updateLocation(locationId, data);
        if (response?.success) {
          // Refresh the list after successful update
          await fetchLocations();
          return { success: true, data: response.data };
        } else {
          throw new Error(response?.message || "Lỗi khi cập nhật khu vực");
        }
      } catch (err) {
        const errorMessage =
          err.message || "Đã xảy ra lỗi khi cập nhật khu vực";
        console.error("Error updating location:", err);
        throw new Error(errorMessage);
      }
    },
    [fetchLocations]
  );

  const handleCreateLocation = useCallback(
    async (data) => {
      try {
        const response = await createLocation(data);
        if (response?.success) {
          // Refresh the list after successful creation
          await fetchLocations();
          return { success: true, data: response.data };
        } else {
          throw new Error(response?.message || "Lỗi khi thêm khu vực");
        }
      } catch (err) {
        const errorMessage = err.message || "Đã xảy ra lỗi khi thêm khu vực";
        console.error("Error creating location:", err);
        throw new Error(errorMessage);
      }
    },
    [fetchLocations]
  );

  return {
    locations,
    page,
    limit,
    total,
    loading,
    error,
    search,
    setPage: handlePageChange,
    setLimit: handleLimitChange,
    setSearch: handleSearch,
    refresh,
    updateLocation: handleUpdateLocation,
    createLocation: handleCreateLocation,
  };
};
