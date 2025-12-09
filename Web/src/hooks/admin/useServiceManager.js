import { useState, useEffect, useCallback } from "react";
import {
  getServicesData,
  createService,
  updateService,
  deleteService,
} from "../../api/admin/serviceManager";
import { handleApiResponse } from "../../utils/apiHelper";

export const useServiceManager = () => {
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchServices = useCallback(
    async (searchTerm = search) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getServicesData({
          page,
          limit,
          search: searchTerm,
        });

        if (response?.success) {
          setServices(response.data.items || []);
          setTotal(response.data.total || 0);
          setPage(response.data.page || 1);
          setLimit(response.data.limit || 10);
        } else {
          throw new Error(response?.message || "Lỗi khi tải dữ liệu");
        }
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, search]
  );

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

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
    fetchServices();
  }, [fetchServices]);

  const handleCreateService = useCallback(
    async (data) => {
      try {
        const response = await createService(data);
        const success = handleApiResponse(
          response,
          "Thêm dịch vụ thành công!",
          "Thêm dịch vụ thất bại!"
        );

        if (success) {
          await fetchServices();
        }

        return success;
      } catch (error) {
        console.error("Error creating service:", error);
        handleApiResponse(
          { success: false, message: error.message },
          null,
          "Thêm dịch vụ thất bại!"
        );
        return false;
      }
    },
    [fetchServices]
  );

  const handleUpdateService = useCallback(
    async (id, data) => {
      try {
        const response = await updateService(id, data);
        const success = handleApiResponse(
          response,
          "Cập nhật dịch vụ thành công!",
          "Cập nhật dịch vụ thất bại!"
        );

        if (success) {
          await fetchServices();
        }

        return success;
      } catch (error) {
        console.error("Error updating service:", error);
        handleApiResponse(
          { success: false, message: error.message },
          null,
          "Cập nhật dịch vụ thất bại!"
        );
        return false;
      }
    },
    [fetchServices]
  );

  const handleDeleteService = useCallback(
    async (id) => {
      try {
        const response = await deleteService(id);
        const success = handleApiResponse(
          response,
          "Xóa dịch vụ thành công!",
          "Xóa dịch vụ thất bại!"
        );

        if (success) {
          await fetchServices();
        }

        return success;
      } catch (error) {
        console.error("Error deleting service:", error);
        handleApiResponse(
          { success: false, message: error.message },
          null,
          "Xóa dịch vụ thất bại!"
        );
        return false;
      }
    },
    [fetchServices]
  );

  return {
    services,
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
    createService: handleCreateService,
    updateService: handleUpdateService,
    deleteService: handleDeleteService,
  };
};
