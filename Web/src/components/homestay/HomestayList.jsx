import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";
import { renderDescription } from "../../utils/string";
const HomestayList = ({
  homestays,
  loading,
  totalResults,
  formatPrice,
  searchParams,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  if (homestays.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="bg-gray-100 rounded-lg p-6 inline-block mb-4">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Không tìm thấy kết quả nào
        </h3>
        <p className="text-gray-500">
          Vui lòng thử lại với tiêu chí tìm kiếm khác
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Results summary */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {searchParams.location
            ? `Homestay tại ${searchParams.location}`
            : "Tất cả homestay"}
        </h2>
        <p className="text-gray-600">Tìm thấy {totalResults} kết quả</p>
      </div>

      {/* Homestay grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {homestays.map((homestay, index) => (
          <motion.div
            key={homestay.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 group"
          >
            <Link
              to={`/Homestay/detail/${homestay.id}?checkIn=${encodeURIComponent(
                searchParams.checkIn || ""
              )}&checkOut=${encodeURIComponent(searchParams.checkOut || "")}`}
              className="block"
            >
              <div className="relative pb-[60%] overflow-hidden">
                <img
                  src={getImageUrl(homestay.image)}
                  alt={homestay.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/600x400?text=Error+Loading+Image";
                  }}
                />
                {homestay.discountPrice && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                    {Math.round(
                      100 - (homestay.discountPrice * 100) / homestay.price
                    )}
                    % GIẢM
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-rose-700 transition-colors duration-300">
                    {homestay.title}
                  </h3>
                  <div className="flex items-center bg-amber-50 px-1.5 py-0.5 rounded transition-all duration-300 group-hover:bg-amber-100">
                    <span className="text-amber-500 text-xs font-semibold">
                      ★
                    </span>
                    <span className="ml-0.5 text-xs font-medium text-gray-700">
                      {homestay.rating}
                    </span>
                  </div>
                </div>

                <p
                  className="text-sm text-gray-500 mb-2 line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: renderDescription(homestay.description),
                  }}
                ></p>

                <p className="text-sm text-gray-700 mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-500 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {homestay.location}
                </p>

                {homestay.amenities && homestay.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {homestay.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                    {homestay.amenities.length > 3 && (
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        +{homestay.amenities.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-start pt-2 border-t border-gray-100">
                  <div>
                    {homestay.discountPrice ? (
                      <>
                        <p className="text-gray-400 text-xs font-medium line-through">
                          {formatPrice(homestay.price)}đ
                        </p>
                        <p className="font-bold text-rose-600 text-base">
                          {formatPrice(homestay.discountPrice)}đ
                          <span className="text-gray-500 text-xs font-normal ml-1">
                            /đêm
                          </span>
                        </p>
                      </>
                    ) : (
                      <p className="font-bold text-rose-600 text-base">
                        {formatPrice(homestay.price)}đ
                        <span className="text-gray-500 text-xs font-normal ml-1">
                          /đêm
                        </span>
                      </p>
                    )}
                    <p className="text-gray-500 text-xs">
                      {homestay.reviews
                        ? `${homestay.reviews} đánh giá`
                        : "Chưa có đánh giá"}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1.5 bg-rose-600 text-white text-sm rounded hover:bg-rose-700 transition-colors whitespace-nowrap flex-shrink-0 w-[90px] flex items-center justify-center ${
                      homestay.discountPrice ? "mt-4" : "mt-1"
                    }`}
                  >
                    Xem chi tiết
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default HomestayList;
