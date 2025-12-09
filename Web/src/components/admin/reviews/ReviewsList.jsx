import React from "react";
import { Star, Eye, Trash2 } from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";
const ReviewsList = ({ reviews, formatDate, onViewDetail, onDelete }) => {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={getImageUrl(review.guestAvatar)}
                alt={review.guestName}
                className="w-10 h-10 rounded-full border border-gray-200"
              />
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  {review.guestName}
                </h4>
                <p className="text-xs text-gray-500">
                  Mã đặt chỗ: {review.bookingId}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">
                {formatDate(review.date)}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-gray-900">
                {review.homestayName}
              </h5>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm font-medium">
                  {review.rating}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              {review.content}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              {/* Removed helpful count as per backend */}
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Xem chi tiết"
                onClick={() => onViewDetail(review)}
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Xóa đánh giá"
                onClick={() => onDelete && onDelete(review)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;
