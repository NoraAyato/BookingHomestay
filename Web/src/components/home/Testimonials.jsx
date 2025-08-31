import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStaggeredAnimation } from "../../hooks/useInView";

const Testimonials = () => {
  const [ref, shouldAnimate] = useStaggeredAnimation(100);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Thị Minh Tâm",
      avatar: "https://i.pravatar.cc/150?img=32",
      role: "Blogger du lịch",
      location: "Đà Nẵng",
      content:
        "Một trải nghiệm tuyệt vời vượt xa mong đợi! Từ quy trình đặt phòng đơn giản đến dịch vụ tiếp đón nhiệt tình, mọi thứ đều hoàn hảo. Homestay không chỉ sạch sẽ, view đẹp mà còn có vị trí thuận tiện để khám phá thành phố. Chắc chắn sẽ quay lại trong lần du lịch tới.",
      rating: 5,
      homestay: "Villa Đà Lạt View Đồi",
      date: "Tháng 5, 2025",
      image: "https://images.unsplash.com/photo-1586611292717-f828b167408c",
    },
    {
      id: 2,
      name: "Trần Đức Minh",
      avatar: "https://i.pravatar.cc/150?img=12",
      role: "Nhiếp ảnh gia",
      location: "Hồ Chí Minh",
      content:
        "Rose Homestay đã mang đến cho chúng tôi kỳ nghỉ đáng nhớ tại Hội An. Dịch vụ chuyên nghiệp, địa điểm thuận tiện và giá cả hợp lý. Đặc biệt ấn tượng với không gian homestay được trang trí độc đáo, phù hợp cho việc chụp ảnh. Tôi đã có một kỳ nghỉ tuyệt vời cùng gia đình.",
      rating: 5,
      homestay: "Homestay Hội An Cổ Kính",
      date: "Tháng 4, 2025",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    },
    {
      id: 2,
      name: "Trần Đức Minh",
      avatar: "https://i.pravatar.cc/150?img=12",
      role: "Nhiếp ảnh gia",
      location: "Hồ Chí Minh",
      content:
        "Rose Homestay đã mang đến cho chúng tôi kỳ nghỉ đáng nhớ tại Hội An. Dịch vụ chuyên nghiệp, địa điểm thuận tiện và giá cả hợp lý. Đặc biệt ấn tượng với không gian homestay được trang trí độc đáo, phù hợp cho việc chụp ảnh. Tôi đã có một kỳ nghỉ tuyệt vời cùng gia đình.",
      rating: 5,
      homestay: "Homestay Hội An Cổ Kính",
      date: "Tháng 4, 2025",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    },
    {
      id: 3,
      name: "Phạm Quang Hải",
      avatar: "https://i.pravatar.cc/150?img=67",
      role: "Doanh nhân",
      location: "Hà Nội",
      content:
        "Tôi thường xuyên di chuyển vì công việc và Rose Homestay là lựa chọn hàng đầu của tôi. Đặt phòng dễ dàng, thanh toán nhanh chóng và an toàn. Phòng ở luôn đúng như mô tả và hình ảnh trên website. Đặc biệt, nhân viên hỗ trợ rất nhiệt tình và chuyên nghiệp.",
      rating: 4,
      homestay: "Sea View Nha Trang",
      date: "Tháng 3, 2025",
      image: "https://images.unsplash.com/photo-1586611292717-f828b167409c",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const testimonialVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const dotsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };
  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 3000); // Change testimonial every 1 second
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, testimonials.length]);

  return (
    <section
      ref={ref}
      className="py-12 bg-gradient-to-b from-white to-rose-50/30"
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <div className="flex justify-center mb-4">
            <div className="h-1 w-12 bg-rose-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto text-base">
            Những đánh giá chân thực từ khách hàng đã trải nghiệm và yêu thích
            dịch vụ của Rose Homestay
          </p>
        </div>

        {/* Featured Testimonial */}
        <motion.div
          key={activeIndex} // Re-animate when testimonial changes
          variants={testimonialVariants}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
          className="relative bg-white rounded-xl shadow-lg overflow-hidden mb-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            willChange: "transform, opacity",
          }}
        >
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/2 h-48 md:h-auto relative">
              <img
                src={testimonials[activeIndex].image}
                alt="Homestay view"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              {/* Quote Icon */}
              <div className="mb-3">
                <svg
                  className="w-8 h-8 text-rose-200"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>

              {/* Testimonial Content */}
              <div className="flex-grow">
                <p className="text-gray-600 text-base italic mb-4 leading-relaxed">
                  "{testimonials[activeIndex].content}"
                </p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonials[activeIndex].rating
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
                  <span className="text-sm text-gray-500">
                    {testimonials[activeIndex].date}
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center mt-3">
                <img
                  src={testimonials[activeIndex].avatar}
                  alt={testimonials[activeIndex].name}
                  className="w-12 h-12 rounded-full border-4 border-white shadow-md"
                />
                <div className="ml-3">
                  <h4 className="text-base font-bold text-gray-900">
                    {testimonials[activeIndex].name}
                  </h4>
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm">
                      {testimonials[activeIndex].role}
                    </span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">
                      {testimonials[activeIndex].location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Dots */}
        <motion.div
          variants={dotsVariants}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
          className="flex justify-center space-x-3"
        >
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setIsPaused(true); // Pause when manually navigating
                // Resume auto-slide after 3 seconds of inactivity
                setTimeout(() => setIsPaused(false), 3000);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "bg-rose-500 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
