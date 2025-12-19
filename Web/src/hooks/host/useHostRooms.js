import { useState, useEffect, useCallback } from "react";
import {
  getHostRooms,
  createHostRoom,
  updateHostRoom,
  deleteHostRoom,
} from "../../api/host/rooms";
import { handleApiResponse } from "../../utils/apiHelper";

export const useHostRooms = () => {
  // Rooms list state
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [homestayId, setHomestayId] = useState("");
  const [roomTypeId, setRoomTypeId] = useState("");

  // Fetch rooms list
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHostRooms({
        page,
        size,
        search,
        status,
        homestayId,
        roomTypeId,
      });

      if (response?.success) {
        setRooms(response.data.items || []);
        setTotal(response.data.total || 0);
        setPage(response.data.page || 1);
        setSize(response.data.limit || 6);
      } else {
        throw new Error(response?.message || "Lỗi khi tải dữ liệu phòng");
      }
    } catch (err) {
      console.error("❌ [useHostRooms] Error:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu phòng");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  }, [page, size, search, status, homestayId, roomTypeId]);

  // Fetch rooms when filters change
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const refresh = useCallback(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Create room
  const createRoom = useCallback(
    async (formData) => {
      try {
        const response = await createHostRoom(formData);

        const isSuccess = handleApiResponse(
          response,
          response?.message || "Thêm phòng thành công!",
          "Có lỗi xảy ra khi thêm phòng"
        );

        if (isSuccess) {
          await refresh();
        }

        return isSuccess;
      } catch (error) {
        console.error("Error creating room:", error);
        return false;
      }
    },
    [refresh]
  );

  // Update room
  const updateRoom = useCallback(
    async (roomId, formData) => {
      try {
        const response = await updateHostRoom(roomId, formData);

        const isSuccess = handleApiResponse(
          response,
          response?.message || "Cập nhật phòng thành công",
          "Có lỗi xảy ra khi cập nhật phòng"
        );

        if (isSuccess) {
          await refresh();
        }

        return isSuccess;
      } catch (error) {
        console.error("Error updating room:", error);
        return false;
      }
    },
    [refresh]
  );

  // Delete room
  const deleteRoom = useCallback(
    async (roomId) => {
      try {
        const response = await deleteHostRoom(roomId);

        const isSuccess = handleApiResponse(
          response,
          response?.message || "Xóa phòng thành công!",
          "Có lỗi xảy ra khi xóa phòng"
        );

        if (isSuccess) {
          await refresh();
        }

        return isSuccess;
      } catch (error) {
        console.error("Error deleting room:", error);
        return false;
      }
    },
    [refresh]
  );

  return {
    // Rooms
    rooms,
    page,
    size,
    total,
    loading,
    error,

    // Filters
    search,
    status,
    homestayId,
    roomTypeId,
    setPage,
    setSize,
    setSearch,
    setStatus,
    setHomestayId,
    setRoomTypeId,

    // Actions
    refresh,
    createRoom,
    updateRoom,
    deleteRoom,
  };
};
