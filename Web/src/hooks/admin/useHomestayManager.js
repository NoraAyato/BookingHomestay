import { useState, useEffect, useCallback } from "react";
import {
  getHomestays,
  updateHomestay,
  addHomestay,
  deleteHomestay,
} from "../../api/admin/homestayManager";
import { handleApiResponse } from "../../utils/apiHelper";

export const useHomestayManager = () => {
  const [homestays, setHomestays] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [minPrice, setMinPrice] = useState(null);
  const [minRoom, setMinRoom] = useState(null);
  const [locationId, setLocationId] = useState("");
  const [rating, setRating] = useState(null);

  const fetchHomestays = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHomestays({
        page,
        limit,
        search,
        status,
        minPrice,
        minRoom,
        locationId,
        rating,
      });

      if (response?.success) {
        setHomestays(response.data.items || []);
        setTotal(response.data.total || 0);
        setPage(response.data.page || 1);
        setLimit(response.data.limit || 6);
      } else {
        throw new Error(response?.message || "Lỗi khi tải dữ liệu homestay");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu homestay");
      console.error("Error fetching homestays:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, minPrice, minRoom, locationId, rating]);

  useEffect(() => {
    fetchHomestays();
  }, [fetchHomestays]);

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

  const handleStatusChange = useCallback((newStatus) => {
    setStatus(newStatus);
    setPage(1);
  }, []);

  const handleMinPriceChange = useCallback((price) => {
    setMinPrice(price);
    setPage(1);
  }, []);

  const handleMinRoomChange = useCallback((room) => {
    setMinRoom(room);
    setPage(1);
  }, []);

  const handleLocationIdChange = useCallback((locId) => {
    setLocationId(locId);
    setPage(1);
  }, []);

  const handleRatingChange = useCallback((rat) => {
    setRating(rat);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    fetchHomestays();
  }, [fetchHomestays]);

  const resetFilters = useCallback(() => {
    setSearch("");
    setStatus("");
    setMinPrice(null);
    setMinRoom(null);
    setLocationId("");
    setRating(null);
    setPage(1);
  }, []);

  const updateHomestayData = useCallback(
    async (homestayId, data) => {
      try {
        const response = await updateHomestay(homestayId, data);
        const success = handleApiResponse(
          response,
          "Cập nhật homestay thành công!",
          "Cập nhật homestay thất bại!"
        );

        if (success) {
          // Refresh data after successful update
          await fetchHomestays();
        }

        return success;
      } catch (error) {
        console.error("Error updating homestay:", error);
        handleApiResponse(
          { success: false, message: error.message },
          null,
          "Cập nhật homestay thất bại!"
        );
        return false;
      }
    },
    [fetchHomestays]
  );

  const addHomestayData = useCallback(
    async (data) => {
      try {
        const response = await addHomestay(data);
        const success = handleApiResponse(
          response,
          "Thêm homestay thành công!",
          "Thêm homestay thất bại!"
        );

        if (success) {
          // Refresh data after successful add
          await fetchHomestays();
        }

        return success;
      } catch (error) {
        console.error("Error adding homestay:", error);
        handleApiResponse(
          { success: false, message: error.message },
          null,
          "Thêm homestay thất bại!"
        );
        return false;
      }
    },
    [fetchHomestays]
  );

  const deleteHomestayData = useCallback(
    async (homestayId) => {
      try {
        const response = await deleteHomestay(homestayId);
        const success = handleApiResponse(
          response,
          "Xóa homestay thành công!",
          "Xóa homestay thất bại!"
        );

        if (success) {
          // Refresh data after successful delete
          await fetchHomestays();
        }

        return success;
      } catch (error) {
        console.error("Error deleting homestay:", error);
        handleApiResponse(
          { success: false, message: error.message },
          null,
          "Xóa homestay thất bại!"
        );
        return false;
      }
    },
    [fetchHomestays]
  );

  return {
    homestays,
    page,
    limit,
    total,
    loading,
    error,
    search,
    status,
    minPrice,
    minRoom,
    locationId,
    rating,
    setPage: handlePageChange,
    setLimit: handleLimitChange,
    setSearch: handleSearch,
    setStatus: handleStatusChange,
    setMinPrice: handleMinPriceChange,
    setMinRoom: handleMinRoomChange,
    setLocationId: handleLocationIdChange,
    setRating: handleRatingChange,
    refresh,
    resetFilters,
    updateHomestay: updateHomestayData,
    addHomestay: addHomestayData,
    deleteHomestay: deleteHomestayData,
  };
};
