import { useState, useCallback, useEffect } from "react";
import {
  getHomestayServices,
  approveHomestayService,
  rejectHomestayService,
  getHomestayServiceStats,
} from "../../api/admin/serviceManager";
import { handleApiResponse } from "../../utils/apiHelper";

export const useHomestayServiceApproval = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState(null); // null = all, "PENDING", "APPROVED", "REJECTED"
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        search,
      };

      // Only add status if it's not null (all)
      if (statusFilter !== null) {
        params.status = statusFilter;
      }

      const response = await getHomestayServices(params);

      if (response?.success) {
        setServices(response.data.items || []);
        setTotal(response.data.total || 0);
      } else {
        throw new Error(response?.message || "Lỗi khi tải dữ liệu");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
      console.error("Error fetching homestay services:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, search]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getHomestayServiceStats();
      if (response?.success) {
        setStats({
          total: response.data.totalServices || 0,
          pending: response.data.pendingServices || 0,
          approved: response.data.approvedServices || 0,
          rejected: response.data.rejectedServices || 0,
        });
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    fetchStats();
  }, [fetchServices, fetchStats]);

  const handleApprove = useCallback(
    async (serviceId) => {
      try {
        const response = await approveHomestayService(serviceId);
        const success = handleApiResponse(
          response,
          "Duyệt dịch vụ thành công!",
          "Duyệt dịch vụ thất bại!"
        );

        if (success) {
          await fetchServices();
          await fetchStats();
        }

        return success;
      } catch (error) {
        console.error("Error approving service:", error);
        handleApiResponse(
          { success: false, message: error.message },
          null,
          "Duyệt dịch vụ thất bại!"
        );
        return false;
      }
    },
    [fetchServices, fetchStats]
  );

  const handleReject = useCallback(
    async (serviceId) => {
      try {
        const response = await rejectHomestayService(serviceId);
        const success = handleApiResponse(
          response,
          "Từ chối dịch vụ thành công!",
          "Từ chối dịch vụ thất bại!"
        );

        if (success) {
          await fetchServices();
          await fetchStats();
        }

        return success;
      } catch (error) {
        console.error("Error rejecting service:", error);
        handleApiResponse(
          { success: false, message: error.message },
          null,
          "Từ chối dịch vụ thất bại!"
        );
        return false;
      }
    },
    [fetchServices, fetchStats]
  );

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    setSearch(searchTerm);
    setPage(1);
  }, []);

  const handleStatusFilter = useCallback((status) => {
    setStatusFilter(status);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    fetchServices();
    fetchStats();
  }, [fetchServices, fetchStats]);

  return {
    services,
    loading,
    error,
    page,
    limit,
    total,
    stats,
    statusFilter,
    search,
    handlePageChange,
    handleSearch,
    handleStatusFilter,
    handleApprove,
    handleReject,
    refresh,
  };
};
