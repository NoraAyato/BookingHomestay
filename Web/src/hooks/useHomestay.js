import { useState, useEffect, useCallback } from "react";
import {
  getFeaturedHomestays,
  searchHomestays,
  getHomestayById,
  getAvailableRooms,
  getHomestayServices,
  getHomestayReviews,
} from "../api/homestay";
import { APICache } from "../utils/cache";

const CACHE_KEY_FEATURED = "featured_homestays";
const CACHE_TTL = 15 * 60 * 1000;

export function useHomestayData() {
  const [featuredHomestays, setFeaturedHomestays] = useState([]);
  const [allHomestays, setAllHomestays] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [homestayDetail, setHomestayDetail] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [homestayServices, setHomestayServices] = useState([]);
  const [homestayReviews, setHomestayReviews] = useState([]);

  const [loadingFeatured, setLoadingFeatured] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [errorFeatured, setErrorFeatured] = useState(null);
  const [errorAll, setErrorAll] = useState(null);
  const [errorSearch, setErrorSearch] = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);
  const [errorRooms, setErrorRooms] = useState(null);
  const [errorServices, setErrorServices] = useState(null);
  const [errorReviews, setErrorReviews] = useState(null);

  // Lấy featured homestays
  const fetchFeatured = useCallback(async (skipCache = false) => {
    setLoadingFeatured(true);
    setErrorFeatured(null);
    try {
      if (!skipCache) {
        const cachedData = APICache.get(CACHE_KEY_FEATURED);
        if (cachedData && Array.isArray(cachedData)) {
          setFeaturedHomestays(cachedData);
          setLoadingFeatured(false);
          return;
        }
      }
      const response = await getFeaturedHomestays();
      if (response.success && Array.isArray(response.data)) {
        setFeaturedHomestays(response.data);
        APICache.set(CACHE_KEY_FEATURED, response.data, CACHE_TTL);
      } else {
        throw new Error(response.message || "Không thể lấy homestay nổi bật");
      }
    } catch (err) {
      setErrorFeatured(err.message || "Đã xảy ra lỗi khi tải homestay nổi bật");
      setFeaturedHomestays([]);
    } finally {
      setLoadingFeatured(false);
    }
  }, []);

  // Lấy all homestays
  const fetchAll = useCallback(async () => {
    setLoadingAll(true);
    setErrorAll(null);
    try {
      // Giả sử có API getAllHomestays, nếu chưa có thì để []
      if (typeof getAllHomestays === "function") {
        const response = await getAllHomestays();
        if (response.success && Array.isArray(response.data)) {
          setAllHomestays(response.data);
          console.log("All homestays:", response);
        } else {
          throw new Error(
            response.message || "Không thể lấy danh sách homestay"
          );
        }
      } else {
        setAllHomestays([]);
      }
    } catch (err) {
      setErrorAll(err.message || "Đã xảy ra lỗi khi tải danh sách homestay");
      setAllHomestays([]);
    } finally {
      setLoadingAll(false);
    }
  }, []);

  // Tìm kiếm homestay
  const doSearchHomestays = useCallback(async (params) => {
    setLoadingSearch(true);
    setErrorSearch(null);
    try {
      console.log("Searching homestays with params:", params);
      const response = await searchHomestays(params);
      console.log("All homestays:", response);
      if (response.success && Array.isArray(response.data.items)) {
        setSearchResults(response.data.items);
      } else {
        setSearchResults([]);
        throw new Error(response.message || "Không tìm thấy homestay phù hợp");
      }
    } catch (err) {
      setErrorSearch(err.message || "Đã xảy ra lỗi khi tìm kiếm homestay");
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }, []);

  // Lấy chi tiết homestay
  const fetchHomestayDetail = useCallback(async (id) => {
    setLoadingDetail(true);
    setErrorDetail(null);
    try {
      const response = await getHomestayById(id);
      if (response.success && response.data) {
        setHomestayDetail(response.data);
      } else {
        throw new Error(response.message || "Không tìm thấy homestay");
      }
    } catch (err) {
      setErrorDetail(err.message || "Đã xảy ra lỗi khi lấy chi tiết homestay");
      setHomestayDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  // Lấy danh sách phòng khả dụng
  const fetchAvailableRooms = useCallback(async (params) => {
    setLoadingRooms(true);
    setErrorRooms(null);
    try {
      const response = await getAvailableRooms(params);
      if (response.success && Array.isArray(response.data)) {
        setAvailableRooms(response.data);
      } else {
        throw new Error(response.message || "Không tìm thấy phòng khả dụng");
      }
    } catch (err) {
      setErrorRooms(err.message || "Đã xảy ra lỗi khi lấy phòng khả dụng");
      setAvailableRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  // Lấy danh sách dịch vụ của homestay
  const fetchHomestayServices = useCallback(async (homestayId) => {
    setLoadingServices(true);
    setErrorServices(null);
    try {
      const response = await getHomestayServices(homestayId);
      if (response.success && Array.isArray(response.data)) {
        setHomestayServices(response.data);
        console.log("Homestay services:", response.data);
      } else {
        throw new Error(response.message || "Không tìm thấy dịch vụ");
      }
    } catch (err) {
      setErrorServices(err.message || "Đã xảy ra lỗi khi lấy dịch vụ");
      setHomestayServices([]);
    } finally {
      setLoadingServices(false);
    }
  }, []);

  // Lấy danh sách reviews của homestay
  const fetchHomestayReviews = useCallback(
    async (homestayId, page = 1, limit = 3) => {
      setLoadingReviews(true);
      setErrorReviews(null);
      try {
        const response = await getHomestayReviews(homestayId, page, limit);
        if (response.success && response.data) {
          setHomestayReviews(response.data);
        } else {
          throw new Error(response.message || "Không tìm thấy đánh giá");
        }
      } catch (err) {
        setErrorReviews(err.message || "Đã xảy ra lỗi khi lấy đánh giá");
        setHomestayReviews(null);
      } finally {
        setLoadingReviews(false);
      }
    },
    []
  );

  // Refetch từng loại
  const refetchFeatured = useCallback(
    () => fetchFeatured(true),
    [fetchFeatured]
  );
  const refetchAll = useCallback(() => fetchAll(), [fetchAll]);
  const search = useCallback(
    (params) => doSearchHomestays(params),
    [doSearchHomestays]
  );

  // Fetch featured on mount
  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return {
    featuredHomestays,
    allHomestays,
    searchResults,
    homestayDetail,
    availableRooms,
    homestayServices,
    homestayReviews,
    loadingFeatured,
    loadingAll,
    loadingSearch,
    loadingDetail,
    loadingRooms,
    loadingServices,
    loadingReviews,
    errorFeatured,
    errorAll,
    errorSearch,
    errorDetail,
    errorRooms,
    errorServices,
    errorReviews,
    refetchFeatured,
    refetchAll,
    searchHomestays: search,
    fetchHomestayDetail,
    fetchAvailableRooms,
    fetchHomestayServices,
    fetchHomestayReviews,
  };
}
