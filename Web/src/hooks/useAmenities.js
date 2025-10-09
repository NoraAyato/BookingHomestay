import { useState, useEffect, useCallback } from "react";
import { getAllAmenities } from "../api/amenities";
import { APICache } from "../utils/cache";
const CACHE_KEY_AMENITIES = "all_amenities";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache
// Hook lấy danh sách tiện ích (amenities) với caching
export function useAmenities() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchAmenities = useCallback(async (skipCache = false) => {
    setLoading(true);
    setError(null);
    try {
      if (!skipCache) {
        const cachedData = APICache.get(CACHE_KEY_AMENITIES);
        if (cachedData && Array.isArray(cachedData)) {
          setAmenities(cachedData);
          setLoading(false);
          return;
        }
      }
      const response = await getAllAmenities();
      if (response.success && Array.isArray(response.data)) {
        setAmenities(response.data);
        APICache.set(CACHE_KEY_AMENITIES, response.data, CACHE_TTL);
      } else {
        throw new Error(response.message || "Không thể lấy danh sách tiện ích");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải danh sách tiện ích");
      setAmenities([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchAmenities();
  }, [fetchAmenities]);
  return { amenities, loading, error, refetch: fetchAmenities };
}
