import React from "react";
import { Link } from "react-router-dom";

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

export default FeaturedNews;
