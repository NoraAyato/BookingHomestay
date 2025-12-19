import { useState, useCallback } from "react";
import {
  getPromotions,
  getPromotionStats,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../../api/host/promotions";
import { handleApiResponse } from "../../utils/apiHelper";

const usePromotionManager = () => {
  const [promotions, setPromotions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalUsage: 0,
    inactive: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch promotions với filters
  const fetchPromotions = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPromotions({
        search: params.search,
        page: params.page || 1,
        size: params.size || 5,
        startDate: params.startDate,
        endDate: params.endDate,
        type: params.type,
        status: params.status,
      });

      if (response?.success) {
        setPromotions(response.data.items || []);
        setPagination({
          page: response.data.page || 1,
          limit: response.data.limit || 5,
          total: response.data.total || 0,
        });
      } else {
        throw new Error(
          response?.message || "Không thể tải danh sách khuyến mãi"
        );
      }
    } catch (err) {
      setError(err.message || "Không thể tải danh sách khuyến mãi");
      console.error("Error fetching promotions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch promotion statistics
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await getPromotionStats();

      if (response?.success) {
        setStats(
          response.data || {
            total: 0,
            active: 0,
            totalUsage: 0,
            inactive: 0,
          }
        );
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Create promotion
  const handleCreatePromotion = useCallback(async (data) => {
    try {
      const response = await createPromotion(data);
      const isSuccess = handleApiResponse(
        response,
        response?.message || "Tạo khuyến mãi thành công",
        "Có lỗi xảy ra khi tạo khuyến mãi"
      );

      return { success: isSuccess, response };
    } catch (err) {
      console.error("Error creating promotion:", err);
      handleApiResponse(null, "", "Có lỗi xảy ra khi tạo khuyến mãi");
      return { success: false, error: err };
    }
  }, []);

  // Update promotion
  const handleUpdatePromotion = useCallback(async (id, data) => {
    try {
      const response = await updatePromotion(id, data);
      const isSuccess = handleApiResponse(
        response,
        response?.message || "Cập nhật khuyến mãi thành công",
        "Có lỗi xảy ra khi cập nhật khuyến mãi"
      );
      console.log("Create Promotion Response:", response);
      return { success: isSuccess, response };
    } catch (err) {
      console.error("Error updating promotion:", err);
      handleApiResponse(null, "", "Có lỗi xảy ra khi cập nhật khuyến mãi");
      return { success: false, error: err };
    }
  }, []);

  // Delete promotion
  const handleDeletePromotion = useCallback(async (id) => {
    try {
      const response = await deletePromotion(id);
      const isSuccess = handleApiResponse(
        response,
        response?.message || "Xóa khuyến mãi thành công",
        "Có lỗi xảy ra khi xóa khuyến mãi"
      );
      return { success: isSuccess, response };
    } catch (err) {
      console.error("Error deleting promotion:", err);
      handleApiResponse(null, "", "Có lỗi xảy ra khi xóa khuyến mãi");
      return { success: false, error: err };
    }
  }, []);

  return {
    promotions,
    stats,
    pagination,
    loading,
    statsLoading,
    error,
    fetchPromotions,
    fetchStats,
    createPromotion: handleCreatePromotion,
    updatePromotion: handleUpdatePromotion,
    deletePromotion: handleDeletePromotion,
  };
};

export default usePromotionManager;
