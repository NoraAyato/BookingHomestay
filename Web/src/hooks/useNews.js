import { useState, useCallback } from "react";
import { getNewsList, getNewsDetail } from "../api/news";
import { APICache } from "../utils/cache";

const CACHE_KEY_LIST = "news_list";
const CACHE_KEY_DETAIL = "news_detail_";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useNews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllNews = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const cacheKey = `${CACHE_KEY_LIST}_${JSON.stringify(params)}`;
      const cached = APICache.get(cacheKey);

      if (cached) {
        setLoading(false);
        return cached;
      }

      const response = await getNewsList(params);

      if (response.success) {
        APICache.set(cacheKey, response, CACHE_TTL);
      }

      return response;
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải tin tức");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getNewsById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const cacheKey = `${CACHE_KEY_DETAIL}${id}`;
      const cached = APICache.get(cacheKey);

      if (cached) {
        setLoading(false);
        return cached;
      }

      const response = await getNewsDetail(id);

      if (response.success) {
        APICache.set(cacheKey, response, CACHE_TTL);
      }

      return response;
    } catch (err) {
      setError(err.message || "Đã xảy ra lỗi khi tải chi tiết tin tức");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAllNews,
    getNewsById,
  };
}
