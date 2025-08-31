import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { mockNewsDetail } from "../../api/mockData/mockNewsData";

const NewsDetailPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      // Using mock data directly
      if (mockNewsDetail.success) {
        setNews(mockNewsDetail.data);
        setLoading(false);
      } else {
        setError("Không thể tải tin tức");
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 p-4 rounded-md">
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
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Không tìm thấy tin tức
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Tin tức này không tồn tại hoặc đã bị xóa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="mr-2">
            <i className="far fa-calendar-alt"></i>{" "}
            {new Date(news.createdAt).toLocaleDateString("vi-VN")}
          </span>
          <span className="mr-2">|</span>
          <span>
            <i className="far fa-user"></i> {news.author}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{news.title}</h1>
        <p className="text-lg text-gray-700 mb-6">{news.summary}</p>

        {news.image && (
          <div className="mb-6">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
            {news.imageCaption && (
              <p className="text-sm text-center text-gray-500 mt-2">
                {news.imageCaption}
              </p>
            )}
          </div>
        )}
      </div>

      <div
        className="prose prose-rose max-w-none"
        dangerouslySetInnerHTML={{ __html: news.content }}
      />

      <div className="mt-10 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {news.tags &&
            news.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
        </div>
      </div>

      {news.relatedNews && news.relatedNews.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Bài viết liên quan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.relatedNews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link to={`/news/${item.id}`}>
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2">
                      <i className="far fa-calendar-alt mr-1"></i>
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                    <h4 className="font-medium text-gray-900 line-clamp-2 hover:text-rose-600 transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetailPage;
