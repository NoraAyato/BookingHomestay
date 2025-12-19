import { useState, useEffect, useCallback } from "react";
import {
  getPromotionStats,
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../../api/admin/promotionManager";
import { getImageUrl } from "../../utils/imageUrl";
import { handleApiResponse } from "../../utils/apiHelper";
export const usePromotionManager = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalUsage: 0,
    inactive: 0,
  });
  const [promotions, setPromotions] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
  });
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await getPromotionStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error("Error fetching promotion stats:", err);
      setError(err.message || "Không thể tải thống kê khuyến mãi");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch promotions list
  const fetchPromotions = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPromotions(params);

      if (response.success && response.data) {
        // Transform API data to match component structure
        const transformedData = response.data.items.map((promo) => ({
          id: promo.id,
          name: promo.title,
          minNights: promo.minNights || 0,
          bookedTimes: promo.bookedTimes || 0,
          image: getImageUrl(promo.image),
          code: promo.id,
          type: promo.type.toLowerCase(), // "percentage" or "fixed"
          value: promo.value,
          description: promo.description,
          status: promo.status.toLowerCase(), // "active" or "inactive"
          startDate: promo.startDate,
          endDate: promo.endDate,
          usageLimit: promo.usageLimit || 0,
          usageCount: promo.usageCount || 0,
          minBookingValue: promo.minBookingValue || 0,
          createdBy: promo.createdBy,
          createdDate: promo.createdDate,
        }));

        setPromotions(transformedData);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
        });
      }
    } catch (err) {
      console.error("Error fetching promotions:", err);
      setError(err.message || "Không thể tải danh sách khuyến mãi");
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add promotion
  const addPromotionData = useCallback(
    async (data) => {
      try {
        setLoading(true);
        setError(null);
        const response = await createPromotion(data);

        const success = handleApiResponse(
          response,
          "Tạo khuyến mãi thành công!",
          "Không thể tạo khuyến mãi"
        );

        if (success) {
          // Refresh stats and promotions list
          await fetchStats();
          return { success: true, data: response.data };
        }
        return { success: false };
      } catch (err) {
        console.error("Error adding promotion:", err);
        setError(err.message || "Không thể tạo khuyến mãi");
        handleApiResponse(
          { success: false, message: err.message },
          null,
          "Không thể tạo khuyến mãi"
        );
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [fetchStats]
  );

  // Update promotion
  const updatePromotionData = useCallback(
    async (id, data) => {
      try {
        setLoading(true);
        setError(null);
        const response = await updatePromotion(id, data);

        const success = handleApiResponse(
          response,
          "Cập nhật khuyến mãi thành công!",
          "Không thể cập nhật khuyến mãi"
        );

        if (success) {
          // Refresh stats and promotions list
          await fetchStats();
          return { success: true, data: response.data };
        }
        return { success: false };
      } catch (err) {
        console.error("Error updating promotion:", err);
        setError(err.message || "Không thể cập nhật khuyến mãi");
        handleApiResponse(
          { success: false, message: err.message },
          null,
          "Không thể cập nhật khuyến mãi"
        );
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [fetchStats]
  );

  // Delete promotion
  const deletePromotionData = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        const response = await deletePromotion(id);

        const success = handleApiResponse(
          response,
          "Xóa khuyến mãi thành công!",
          "Không thể xóa khuyến mãi"
        );

        if (success) {
          // Refresh stats
          await fetchStats();
          return { success: true };
        }
        return { success: false };
      } catch (err) {
        console.error("Error deleting promotion:", err);
        setError(err.message || "Không thể xóa khuyến mãi");
        handleApiResponse(
          { success: false, message: err.message },
          null,
          "Không thể xóa khuyến mãi"
        );
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [fetchStats]
  );

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    promotions,
    pagination,
    loading,
    statsLoading,
    error,
    fetchPromotions,
    refetchStats: fetchStats,
    addPromotion: addPromotionData,
    updatePromotion: updatePromotionData,
    deletePromotion: deletePromotionData,
  };
};
