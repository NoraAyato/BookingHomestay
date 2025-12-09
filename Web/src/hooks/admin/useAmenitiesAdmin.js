import { useState, useEffect, useCallback } from "react";
import {
  getAmenitiesData,
  createAmenity,
  updateAmenity,
  deleteAmenity,
} from "../../api/admin/amenitiesManager";
import { handleApiResponse } from "../../utils/apiHelper";

export const useAmenitiesManager = () => {
  const [amenities, setAmenities] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchAmenities = useCallback(
    async (searchTerm = search) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAmenitiesData({
          page,
          limit,
          search: searchTerm,
        });

        if (response?.success) {
          setAmenities(response.data.items || []);
          setTotal(response.data.total || 0);
          setPage(response.data.page || 1);
          setLimit(response.data.limit || 10);
        } else {
          throw new Error(response?.message || "Lỗi khi tải dữ liệu");
        }
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
        console.error("Error fetching amenities:", err);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search]
  );

  useEffect(() => {
    fetchAmenities();
  }, [fetchAmenities]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    setSearch(searchTerm);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    fetchAmenities();
  }, [fetchAmenities]);

  const handleCreateAmenity = useCallback(
    async (data) => {
      try {
        const response = await createAmenity(data);
        const success = handleApiResponse(
          response,
          "Thêm tiện nghi thành công!",
          "Thêm tiện nghi thất bại!"
        );

        if (success) {
          await fetchAmenities();
        }

        return success;
      } catch (error) {
        console.error("Error creating amenity:", error);
        handleApiResponse(
          { success: false, message: error.message },
          null,
          "Thêm tiện nghi thất bại!"
        );
        return false;
      }
    },
    [fetchAmenities]
  );

  const handleUpdateAmenity = useCallback(
    async (id, data) => {
      try {
        const response = await updateAmenity(id, data);
        const success = handleApiResponse(
          response,
          "Cập nhật tiện nghi thành công!",
          "Cập nhật tiện nghi thất bại!"
        );

        if (success) {
          await fetchAmenities();
        }

        return success;
      } catch (error) {
        console.error("Error updating amenity:", error);
        handleApiResponse(
          { success: false, message: error.message },
          null,
          "Cập nhật tiện nghi thất bại!"
        );
        return false;
      }
    },
    [fetchAmenities]
  );

  const handleDeleteAmenity = useCallback(
    async (id) => {
      try {
        const response = await deleteAmenity(id);
        const success = handleApiResponse(
          response,
          "Xóa tiện nghi thành công!",
          "Xóa tiện nghi thất bại!"
        );

        if (success) {
          await fetchAmenities();
        }

        return success;
      } catch (error) {
        console.error("Error deleting amenity:", error);
        handleApiResponse(
          { success: false, message: error.message },
          null,
          "Xóa tiện nghi thất bại!"
        );
        return false;
      }
    },
    [fetchAmenities]
  );

  return {
    amenities,
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
    createAmenity: handleCreateAmenity,
    updateAmenity: handleUpdateAmenity,
    deleteAmenity: handleDeleteAmenity,
  };
};
