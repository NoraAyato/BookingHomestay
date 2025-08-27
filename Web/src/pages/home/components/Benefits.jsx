import React from "react";
import { motion } from "framer-motion";
import { useStaggeredAnimation } from "../../../hooks/useInView";

const Benefits = () => {
  const [ref, shouldAnimate] = useStaggeredAnimation(100);

  const benefits = [
    {
      id: 1,
      icon: (
        <svg
          className="w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      title: "Đa dạng lựa chọn",
      description:
        "Hàng nghìn homestay chất lượng cao trên khắp Việt Nam phù hợp với mọi nhu cầu và ngân sách",
    },
    {
      id: 2,
      icon: (
        <svg
          className="w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      title: "Giá tốt nhất",
      description:
        "Cam kết giá tốt nhất cho khách hàng và không có phí ẩn, đảm bảo sự minh bạch",
    },
    {
      id: 3,
      icon: (
        <svg
          className="w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100",
      title: "Đặt phòng an toàn",
      description:
        "Thanh toán bảo mật với nhiều phương thức và nhận xác nhận đặt phòng ngay tức thì",
    },
    {
      id: 4,
      icon: (
        <svg
          className="w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      title: "Đánh giá thực",
      description:
        "Đánh giá chân thực và minh bạch từ khách hàng đã trải nghiệm dịch vụ lưu trú",
    },
    {
      id: 5,
      icon: (
        <svg
          className="w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          />
        </svg>
      ),
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      title: "Ưu đãi độc quyền",
      description:
        "Khuyến mãi và ưu đãi hấp dẫn quanh năm chỉ dành riêng cho thành viên Rose Homestay",
    },
    {
      id: 6,
      icon: (
        <svg
          className="w-7 h-7"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
      title: "Hỗ trợ 24/7",
      description:
        "Đội ngũ hỗ trợ khách hàng chuyên nghiệp luôn sẵn sàng phục vụ bạn 24/7",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Delay giữa các cards
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
            Tại Sao Chọn Rose Homestay?
          </h2>
          <div className="flex justify-center mb-4">
            <div className="h-1 w-16 bg-rose-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Trải nghiệm đặt homestay dễ dàng, an toàn và tiện lợi với những lợi
            ích độc quyền
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ willChange: "transform" }}
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.id}
              variants={cardVariants}
              className={`group p-6 rounded-xl border ${benefit.borderColor} ${benefit.bgColor} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              style={{
                willChange: "transform, opacity",
              }}
            >
              <div
                className={`${benefit.color} mb-4 p-3 inline-flex rounded-full ${benefit.bgColor} border ${benefit.borderColor} group-hover:scale-110 transition-transform duration-300`}
              >
                {benefit.icon}
              </div>

              <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-rose-600 transition-colors">
                {benefit.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Benefits;
