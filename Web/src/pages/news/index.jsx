import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import { mockNewsData } from "../../api/mockData/mockNewsData";

const NewsCard = ({ news }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/news/${news.id}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          {news.category && (
            <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-semibold px-2 py-1 rounded">
              {news.category}
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span className="mr-2">
              <i className="far fa-calendar-alt"></i>{" "}
              {new Date(news.createdAt).toLocaleDateString("vi-VN")}
            </span>
            <span className="mr-2">|</span>
            <span>
              <i className="far fa-eye"></i> {news.views}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {news.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {news.summary}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              <i className="far fa-user"></i> {news.author}
            </span>
            <span className="text-rose-600 text-sm font-medium hover:text-rose-700">
              Đọc tiếp <i className="fas fa-arrow-right text-xs ml-1"></i>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

const FeaturedNews = ({ news }) => {
  if (!news) return null;

  return (
    <div className="bg-gradient-to-r from-rose-50 to-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="md:flex">
        <div className="md:flex-shrink-0 md:w-1/2">
          <Link to={`/news/${news.id}`}>
            <img
              src={news.image}
              alt={news.title}
              className="h-full w-full object-cover md:h-full"
            />
          </Link>
        </div>
        <div className="p-6 md:p-8 md:w-1/2">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="mr-2">
              <i className="far fa-calendar-alt"></i>{" "}
              {new Date(news.createdAt).toLocaleDateString("vi-VN")}
            </span>
            <span className="mr-2">|</span>
            <span>
              <i className="far fa-eye"></i> {news.views}
            </span>
          </div>
          <Link to={`/news/${news.id}`} className="block">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-rose-600 transition-colors">
              {news.title}
            </h2>
          </Link>
          <p className="text-gray-600 mb-4">{news.summary}</p>
          <div className="flex items-center justify-between">
            <span className="inline-block bg-rose-500 text-white text-sm font-semibold px-3 py-1 rounded">
              {news.category}
            </span>
            <Link
              to={`/news/${news.id}`}
              className="inline-flex items-center text-rose-600 font-medium hover:text-rose-700"
            >
              Đọc chi tiết
              <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsPage = () => {
  // Using mock data directly
  const { data } = mockNewsData;
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState(data.items);
  const [featuredNews, setFeaturedNews] = useState(data.featured);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(data.totalPages);
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "tips", name: "Kinh nghiệm du lịch" },
    { id: "destination", name: "Điểm đến" },
    { id: "event", name: "Sự kiện" },
    { id: "promotion", name: "Khuyến mãi" },
  ];

  // Function to filter news by category
  const filterNewsByCategory = (category) => {
    if (category === "all") {
      setNewsList(data.items);
      setFeaturedNews(data.featured);
    } else {
      const filtered = data.items.filter(
        (item) =>
          item.category &&
          item.category.toLowerCase().includes(category.toLowerCase())
      );
      setNewsList(filtered);

      // Update featured news if on first page
      if (currentPage === 1) {
        setFeaturedNews(filtered.length > 0 ? filtered[0] : null);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
    filterNewsByCategory(categoryId);
  };

  if (loading && newsList.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Tin tức và cập nhật
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Khám phá tin tức mới nhất và những cập nhật từ chúng tôi
        </p>
      </div>

      {/* Category filter */}
      <div className="flex overflow-x-auto pb-2 mb-8 scrollbar-hide">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? "bg-rose-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-400 text-xl"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Không thể tải tin tức
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured news */}
      {currentPage === 1 && featuredNews && (
        <FeaturedNews news={featuredNews} />
      )}

      {/* News grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsList.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {newsList.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-rose-500 mb-4">
            <i className="far fa-newspaper text-5xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có tin tức
          </h3>
          <p className="text-gray-500">
            Không có tin tức nào trong danh mục này.
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
