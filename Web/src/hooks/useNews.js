import { useState, useCallback, useEffect } from "react";
import { getNewsList, getNewsDetail, getNewsCategories } from "../api/news";

/**
 * Hook chính để quản lý news, categories và pagination
 */
export function useNews(initialPage = 1, pageSize = 6) {
  // News data
  const [news, setNews] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: pageSize,
    total: 0,
  });

  // Category
  const [currentCategory, setCurrentCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [moreCategories, setMoreCategories] = useState([]);

  // Fetch news
  const fetchNews = useCallback(
    async (page = 1, categoryId = "all") => {
      try {
        setLoading(true);
        setError(null);

        const response = await getNewsList(
          page,
          pageSize,
          categoryId === "all" ? null : categoryId
        );

        // API trả về trực tiếp object có items, không có success wrapper
        if (response && response.items) {
          const items = response.items || [];

          setNews(items);
          setPagination({
            page: response.page || page,
            limit: response.limit || pageSize,
            total: response.total || 0,
          });

          // Set featured news - chỉ lấy item có isFeatured = true
          const featured =
            items.find((item) => item.isFeatured === true) || null;
          setFeaturedNews(featured);
        }
      } catch (err) {
        setError(err.message || "Không thể tải tin tức");
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await getNewsCategories();

      // API trả về array trực tiếp hoặc có thể có success wrapper
      let categoriesData = [];

      if (Array.isArray(response)) {
        categoriesData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        categoriesData = response.data;
      } else if (response?.success && response?.data) {
        categoriesData = Array.isArray(response.data) ? response.data : [];
      }

      // Thêm "Tất cả" vào đầu danh sách và đánh dấu isPopular cho tất cả
      const allCategories = [
        { id: "all", name: "Tất cả", isPopular: true },
        ...categoriesData.map((cat) => ({
          ...cat,
          isPopular: true, // Tạm thời đánh dấu tất cả là popular
        })),
      ];

      processCategories(allCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Fallback categories nếu API lỗi
      const fallback = [{ id: "all", name: "Tất cả", isPopular: true }];
      processCategories(fallback);
    }
  }, []);

  const processCategories = (data) => {
    setCategories(data);
    const popular = data.filter((cat) => cat.isPopular);
    const more = data.filter((cat) => !cat.isPopular);
    setPopularCategories(popular);
    setMoreCategories(more);
  };

  // Change category
  const changeCategory = useCallback(
    (categoryId) => {
      setCurrentCategory(categoryId);
      fetchNews(1, categoryId);
    },
    [fetchNews]
  );

  // Change page
  const changePage = useCallback(
    (page) => {
      fetchNews(page, currentCategory);
    },
    [fetchNews, currentCategory]
  );

  // Initial fetch
  useEffect(() => {
    fetchNews(initialPage, currentCategory);
    fetchCategories();
  }, []);

  return {
    // News data
    news,
    featuredNews,
    loading,
    error,

    // Pagination
    pagination,
    changePage,

    // Category
    currentCategory,
    categories,
    popularCategories,
    moreCategories,
    changeCategory,

    // Utils
    refetch: () => fetchNews(pagination.page, currentCategory),
  };
}

/**
 * Hook để lấy chi tiết tin tức
 */
export function useNewsDetail(newsId) {
  const [newsDetail, setNewsDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!newsId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await getNewsDetail(newsId);
        // API trả về trực tiếp object với id, title, content, image, category, author, createdAt, ...
        if (response && response.id) {
          setNewsDetail(response);
        } else {
          setError("Không thể tải chi tiết tin tức");
        }
      } catch (err) {
        setError(err.message || "Không thể tải chi tiết tin tức");
        console.error("Error fetching news detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [newsId]);

  return {
    newsDetail,
    loading,
    error,
  };
}
