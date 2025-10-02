import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStaggeredAnimation } from "../../hooks/useInView";
import { useHomestayData } from "../../hooks/useHomestay";
import { getImageUrl } from "../../utils/imageUrl";

const FeaturedHomestays = () => {
  const navigate = useNavigate();
  const [ref, shouldAnimate] = useStaggeredAnimation(100);
  const {
    featuredHomestays,
    loadingFeatured: loading,
    errorFeatured: error,
    refetchFeatured: refetch,
  } = useHomestayData();

  // Hàm xử lý đặt phòng và chuyển đến trang chi tiết
  const handleBookNow = (homestayId, event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện bubble lên parent

    // Chuyển đến trang chi tiết với ngày mặc định
    navigate(`/homestay/detail/${homestayId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const fallbackData =
    loading && !featuredHomestays?.length
      ? [
          { id: "skeleton-1" },
          { id: "skeleton-2" },
          { id: "skeleton-3" },
          { id: "skeleton-4" },
          { id: "skeleton-5" },
        ]
      : [];

  const displayData = featuredHomestays?.length
    ? featuredHomestays
    : fallbackData;

  if (error) {
    return (
      <section ref={ref} className="py-12 w-full bg-rose-50/50">
        <div className="max-w-[1400px] mx-auto px-4 text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Homestay Nổi Bật
            </h2>
            <div className="h-1 w-16 bg-rose-500 rounded-full mb-6 mx-auto"></div>
            <p className="text-red-500 text-lg max-w-2xl mx-auto">
              {error.message || "Đã có lỗi xảy ra khi tải dữ liệu homestay"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="py-8 w-full bg-rose-50/50">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Phần tiêu đề được thiết kế lại */}
        <div className="relative mb-10 text-center">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300/50"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-rose-50/50 text-rose-700">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent inline-block">
                Homestay Nổi Bật
              </h2>
              <div className="flex justify-center mt-2">
                <div className="h-1 w-12 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full"></div>
                <div className="h-1 w-4 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full mx-1"></div>
                <div className="h-1 w-12 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"></div>
              </div>
            </span>
          </div>
          <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
            Khám phá những homestay tuyệt vời với đầy đủ tiện nghi và view đẹp
            nhất
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
          className="flex flex-wrap justify-center gap-8"
          style={{ willChange: "transform" }}
        >
          {displayData.map((homestay) => (
            <motion.div
              key={homestay.id}
              variants={cardVariants}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ease-out transform-gpu border border-gray-100 w-[calc(50%-16px)] sm:w-[calc(33.333%-22px)] md:w-[calc(25%-24px)] lg:w-[calc(20%-26px)] hover:-translate-y-2 cursor-pointer group"
              onClick={() => navigate(`/homestay/detail/${homestay.id}`)}
              style={{
                willChange: "transform, opacity",
              }}
            >
              {loading && !featuredHomestays?.length ? (
                <div className="animate-pulse">
                  <div className="relative pb-[65%] overflow-hidden bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mb-3"></div>
                    <div className="pt-2 mt-3 border-t border-gray-100">
                      <div className="flex justify-between">
                        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Actual content
                <>
                  <div className="relative pb-[65%] overflow-hidden">
                    <img
                      src={getImageUrl(homestay.image)}
                      alt={homestay.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/600x400?text=Error";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/0 group-hover:to-black/20 transition-all duration-500 ease-out"></div>
                  </div>

                  <div className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-rose-700 transition-colors duration-300">
                        {homestay.title}
                      </h3>
                      <div className="flex items-center bg-amber-50 px-1.5 py-0.5 rounded transition-all duration-300 group-hover:bg-amber-100 group-hover:scale-105">
                        <span className="text-amber-500 text-xs font-semibold">
                          ★
                        </span>
                        <span className="ml-0.5 text-xs font-medium text-gray-700">
                          {homestay.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-xs mb-3 flex items-center transition-colors duration-300 group-hover:text-gray-800">
                      <svg
                        className="w-3.5 h-3.5 text-rose-500 mr-1 transition-transform duration-300 group-hover:scale-110"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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

                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
                      <div>
                        <p className="font-bold text-rose-600 text-sm transition-colors duration-300 group-hover:text-rose-700">
                          {typeof homestay.price === "number"
                            ? homestay.price.toLocaleString("vi-VN")
                            : homestay.price}
                          đ
                          <span className="text-gray-500 text-xs font-normal">
                            /đêm
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
                          {homestay.reviews || 0} đánh giá
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleBookNow(homestay.id, e)}
                        className="px-2.5 py-1.5 bg-rose-500 text-white rounded text-xs font-medium hover:bg-rose-600 transition-all duration-300 transform-gpu hover:scale-105 shadow-sm group-hover:shadow-md"
                      >
                        Đặt ngay
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-8">
          <button className="px-6 py-2.5 bg-white text-rose-600 border border-rose-600 rounded-md text-sm font-medium hover:bg-rose-50 hover:border-rose-700 hover:text-rose-700 transition-all duration-300 transform-gpu hover:-translate-y-0.5 shadow-sm">
            Xem thêm homestay
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedHomestays;
