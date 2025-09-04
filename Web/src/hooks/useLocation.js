import { useState, useEffect, useCallback, cache } from "react";
import { APICache } from "../utils/cache";
import {
  getTop5Location,
  getAllLocation,
  searchLocationByPrefix,
} from "../api/location";

const CACHE_KEY_TOP = "location_top5";
const CACHE_KEY_ALL = "location_all";
const CACHE_TTL = 15 * 60 * 1000;
const CACHE_KEY_PREFIX = "location_prefix_";

export function useLocationData() {
  const [topLocations, setTopLocations] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [loadingTop, setLoadingTop] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [errorTop, setErrorTop] = useState(null);
  const [errorAll, setErrorAll] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState(null);

  // Fetch top 5 location
  const fetchTop5Locations = useCallback(async (skipCache = false) => {
    setLoadingTop(true);
    setErrorTop(null);
    try {
      if (!skipCache) {
        const cached = APICache.get(CACHE_KEY_TOP);
        if (cached && Array.isArray(cached)) {
          setTopLocations(cached);
          setLoadingTop(false);
          return;
        }
      }
      const response = await getTop5Location();

      if (response.success && Array.isArray(response.data)) {
        setTopLocations(response.data);
        APICache.set(CACHE_KEY_TOP, response.data, CACHE_TTL);
      } else {
        throw new Error(
          response.message || "Không thể lấy danh sách địa điểm top 5"
        );
      }
    } catch (err) {
      setErrorTop("Đã xảy ra lỗi khi tải địa điểm top 5");
      const cached = APICache.get(CACHE_KEY_TOP, true);
      if (cached && Array.isArray(cached)) {
        setTopLocations(cached);
      }
    } finally {
      setLoadingTop(false);
    }
  }, []);

  // Fetch all location
  const fetchAllLocations = useCallback(async (skipCache = false) => {
    setLoadingAll(true);
    setErrorAll(null);
    try {
      if (!skipCache) {
        const cached = APICache.get(CACHE_KEY_ALL);
        if (cached && Array.isArray(cached)) {
          setAllLocations(cached);
          setLoadingAll(false);
          return;
        }
      }
      const response = await getAllLocation();
      if (response.success && Array.isArray(response.data)) {
        setAllLocations(response.data);
        APICache.set(CACHE_KEY_ALL, response.data, CACHE_TTL);
      } else {
        throw new Error(response.message || "Không thể lấy danh sách địa điểm");
      }
    } catch (err) {
      setErrorAll(err.message || "Đã xảy ra lỗi khi tải địa điểm");
      const cached = APICache.get(CACHE_KEY_ALL, true);
      if (cached && Array.isArray(cached)) {
        setAllLocations(cached);
      }
    } finally {
      setLoadingAll(false);
    }
  }, []);

  // Tìm kiếm địa điểm theo prefix
  const searchByPrefix = useCallback(async (prefix) => {
    if (!prefix || prefix.trim() === "") {
      setSearchResults([]);
      return;
    }

    setLoadingSearch(true);
    setErrorSearch(null);

    try {
      const cacheKey = CACHE_KEY_PREFIX + prefix.toLowerCase();
      APICache.remove(cacheKey);
      const cached = APICache.get(cacheKey);
      console.log("Cached search results:", cached);
      if (cached && Array.isArray(cached)) {
        setSearchResults(cached);
        setLoadingSearch(false);
        return;
      }

      // Gọi API tìm kiếm
      const response = await searchLocationByPrefix(prefix);
      console.log("Search results:", response);
      if (response.success && Array.isArray(response.data)) {
        setSearchResults(response.data);

        // Cache kết quả tìm kiếm với TTL ngắn hơn
        APICache.set(cacheKey, response.data, 5 * 60 * 1000); // 5 phút
      } else {
        throw new Error(response.message || "Không thể tìm địa điểm");
      }
    } catch (err) {
      setErrorSearch(err.message || "Đã xảy ra lỗi khi tìm địa điểm");
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }, []);

  useEffect(() => {
    fetchTop5Locations();
    fetchAllLocations();
  }, [fetchTop5Locations, fetchAllLocations]);

  const refetchTop = useCallback(
    () => fetchTop5Locations(true),
    [fetchTop5Locations]
  );
  const refetchAll = useCallback(
    () => fetchAllLocations(true),
    [fetchAllLocations]
  );

  return {
    topLocations,
    allLocations,
    loadingTop,
    loadingAll,
    errorTop,
    errorAll,
    refetchTop,
    refetchAll,
    searchByPrefix,
    searchResults,
    loadingSearch,
    errorSearch,
  };
}
