import React, { useState } from "react";
import {
  Star,
  Eye,
  Trash2,
  MapPin,
  Calendar,
  Image as ImageIcon,
  AlertCircle,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";

const ReviewsList = ({
  reviews,
  formatDate,
  onViewDetail,
  onDelete,
  onApprove,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const getRatingBadge = (rating) => {
    if (rating >= 4) {
      return {
        text: "Tốt",
        bgColor: "bg-emerald-100",
        textColor: "text-emerald-700",
        borderColor: "border-emerald-200",
      };
    } else if (rating >= 3) {
      return {
        text: "Trung bình",
        bgColor: "bg-amber-100",
        textColor: "text-amber-700",
        borderColor: "border-amber-200",
      };
    } else {
      return {
        text: "Kém",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        borderColor: "border-red-200",
      };
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateFormatted = date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return { time, date: dateFormatted };
  };

  return (
    <>
      {/* Image Preview Modal */}
      {imagePreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setImagePreview(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setImagePreview(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={getImageUrl(imagePreview)}
              alt="Review image preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => {
          const badge = getRatingBadge(review.rating);
          const isNegative = review.rating < 3;
          const dateTime = formatDateTime(review.date);

          return (
            <div
              key={review.id}
              className={`bg-white rounded-xl border-2 ${
                isNegative ? "border-red-200 bg-red-50/30" : "border-gray-200"
              } p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300`}
            >
              {/* Negative Review Alert */}
              {isNegative && (
                <div className="flex items-center space-x-2 mb-4 bg-red-100 border border-red-300 rounded-lg px-3 py-2">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <span className="text-xs font-medium text-red-700">
                    Đánh giá tiêu cực - Cần chú ý
                  </span>
                </div>
              )}

              {/* Header with Guest Info & Date */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <img
                    src={getImageUrl(review.guestAvatar)}
                    alt={review.guestName}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 truncate">
                      {review.guestName}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-600 font-mono bg-gray-100 px-2 py-0.5 rounded">
                        {review.bookingId}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600">
                        ID: #{review.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex flex-col items-end ml-4">
                  <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span className="font-medium">{dateTime.date}</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {dateTime.time}
                  </span>
                </div>
              </div>

              {/* Homestay Info & Rating */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-lg p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2 flex-1 min-w-0">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-gray-900 truncate">
                        {review.homestayName}
                      </h5>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Homestay ID: {review.homestayId}
                      </p>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="ml-4 flex-shrink-0">
                    <div
                      className={`${badge.bgColor} ${badge.textColor} border ${badge.borderColor} px-3 py-1.5 rounded-lg flex items-center space-x-2`}
                    >
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= review.rating
                                ? "text-yellow-500 fill-current"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold">{review.rating}</span>
                      <span className="text-xs font-semibold">
                        {badge.text}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {review.content}
                </p>

                {/* Review Image Thumbnail */}
                {review.image && (
                  <div className="mt-3 inline-block">
                    <div
                      className="relative group w-20 h-20 cursor-pointer"
                      onClick={() => setImagePreview(review.image)}
                    >
                      <img
                        src={getImageUrl(review.image)}
                        alt="Review image"
                        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  {review.image && (
                    <span className="inline-flex items-center text-xs text-gray-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      <ImageIcon className="h-3 w-3 mr-1 text-blue-600" />
                      Có hình ảnh
                    </span>
                  )}
                  {/* Status Badge */}
                  {review.status ? (
                    <span className="inline-flex items-center text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Đã duyệt
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                      <Clock className="h-3 w-3 mr-1" />
                      Chưa duyệt
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    onClick={() => onViewDetail(review)}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Chi tiết</span>
                  </button>
                  {!review.status && onApprove && (
                    <button
                      className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      onClick={() => onApprove(review)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Duyệt</span>
                    </button>
                  )}
                  <button
                    className="flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    onClick={() => onDelete && onDelete(review)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ReviewsList;
