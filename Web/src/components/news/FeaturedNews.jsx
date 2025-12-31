import React from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";

const FeaturedNews = ({ news }) => {
  if (!news) return null;

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
      // Loại bỏ HTML tags và lấy 200 ký tự đầu
      const plainText = news.content.replace(/<[^>]*>/g, "");
      return plainText.length > 200
        ? plainText.substring(0, 200) + "..."
        : plainText;
    }
    return "";
  };

  return (
    <div className="bg-gradient-to-r from-rose-50 to-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="md:flex">
        <div className="md:flex-shrink-0 md:w-1/2">
          <Link to={`/news/${news.id}`}>
            <img
              src={getImageUrl(news.image)}
              alt={news.title}
              className="h-full w-full object-cover md:h-full"
              onError={(e) => {
                e.target.src = "/placeholder-news.jpg";
              }}
            />
          </Link>
        </div>
        <div className="p-6 md:p-8 md:w-1/2">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="mr-2">
              <i className="far fa-calendar-alt"></i>{" "}
              {new Date(news.createdAt).toLocaleDateString("vi-VN")}
            </span>
            {news.views !== undefined && (
              <>
                <span className="mr-2">|</span>
                <span>
                  <i className="far fa-eye"></i> {news.views || 0}
                </span>
              </>
            )}
          </div>
          <Link to={`/news/${news.id}`} className="block">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-rose-600 transition-colors">
              {news.title}
            </h2>
          </Link>
          <p className="text-gray-600 mb-4">{getPreviewText()}</p>
          <div className="flex items-center justify-between">
            {news.category && (
              <span
                className={`inline-block ${getCategoryColor(
                  news.category
                )} text-white text-sm font-semibold px-3 py-1 rounded`}
              >
                {news.category}
              </span>
            )}
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
