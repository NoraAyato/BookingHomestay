import { useState, useEffect, useCallback } from "react";
import {
  getRoomTypesData,
  createRoomType,
  updateRoomType,
  deleteRoomType,
} from "../../api/admin/roomTypeManager";
import { handleApiResponse } from "../../utils/apiHelper";

export const useRoomTypeManager = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchRoomTypes = useCallback(
    async (searchTerm = search) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRoomTypesData({
          page,
          limit,
          search: searchTerm,
        });

        if (response?.success) {
          setRoomTypes(response.data.items || []);
          setTotal(response.data.total || 0);
          setPage(response.data.page || 1);
          setLimit(response.data.limit || 10);
        } else {
          throw new Error(response?.message || "Lỗi khi tải dữ liệu");
        }
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
        console.error("Error fetching room types:", err);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search]
  );

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

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
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  const handleCreateRoomType = useCallback(
    async (data) => {
      try {
        const response = await createRoomType(data);
        const success = handleApiResponse(
          response,
          "Thêm loại phòng thành công!",
          "Thêm loại phòng thất bại!"
        );

        if (success) {
          await fetchRoomTypes();
        }

        return success;
      } catch (error) {
        console.error("Error creating room type:", error);
        handleApiResponse(
          { success: false, message: error.message },
          null,
          "Thêm loại phòng thất bại!"
        );
        return false;
      }
    },
    [fetchRoomTypes]
  );

  const handleUpdateRoomType = useCallback(
    async (id, data) => {
      try {
        const response = await updateRoomType(id, data);
        const success = handleApiResponse(
          response,
          "Cập nhật loại phòng thành công!",
          "Cập nhật loại phòng thất bại!"
        );

        if (success) {
          await fetchRoomTypes();
        }

        return success;
      } catch (error) {
        console.error("Error updating room type:", error);
        handleApiResponse(
          { success: false, message: error.message },
          null,
          "Cập nhật loại phòng thất bại!"
        );
        return false;
      }
    },
    [fetchRoomTypes]
  );

  const handleDeleteRoomType = useCallback(
    async (id) => {
      try {
        const response = await deleteRoomType(id);
        const success = handleApiResponse(
          response,
          "Xóa loại phòng thành công!",
          "Xóa loại phòng thất bại!"
        );

        if (success) {
          await fetchRoomTypes();
        }

        return success;
      } catch (error) {
        console.error("Error deleting room type:", error);
        handleApiResponse(
          { success: false, message: error.message },
          null,
          "Xóa loại phòng thất bại!"
        );
        return false;
      }
    },
    [fetchRoomTypes]
  );

  return {
    roomTypes,
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
    createRoomType: handleCreateRoomType,
    updateRoomType: handleUpdateRoomType,
    deleteRoomType: handleDeleteRoomType,
  };
};
