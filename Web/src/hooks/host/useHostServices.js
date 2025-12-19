import { useState, useEffect, useCallback } from "react";
import {
  getHostServices,
  createHostService,
  updateHostService,
  deleteHostService,
} from "../../api/host/services";
import { handleApiResponse } from "../../utils/apiHelper";

export const useHostServices = () => {
  // Services list state
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [homestayId, setHomestayId] = useState("");

  // Fetch services list
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHostServices({
        page,
        size,
        search,
        homestayId,
      });

      if (response?.success) {
        setServices(response.data.items || []);
        setTotal(response.data.total || 0);
        setPage(response.data.page || 1);
        setSize(response.data.limit || 6);
      } else {
        throw new Error(response?.message || "Lỗi khi tải dữ liệu dịch vụ");
      }
    } catch (err) {
      console.error("❌ [useHostServices] Error:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu dịch vụ");
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  }, [page, size, search, homestayId]);

  // Fetch services when filters change
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const refresh = useCallback(() => {
    fetchServices();
  }, [fetchServices]);

  // Create service
  const createService = useCallback(
    async (formData) => {
      try {
        const response = await createHostService(formData);

        const isSuccess = handleApiResponse(
          response,
          response?.message || "Thêm dịch vụ thành công!",
          "Có lỗi xảy ra khi thêm dịch vụ"
        );

        if (isSuccess) {
          await refresh();
        }

        return isSuccess;
      } catch (error) {
        console.error("Error creating service:", error);
        return false;
      }
    },
    [refresh]
  );

  // Update service
  const updateService = useCallback(
    async (serviceId, formData) => {
      try {
        const response = await updateHostService(serviceId, formData);

        const isSuccess = handleApiResponse(
          response,
          response?.message || "Cập nhật dịch vụ thành công",
          "Có lỗi xảy ra khi cập nhật dịch vụ"
        );

        if (isSuccess) {
          await refresh();
        }

        return isSuccess;
      } catch (error) {
        console.error("Error updating service:", error);
        return false;
      }
    },
    [refresh]
  );

  // Delete service
  const deleteService = useCallback(
    async (serviceId) => {
      try {
        const response = await deleteHostService(serviceId);

        const isSuccess = handleApiResponse(
          response,
          response?.message || "Xóa dịch vụ thành công!",
          "Có lỗi xảy ra khi xóa dịch vụ"
        );

        if (isSuccess) {
          await refresh();
        }

        return isSuccess;
      } catch (error) {
        console.error("Error deleting service:", error);
        return false;
      }
    },
    [refresh]
  );

  return {
    // Services
    services,
    page,
    size,
    total,
    loading,
    error,

    // Filters
    search,
    homestayId,
    setPage,
    setSize,
    setSearch,
    setHomestayId,

    // Actions
    refresh,
    createService,
    updateService,
    deleteService,
  };
};
