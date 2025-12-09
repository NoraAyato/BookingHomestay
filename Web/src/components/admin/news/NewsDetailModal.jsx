import React from "react";
import { X, User, Calendar, Tag, FileText, Eye, Star } from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";

const NewsDetailModal = ({
  isOpen,
  onClose,
  news,
  formatDate,
  getStatusBadge,
  getCategoryBadge,
}) => {
  if (!isOpen || !news) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Chi tiết tin tức
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[65vh] overflow-y-auto">
            {/* Featured Image */}
            <div className="mb-4">
              <img
                src={getImageUrl(news.image)}
                alt={news.title}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {news.featured && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-medium rounded-full flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Nổi bật
                </span>
              )}
              {getStatusBadge(news.status)}
              {getCategoryBadge(news.category)}
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {news.title}
            </h2>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center text-gray-600">
                <User className="w-5 h-5 mr-2 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Tác giả</p>
                  <p className="font-medium">{news.author}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Ngày tạo</p>
                  <p className="font-medium">{formatDate(news.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Tag className="w-5 h-5 mr-2 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Danh mục</p>
                  <p className="font-medium">{news.category}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <FileText className="w-5 h-5 mr-2 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Trạng thái</p>
                  <p className="font-medium">
                    {news.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Nội dung
              </h3>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {news.content}
              </div>
            </div>

            {/* Additional Info */}
            {news.id && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  ID: <span className="font-mono text-gray-700">{news.id}</span>
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailModal;
