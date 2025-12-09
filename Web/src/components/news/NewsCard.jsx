import React from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";
const NewsCard = ({ news }) => {
  console.log("Rendering NewsCard for news:", news);
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/news/${news.id}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={getImageUrl(news.image)}
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

export default NewsCard;
