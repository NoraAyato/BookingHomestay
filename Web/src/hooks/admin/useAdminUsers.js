import { useState, useCallback } from "react";
import {
  getUsers,
  getUserDetail,
  updateUserByAdmin,
  deleteUserByAdmin,
  updateUserStatus,
  updateUserRole,
  getAllRoles,
  getUserStats,
  getAllUsers,
} from "../../api/admin/userManager";
import { handleApiResponse } from "../../utils/apiHelper";

export default function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [loadingAllUsers, setLoadingAllUsers] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    search: "",
  });
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorStats, setErrorStats] = useState("");

  // Lấy danh sách roles
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAllRoles();
      if (handleApiResponse(res, null, "Lỗi khi lấy danh sách vai trò")) {
        setRoles(res.data || []);
      } else {
        setError(res.message || "Lỗi khi lấy danh sách vai trò");
      }
    } catch (err) {
      setError(err.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy danh sách user
  const fetchUsers = useCallback(
    async (params = {}) => {
      setLoading(true);
      setError("");
      try {
        const apiParams = {
          page: params.page || pagination.page,
          limit: params.limit || pagination.limit,
          role: params.role ?? filters.role,
          status: params.status ?? filters.status,
          search: params.search ?? filters.search,
        };
        const res = await getUsers(apiParams);
        if (res.success) {
          setUsers(
            res.data && Array.isArray(res.data.items) ? res.data.items : []
          );
          setPagination({
            page: res.data.page || 1,
            limit: res.data.limit || 5,
            total: res.data.total || 0,
            totalPages: Math.ceil(
              (res.data.total || 0) / (res.data.limit || 5)
            ),
          });
        } else {
          setError(res.message || "Lỗi khi lấy danh sách người dùng");
        }
      } catch (err) {
        setError(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.limit, filters]
  );

  // Xem chi tiết user
  const fetchUserDetail = useCallback(async (id) => {
    setLoading(true);
    setError("");
    try {
      const res = await getUserDetail(id);
      if (res.success) return res.data;
      setError(res.message || "Không lấy được thông tin user");
      return null;
    } catch (err) {
      setError(err.message || "Lỗi không xác định");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cập nhật user
  const updateUser = useCallback(
    async (id, data) => {
      setLoading(true);
      setError("");
      try {
        const res = await updateUserByAdmin(id, data);
        if (res.success) reloadData();
        else setError(res.message || "Cập nhật thất bại");
        return res;
      } catch (err) {
        setError(err.message || "Lỗi không xác định");
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  // Xóa user (set status = INACTIVE)
  const deleteUser = useCallback(
    async (id) => {
      setLoading(true);
      setError("");
      try {
        const res = await updateUserStatus(id, "INACTIVE");
        if (res.success) reloadData();
        else setError(res.message || "Xóa thất bại");
        return res;
      } catch (err) {
        setError(err.message || "Lỗi không xác định");
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  // Đổi trạng thái user
  const changeUserStatus = useCallback(
    async (id, status) => {
      setLoading(true);
      setError("");
      try {
        const res = await updateUserStatus(id, status);
        if (res.success) reloadData();
        else setError(res.message || "Cập nhật trạng thái thất bại");
        return res;
      } catch (err) {
        setError(err.message || "Lỗi không xác định");
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  // Cập nhật vai trò user
  const updateRole = useCallback(
    async (id, role) => {
      setLoading(true);
      setError("");
      try {
        console.log("Updating role for user ID:", id, "to role:", role);
        const res = await updateUserRole(id, role);
        if (
          handleApiResponse(
            res,
            "Cập nhật vai trò thành công",
            "Cập nhật vai trò thất bại"
          )
        ) {
          reloadData();
        } else {
          setError(res.message || "Cập nhật vai trò thất bại");
        }
        return res;
      } catch (err) {
        setError(err.message || "Lỗi không xác định");
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  // Cập nhật trạng thái user (alias for changeUserStatus)
  const updateStatus = useCallback(
    async (id, status) => {
      setLoading(true);
      setError("");
      try {
        console.log("Updating status for user ID:", id, "to status:", status);
        const res = await updateUserStatus(id, status);
        console.log("Update Status Response:", res);
        if (
          handleApiResponse(
            res,
            "Cập nhật trạng thái thành công",
            "Cập nhật trạng thái thất bại"
          )
        ) {
          reloadData();
        } else {
          setError(res.message || "Cập nhật trạng thái thất bại");
        }
        return res;
      } catch (err) {
        setError(err.message || "Lỗi không xác định");
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  // Lấy thống kê người dùng
  const fetchUserStats = useCallback(async () => {
    setLoadingStats(true);
    setErrorStats("");
    try {
      const res = await getUserStats();
      if (res.success && res.data) {
        setUserStats({
          total: Number(res.data.total) || 0,
          active: Number(res.data.active) || 0,
          inactive: Number(res.data.inactive) || 0,
        });
      } else {
        setErrorStats(res.message || "Lỗi khi lấy thống kê người dùng");
      }
    } catch (err) {
      setErrorStats(err.message || "Lỗi không xác định");
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Lấy tất cả người dùng (không phân trang)
  const fetchAllUsers = useCallback(async () => {
    setLoadingAllUsers(true);
    setError("");
    try {
      const res = await getAllUsers();
      if (res.success) {
        setAllUsers(Array.isArray(res.data) ? res.data : []);
      } else {
        setError(res.message || "Lỗi khi lấy danh sách người dùng");
      }
    } catch (err) {
      setError(err.message || "Lỗi không xác định");
    } finally {
      setLoadingAllUsers(false);
    }
  }, []);

  // Đổi filter
  const setUserFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };
  const reloadData = () => {
    // Reload data từ trang hiện tại với filters hiện tại
    fetchUsers({
      page: pagination.page,
      limit: pagination.limit,
      role: filters.role,
      status: filters.status,
      search: filters.search,
    });
    fetchUserStats();
  };
  return {
    roles,
    users,
    allUsers,
    pagination,
    loading,
    loadingAllUsers,
    error,
    filters,
    fetchRoles,
    fetchUsers,
    fetchAllUsers,
    fetchUserDetail,
    updateUser,
    deleteUser,
    changeUserStatus,
    updateRole,
    updateStatus,
    setUserFilters,
    userStats,
    loadingStats,
    errorStats,
    fetchUserStats,
  };
}
