import React from "react";
import { motion } from "framer-motion";
import { useStaggeredAnimation } from "../../../hooks/useInView";

const PopularDestinations = () => {
  const [ref, shouldAnimate] = useStaggeredAnimation(100);

  const destinations = [
    {
      id: 1,
      name: "Đà Lạt",
      description: "Thành phố ngàn hoa, khí hậu mát mẻ quanh năm",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
      count: 245,
    },
    {
      id: 2,
      name: "Hội An",
      description: "Phố cổ lãng mạn với đèn lồng và kiến trúc độc đáo",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592",
      count: 189,
    },
    {
      id: 3,
      name: "Hạ Long",
      description: "Kỳ quan thiên nhiên với hàng nghìn đảo đá vôi",
      image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1",
      count: 167,
    },
    {
      id: 4,
      name: "Phú Quốc",
      description: "Đảo ngọc với bãi biển cát trắng và nước biển trong xanh",
      image: "https://images.unsplash.com/photo-1540202404-1b927e27fa8b",
      count: 198,
    },
    {
      id: 5,
      name: "Nha Trang",
      description: "Thiên đường biển với những bãi tắm nổi tiếng",
      image: "https://images.unsplash.com/photo-1540202404-1b927e27fa9c",
      count: 178,
    },
  ];

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

  return (
    <section
      ref={ref}
      className="py-12 w-full bg-gradient-to-b from-white to-rose-50/40"
    >
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Điểm Đến Phổ Biến
          </h2>
          <div className="flex justify-center">
            <div className="h-1 w-16 bg-rose-500 rounded-full mb-6"></div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Khám phá những điểm đến được yêu thích với nhiều lựa chọn homestay
            đáp ứng mọi nhu cầu của bạn
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
          style={{ willChange: "transform" }}
        >
          {destinations.map((destination) => (
            <motion.div
              key={destination.id}
              variants={cardVariants}
              className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform-gpu hover:-translate-y-2 cursor-pointer"
              style={{
                willChange: "transform, opacity",
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300"></div>

                {/* Title on image */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">
                    {destination.name}
                  </h3>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-600 text-sm line-clamp-2 mb-3 h-10">
                  {destination.description}
                </p>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-rose-500 mr-1.5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="text-gray-700 font-medium">
                      {destination.count}
                    </span>
                    <span className="text-gray-500 text-xs ml-1">chỗ ở</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PopularDestinations;
