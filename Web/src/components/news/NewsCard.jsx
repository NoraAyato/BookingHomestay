import React from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";

const NewsCard = ({ news }) => {
  // Hàm lấy màu cho category badge dựa trên tên category
  const getCategoryColor = (category) => {
    if (!category) return "bg-gray-500";

    const colors = [
      "bg-rose-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-amber-500",
      "bg-teal-500",
      "bg-indigo-500",
      "bg-pink-500",
    ];

    // Tạo hash từ tên category để luôn có cùng màu cho cùng category
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Hàm lấy text preview - ưu tiên summary, excerpt, nếu không có thì lấy từ content
  const getPreviewText = () => {
    if (news.summary) return news.summary;
    if (news.excerpt) return news.excerpt;
    if (news.content) {
      // Loại bỏ HTML tags và lấy 150 ký tự đầu
      const plainText = news.content.replace(/<[^>]*>/g, "");
      return plainText.length > 150
        ? plainText.substring(0, 150) + "..."
        : plainText;
    }
    return "";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/news/${news.id}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={getImageUrl(news.image)}
            alt={news.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder-news.jpg";
            }}
          />
          {news.category && (
            <span
              className={`absolute top-3 left-3 ${getCategoryColor(
                news.category
              )} text-white text-xs font-semibold px-2 py-1 rounded`}
            >
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
            {news.views !== undefined && (
              <>
                <span className="mx-1">•</span>
                <span>
                  <i className="far fa-eye"></i> {news.views || 0}
                </span>
              </>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {news.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {getPreviewText()}
          </p>
          <div className="flex justify-between items-center">
            {/* {news.author && (
              <span className="text-xs text-gray-500">
                <i className="far fa-user"></i> {news.author}
              </span>
            )} */}
            <span className="text-rose-600 text-sm font-medium hover:text-rose-700 ml-auto">
              Đọc tiếp <i className="fas fa-arrow-right text-xs ml-1"></i>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NewsCard;
