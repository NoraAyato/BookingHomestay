import React, { useState } from "react";
import Pagination from "../common/Pagination";
import { getImageUrl } from "../../utils/imageUrl";

const ReviewsList = ({ reviews, onPageChange }) => {
  // reviews bây giờ là object { items, total, page, limit }
  const reviewsData = reviews?.items || [];
  const totalReviews = reviews?.total || 0;
  const currentPage = reviews?.page || 1;
  const reviewsPerPage = reviews?.limit || 3;

  const totalPages = Math.ceil(totalReviews / reviewsPerPage);

  return (
    <>
      {reviewsData.length > 0 ? (
        <>
          <div className="space-y-6">
            {reviewsData.map((review) => (
              <div
                key={review.id}
                className="pb-6 border-b border-gray-200 last:border-0 last:pb-0"
              >
                <div className="flex gap-3">
                  <img
                    src={getImageUrl(review.userAvatar)}
                    alt={review.username}
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/100x100?text=User";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-[15px]">
                          {review.username}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < parseInt(review.rating)
                                  ? "text-amber-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <span className="text-gray-500 text-xs whitespace-nowrap">
                        {new Date(review.date).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 text-[14px] leading-relaxed">
                      {review.comment}
                    </p>

                    {/* Review image */}
                    {review.image && (
                      <div className="mt-3">
                        <div className="inline-block rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={getImageUrl(review.image)}
                            alt={`Hình ảnh đánh giá của ${review.username}`}
                            className="max-w-[160px] h-[110px] object-cover hover:opacity-95 transition-opacity"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/200x100?text=Image+Error";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChangePage={onPageChange}
                prevLabel="Trước"
                nextLabel="Sau"
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            Chưa có đánh giá nào cho homestay này.
          </p>
        </div>
      )}
    </>
  );
};

export default ReviewsList;
