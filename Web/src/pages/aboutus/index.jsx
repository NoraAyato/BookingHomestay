import React from "react";
import { motion } from "framer-motion";
import { useStaggeredAnimation } from "../../hooks/useInView";

const AboutUsPage = () => {
  const [valuesRef, shouldAnimateValues] = useStaggeredAnimation(100);
  const [teamRef, shouldAnimateTeam] = useStaggeredAnimation(100);

  const teamMembers = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Nhà sáng lập & CEO",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      description:
        "Với hơn 10 năm kinh nghiệm trong ngành du lịch và công nghệ, anh A đã sáng lập Home Feel với mong muốn mang đến trải nghiệm lưu trú tuyệt vời cho mọi du khách.",
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Giám đốc Marketing",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
      description:
        "Chị B có hơn 8 năm kinh nghiệm trong lĩnh vực marketing và truyền thông, đặc biệt trong ngành du lịch và lưu trú.",
    },
    {
      id: 3,
      name: "Lê Văn C",
      role: "Giám đốc Công nghệ",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200",
      description:
        "Anh C là người đứng sau hệ thống công nghệ của Home Feel, với nền tảng kỹ thuật vững chắc và tầm nhìn đổi mới.",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      role: "Giám đốc Trải nghiệm Khách hàng",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200",
      description:
        "Với niềm đam mê về dịch vụ khách hàng, chị D luôn đảm bảo mỗi trải nghiệm của khách hàng với Home Feel đều hoàn hảo.",
    },
  ];

  const values = [
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
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      title: "Kết nối",
      description:
        "Chúng tôi tạo ra những kết nối ý nghĩa giữa chủ nhà và khách du lịch, giữa con người và không gian sống.",
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      color: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
      title: "Tin cậy",
      description:
        "Chúng tôi xây dựng niềm tin thông qua tính minh bạch, an toàn và sự chân thành trong mọi tương tác.",
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
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "text-rose-500",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-100",
      title: "Trải nghiệm địa phương",
      description:
        "Chúng tôi tôn vinh và chia sẻ vẻ đẹp của văn hóa và cuộc sống địa phương thông qua những không gian lưu trú độc đáo.",
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
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      title: "Đổi mới",
      description:
        "Chúng tôi không ngừng tìm kiếm những cách thức mới để cải thiện và nâng cao trải nghiệm đặt phòng và lưu trú.",
    },
  ];

  return (
    <div className="about-us-page py-12">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] -mt-12 flex items-center justify-center mb-12">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070"
            alt="About Us Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
            Về Home Feel
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Kết nối mọi người với những trải nghiệm lưu trú độc đáo và đáng nhớ
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Câu chuyện của chúng tôi
          </h2>
          <div className="w-20 h-1 bg-rose-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Home Feel được thành lập vào năm 2020 với sứ mệnh đơn giản nhưng đầy
            ý nghĩa: Tạo ra những trải nghiệm lưu trú độc đáo, giúp du khách cảm
            nhận được sự ấm áp và thoải mái như đang ở nhà.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070"
              alt="Our Story"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Từ ý tưởng đến hiện thực
            </h3>
            <p className="text-gray-600 mb-4">
              Xuất phát từ những trải nghiệm cá nhân khi đi du lịch, nhóm sáng
              lập của Home Feel nhận ra rằng mỗi chuyến đi đều có thể trở nên
              đặc biệt hơn nếu nơi lưu trú mang đến cảm giác thân thuộc và gần
              gũi.
            </p>
            <p className="text-gray-600 mb-4">
              Với niềm tin đó, chúng tôi đã xây dựng một nền tảng kết nối những
              chủ nhà nhiệt tình và những du khách đang tìm kiếm không gian lưu
              trú đầy cảm hứng. Từ những homestay ven biển đến những căn hộ hiện
              đại giữa lòng thành phố, Home Feel mang đến sự đa dạng trong lựa
              chọn để phù hợp với mọi phong cách và sở thích.
            </p>
            <p className="text-gray-600">
              Sau hơn 5 năm hoạt động, Home Feel tự hào đã phục vụ hơn 500,000
              khách hàng và kết nối họ với hơn 10,000 chủ nhà trên khắp Việt
              Nam. Mỗi đêm lưu trú qua Home Feel không chỉ là một giao dịch đơn
              thuần mà còn là một trải nghiệm đáng nhớ, một câu chuyện mới được
              viết nên.
            </p>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div ref={valuesRef} className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <div className="w-20 h-1 bg-rose-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Những giá trị định hướng mọi quyết định và hành động của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 20 }}
                animate={shouldAnimateValues ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${value.bgColor} ${value.borderColor} border rounded-xl p-6 h-full`}
              >
                <div
                  className={`${value.color} p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4`}
                >
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div
        ref={teamRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Đội ngũ của chúng tôi
          </h2>
          <div className="w-20 h-1 bg-rose-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Những con người đam mê và tài năng đứng sau sự thành công của Home
            Feel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={shouldAnimateTeam ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-rose-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-rose-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-rose-200">Homestay</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">63</div>
              <div className="text-rose-200">Tỉnh thành</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500,000+</div>
              <div className="text-rose-200">Khách hàng</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-rose-200">Đánh giá trung bình</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-6 h-6 text-blue-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Sứ mệnh
            </h3>
            <p className="text-gray-700">
              Kết nối mọi người với những không gian lưu trú độc đáo, tạo ra
              những trải nghiệm du lịch đáng nhớ và thúc đẩy văn hóa đón tiếp
              khách du lịch một cách chân thành và thân thiện trên khắp Việt
              Nam.
            </p>
          </div>
          <div className="bg-rose-50 rounded-xl p-8 border border-rose-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-6 h-6 text-rose-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Tầm nhìn
            </h3>
            <p className="text-gray-700">
              Trở thành nền tảng đặt phòng homestay đáng tin cậy nhất Việt Nam,
              nơi mỗi du khách đều có thể tìm thấy một không gian lưu trú phù
              hợp với nhu cầu và mong đợi của họ.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trở thành một phần của cộng đồng Home Feel
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Dù bạn là người đam mê du lịch hay có không gian muốn chia sẻ, Home
            Feel luôn chào đón bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/homestay"
              className="px-8 py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors text-base font-medium"
            >
              Đặt phòng ngay
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
