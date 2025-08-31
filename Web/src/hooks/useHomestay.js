import { useState, useEffect, useCallback } from "react";
import { getFeaturedHomestays } from "../api/homestay";
import { APICache } from "../utils/cache";

const CACHE_KEY_FEATURED = "featured_homestays";
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache

export function useFeaturedHomestays() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHomestays = useCallback(async (skipCache = false) => {
    setLoading(true);
    setError(null);

    try {
      if (!skipCache) {
        const cachedData = APICache.get(CACHE_KEY_FEATURED);
        if (cachedData) {
          if (Array.isArray(cachedData)) {
            setData(cachedData);
            setLoading(false);
            return;
          } else if (cachedData && Array.isArray(cachedData)) {
            setData(cachedData);
            setLoading(false);
            return;
          } else {
          }
        }
      }

      // Fetch from API if not in cache or cache skipped
      const response = await getFeaturedHomestays();

      let homestayArr = [];
      if (response.success) {
        if (Array.isArray(response.data)) {
          homestayArr = response.data;
        } else {
          throw new Error("Dữ liệu không đúng định dạng mảng");
        }
        setData(homestayArr);
        APICache.set(CACHE_KEY_FEATURED, homestayArr, CACHE_TTL);
      } else {
        throw new Error(response.message || "Failed to fetch homestays");
      }
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu homestay");
      // If API fails, attempt to use stale cache as fallback
      const cachedData = APICache.get(CACHE_KEY_FEATURED, true); // Get even if expired
      if (cachedData && Array.isArray(cachedData)) {
        setData(cachedData);
      } else {
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchHomestays();
  }, [fetchHomestays]);

  const refetch = useCallback(() => {
    return fetchHomestays(true);
  }, [fetchHomestays]);

  return { data, loading, error, refetch };
}
