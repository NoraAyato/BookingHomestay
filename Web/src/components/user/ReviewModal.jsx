import React, { useState } from "react";

const ReviewModal = ({ isOpen, onClose, booking, onSubmit }) => {
  const [reviewData, setReviewData] = useState({
    service: 0,
    cleanliness: 0,
    amenities: 0,
    comment: "",
    images: [],
  });

  if (!isOpen || !booking) return null;

  const handleRatingChange = (category, value) => {
    setReviewData((prev) => ({ ...prev, [category]: value }));
  };

  const handleCommentChange = (e) => {
    setReviewData((prev) => ({ ...prev, comment: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setReviewData((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 1), // max 1 image
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setReviewData((prev) => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 1),
    }));
  };

  const handleRemoveImage = (idx) => {
    setReviewData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = () => {
    onSubmit(booking.bookingId, reviewData);
    handleClose();
  };

  const handleClose = () => {
    setReviewData({
      service: 0,
      cleanliness: 0,
      amenities: 0,
      accuracy: 0,
      comment: "",
      images: [],
    });
    onClose();
  };

  const calculateAverageRating = () => {
    const { service, cleanliness, amenities } = reviewData;
    const total = service + cleanliness + amenities;
    return total > 0 ? (total / 3).toFixed(1) : 0;
  };

  const isFormValid = () => {
    return (
      reviewData.service > 0 &&
      reviewData.cleanliness > 0 &&
      reviewData.amenities > 0
    );
  };

  const RatingCategory = ({ icon, label, category, value }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-gray-900">{label}</span>
        </div>
        <span className="text-amber-600 font-bold">{value}/5</span>
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRatingChange(category, star)}
            className="transition-transform hover:scale-110"
          >
            <svg
              className={`w-8 h-8 ${
                star <= value ? "text-amber-500 fill-current" : "text-gray-300"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold mb-2">Đánh giá trải nghiệm</h3>
              <p className="text-amber-100 text-sm">{booking.homestayName}</p>
              <p className="text-amber-200 text-xs mt-1">
                Booking ID: #{booking.bookingId}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Average Rating Display */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 text-center border-2 border-amber-200">
            <div className="text-5xl font-bold text-amber-600 mb-2">
              {calculateAverageRating()}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(calculateAverageRating())
                      ? "text-amber-500 fill-current"
                      : "text-gray-300"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              ))}
            </div>
            <p className="text-sm text-gray-600">Đánh giá trung bình</p>
          </div>

          {/* Rating Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-lg">
              Đánh giá chi tiết
            </h4>

            <RatingCategory
              icon={
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              }
              label="Dịch vụ"
              category="service"
              value={reviewData.service}
            />

            <RatingCategory
              icon={
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              label="Độ sạch sẽ"
              category="cleanliness"
              value={reviewData.cleanliness}
            />

            <RatingCategory
              icon={
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              }
              label="Tiện nghi"
              category="amenities"
              value={reviewData.amenities}
            />
          </div>
          {/* Image Upload Section */}
          <div>
            <label className="block font-semibold text-gray-900 text-lg mb-3">
              Hình ảnh thực tế (tối đa 1 ảnh)
            </label>
            <div
              className="w-full border-2 border-dashed border-amber-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-amber-50 transition"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() =>
                document.getElementById("review-image-input").click()
              }
            >
              <svg
                className="w-10 h-10 text-amber-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5 5 5M12 15V3"
                />
              </svg>
              <span className="text-amber-700 font-medium">
                Kéo & thả hoặc bấm để chọn ảnh
              </span>
              <input
                id="review-image-input"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
                disabled={reviewData.images.length >= 1}
              />
            </div>
            {reviewData.images.length > 0 && (
              <div className="flex gap-3 mt-3">
                {reviewData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`review-img-${idx}`}
                      className="w-24 h-24 object-cover rounded-lg border-2 border-amber-200 shadow"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      className="absolute top-1 right-1 bg-white/80 hover:bg-red-500 hover:text-white text-red-500 rounded-full p-1 shadow group-hover:scale-110 transition"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comment Section */}
          <div>
            <label className="block font-semibold text-gray-900 text-lg mb-3">
              Nhận xét của bạn
            </label>
            <textarea
              value={reviewData.comment}
              onChange={handleCommentChange}
              placeholder="Chia sẻ trải nghiệm của bạn về homestay này..."
              rows={5}
              maxLength={500}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              {reviewData.comment.length}/500 ký tự
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 p-6 rounded-b-2xl border-t-2 border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
