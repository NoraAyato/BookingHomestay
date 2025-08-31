import React from "react";

const Promotions = () => {
  const promotions = [
    {
      id: 1,
      title: "Khuyến mãi mùa hè",
      description: "Giảm đến 30% cho các đặt phòng trong tháng 6-8",
      code: "SUMMER2025",
      discount: "30%",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6",
      expiryDate: "31/08/2025",
      color: "from-amber-400 to-orange-500",
      bgColor: "bg-amber-50",
    },
    {
      id: 2,
      title: "Đặt sớm - Giá tốt",
      description: "Giảm 15% khi đặt phòng trước 30 ngày",
      code: "EARLY15",
      discount: "15%",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      expiryDate: "31/12/2025",
      color: "from-emerald-400 to-teal-500",
      bgColor: "bg-emerald-50",
    },
    {
      id: 3,
      title: "Ưu đãi cuối tuần",
      description: "Giảm 20% cho đặt phòng cuối tuần",
      code: "WEEKEND20",
      discount: "20%",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
      expiryDate: "31/12/2025",
      color: "from-rose-400 to-pink-500",
      bgColor: "bg-rose-50",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-rose-50/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
            Ưu Đãi Đặc Biệt
          </h2>
          <div className="flex justify-center mb-4">
            <div className="h-1 w-16 bg-rose-500 rounded-full"></div>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá các ưu đãi độc quyền khi đặt phòng tại Rose Homestay, áp
            dụng cho các kỳ nghỉ của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform-gpu hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative pb-[56.25%]">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60"></div>

                {/* Discount Badge */}
                <div
                  className={`absolute top-4 right-4 bg-gradient-to-r ${promo.color} text-white font-bold rounded-lg shadow-lg`}
                >
                  <div className="px-3 py-1 text-lg">{promo.discount}</div>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">
                    {promo.title}
                  </h3>
                </div>
              </div>

              <div className="p-5">
                <p className="text-gray-600 text-sm mb-4">
                  {promo.description}
                </p>

                {/* Promo Code Section */}
                <div
                  className={`${promo.bgColor} rounded-lg p-4 mb-4 flex justify-between items-center`}
                >
                  <div>
                    <span className="text-xs text-gray-600">Mã ưu đãi:</span>
                    <div className="font-bold text-gray-900 text-lg">
                      {promo.code}
                    </div>
                  </div>
                  <button className="bg-white text-gray-800 hover:text-rose-600 px-2 py-1 rounded border border-gray-200 text-xs font-medium transition-colors shadow-sm flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Sao chép
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs">Hết hạn: {promo.expiryDate}</span>
                  </div>

                  <button className="text-rose-600 hover:text-rose-800 text-sm font-medium transition-colors flex items-center">
                    <span>Áp dụng ngay</span>
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Promotions;
