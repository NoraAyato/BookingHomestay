import React, { useState } from "react";
import Pagination from "../common/Pagination";

const ReviewsList = ({ reviews }) => {
  const reviewsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <>
      {reviews.length > 0 ? (
        <>
          <div className="space-y-8">
            {currentReviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 pb-6 last:border-0"
              >
                <div className="flex">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full mr-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/100x100?text=User";
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {review.userName}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <div className="flex items-center mr-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-amber-500"
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
                      </div>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.date).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-2">{review.comment}</p>

                    {/* Review image */}
                    {review.image && (
                      <div className="mt-3">
                        <div className="max-w-[150px] h-[100px] rounded-md overflow-hidden border border-gray-200">
                          <img
                            src={review.image}
                            alt={`Hình ảnh đánh giá của ${review.userName}`}
                            className="w-full h-full object-cover hover:opacity-90 transition-opacity"
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
          {reviews.length > reviewsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChangePage={setCurrentPage}
              prevLabel="Trước"
              nextLabel="Sau"
            />
          )}
        </>
      ) : (
        <p className="text-gray-500">Chưa có đánh giá nào cho homestay này.</p>
      )}
    </>
  );
};

export default ReviewsList;
