import React from "react";

const NewsSection = ({ data = [], loading, error }) => {
  if (loading) return <div>Đang tải tin tức...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="space-y-4">
      {data.length === 0 && <div>Không có tin tức nào.</div>}
      {data.map((article, index) => (
        <div key={article.id || index} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-900">{article.title}</h4>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                article.status === "published"
                  ? "bg-green-100 text-green-800"
                  : article.status === "drap"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {article.status === "published"
                ? "Đã xuất bản"
                : article.status === "drap"
                ? "Bản nháp"
                : article.status}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Ngày: {article.date}</span>
            <span>Lượt xem: {article.views}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsSection;
