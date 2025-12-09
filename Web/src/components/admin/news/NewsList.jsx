import React from "react";
import {
  Edit,
  Eye,
  Trash2,
  User,
  Calendar,
  Eye as EyeIcon,
  MessageSquare,
} from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";
const NewsList = ({
  news,
  formatDate,
  getStatusBadge,
  getCategoryBadge,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {news.map((article) => (
        <div
          key={article.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Featured Image */}
            <div className="lg:w-48 lg:flex-shrink-0">
              <img
                src={getImageUrl(article.image)}
                alt={article.title}
                className="w-full h-48 lg:h-36 object-cover rounded-lg"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {article.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-medium rounded-full">
                      ⭐ Nổi bật
                    </span>
                  )}
                  {getStatusBadge(article.status)}
                  {getCategoryBadge(article.category)}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                  {article.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
              </div>

              {/* Author and Date - Push to bottom */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-auto">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="lg:w-32 flex lg:flex-col gap-2">
              <button
                onClick={() => onView && onView(article)}
                className="flex items-center justify-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors"
              >
                <Eye className="h-3 w-3 mr-1" />
                Xem
              </button>
              <button
                onClick={() => onEdit && onEdit(article)}
                className="flex items-center justify-center px-3 py-2 text-green-600 hover:bg-green-50 rounded text-sm transition-colors"
              >
                <Edit className="h-3 w-3 mr-1" />
                Sửa
              </button>
              <button
                onClick={() => onDelete && onDelete(article)}
                className="flex items-center justify-center px-3 py-2 text-red-600 hover:bg-red-50 rounded text-sm transition-colors"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Xóa
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsList;
