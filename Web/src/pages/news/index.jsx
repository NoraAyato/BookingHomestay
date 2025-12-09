import React from "react";
import { useNews } from "../../hooks/useNews";
import CategoryFilter from "../../components/news/CategoryFilter";
import NewsCard from "../../components/news/NewsCard";
import FeaturedNews from "../../components/news/FeaturedNews";

const NewsPage = () => {
  // Chỉ dùng 1 hook useNews cho tất cả
  const {
    news: newsList,
    featuredNews,
    loading,
    error,
    pagination,
    currentCategory,
    popularCategories,
    moreCategories,
    changeCategory,
    changePage,
  } = useNews(1, 6);

  // Count from pagination when active category
  const getCategoryCount = (categoryId) => {
    if (categoryId === currentCategory) {
      return pagination.total;
    }
    return "";
  };

  const handleCategoryChange = (categoryId) => {
    changeCategory(categoryId);
  };

  if (loading && newsList.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
        </div>
      </div>
    );
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
      <CategoryFilter
        popularCategories={popularCategories}
        moreCategories={moreCategories}
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
        getCategoryCount={getCategoryCount}
        loading={loading}
      />

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
      {featuredNews && <FeaturedNews news={featuredNews} />}

      {/* News List */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
          </div>
        ) : newsList.length === 0 ? (
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
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {newsList.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.total > pagination.limit && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>

                  {Array.from(
                    { length: Math.ceil(pagination.total / pagination.limit) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => changePage(page)}
                      className={`px-4 py-2 rounded-md ${
                        pagination.page === page
                          ? "bg-rose-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={
                      pagination.page >=
                      Math.ceil(pagination.total / pagination.limit)
                    }
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
