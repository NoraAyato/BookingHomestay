import React from "react";
import {
  Star,
  X,
  User,
  Calendar,
  MapPin,
  MessageSquare,
  Image as ImageIcon,
} from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";

const ReviewDetailModal = ({ review, isOpen, onClose, formatDate }) => {
  if (!isOpen || !review) return null;

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600 bg-green-50";
    if (rating >= 3) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getRatingText = (rating) => {
    if (rating >= 4) return "Tốt";
    if (rating >= 3) return "Trung bình";
    return "Kém";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-gray-700" />
                Chi tiết đánh giá
              </h3>
              <p className="text-xs text-gray-500 mt-0.5 font-mono">
                #{review.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Guest & Booking Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center">
                <img
                  src={getImageUrl(review.guestAvatar)}
                  alt={review.guestName}
                  className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                />
                <div className="ml-3 flex-1">
                  <h3 className="text-base font-semibold text-gray-900">
                    {review.guestName}
                  </h3>
                  <div className="flex items-center text-xs text-gray-600 mt-0.5">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{formatDate(review.date)}</span>
                    <span className="mx-2">•</span>
                    <span className="font-mono">Mã: {review.bookingId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Homestay & Rating */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start flex-1">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1 mr-2" />
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">
                      {review.homestayName}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 font-mono">
                      ID: {review.homestayId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2.5">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {review.rating}/5
                  </span>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    review.rating >= 4
                      ? "text-emerald-700 bg-emerald-50"
                      : review.rating >= 3
                      ? "text-amber-700 bg-amber-50"
                      : "text-red-700 bg-red-50"
                  }`}
                >
                  {getRatingText(review.rating)}
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <MessageSquare className="h-4 w-4 text-gray-600" />
                <h5 className="text-sm font-semibold text-gray-900">
                  Nội dung đánh giá
                </h5>
              </div>
              <div className="bg-white rounded-lg p-3 border-l-4 border-gray-300">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {review.content}
                </p>
              </div>
            </div>

            {/* Review Image */}
            {review.image && (
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ImageIcon className="h-4 w-4 text-gray-600" />
                  <h5 className="text-sm font-semibold text-gray-900">
                    Hình ảnh đính kèm
                  </h5>
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={getImageUrl(review.image)}
                    alt="Review"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal;
