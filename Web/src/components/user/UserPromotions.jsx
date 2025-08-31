import React, { useState } from "react";
import Pagination from "../common/Pagination";

const UserPromotions = () => {
  // Dummy data mẫu có hình ảnh
  const promotions = [
    {
      id: "KM001",
      title: "Giảm giá 10% cho đơn đầu tiên",
      description: "Áp dụng cho tất cả homestay, tối đa 500.000đ.",
      expiry: "31/12/2025",
      image: "https://source.unsplash.com/400x300/?discount,homestay",
    },
    {
      id: "KM002",
      title: "Tặng dịch vụ spa miễn phí",
      description: "Khi đặt phòng tại Sapa View Fansipan.",
      expiry: "15/10/2025",
      image: "https://source.unsplash.com/400x300/?spa,homestay",
    },
    {
      id: "KM003",
      title: "Voucher 200k cho Hội An Riverside",
      description: "Áp dụng cho phòng Superior View Sông.",
      expiry: "30/09/2025",
      image: "https://source.unsplash.com/400x300/?voucher,homestay",
    },
    {
      id: "KM004",
      title: "Miễn phí ăn sáng",
      description: "Cho tất cả phòng tại Đà Lạt View Đồi.",
      expiry: "10/11/2025",
      image: "https://source.unsplash.com/400x300/?breakfast,homestay",
    },
    // ... thêm nhiều khuyến mãi mẫu nếu muốn
  ];

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
    setTimeout(() => {
      const el = document.getElementById("promotions-title");
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 0);
  };
  const pageSize = 2;
  const totalPages = Math.ceil(promotions.length / pageSize);
  const pagedPromotions = promotions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <section>
      <h3
        id="promotions-title"
        className="text-xl font-bold text-gray-900 mb-6 flex items-center"
      >
        <svg
          className="w-5 h-5 mr-2 text-rose-500"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7" />
          <rect x="2" y="7" width="20" height="5" rx="2" />
          <path d="M12 7V2m0 0a3 3 0 013 3v2m-3-5a3 3 0 00-3 3v2" />
        </svg>
        Khuyến mãi của tôi
      </h3>
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
        {promotions.length === 0 ? (
          <p className="text-gray-500 text-center">
            Bạn chưa có khuyến mãi nào.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagedPromotions.map((promo) => (
                <div
                  key={promo.id}
                  className="group bg-gradient-to-br from-rose-50 via-white to-cyan-50 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full"
                >
                  <div className="relative">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-rose-600 text-white text-xs px-3 py-1 rounded-full shadow">
                      {promo.id}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col p-4">
                    <h3 className="font-bold text-lg text-rose-700 mb-2 group-hover:text-rose-800 transition-colors">
                      {promo.title}
                    </h3>
                    <p className="text-gray-700 text-sm mb-3 flex-1">
                      {promo.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-gray-400">
                        HSD: {promo.expiry}
                      </span>
                      <span className="bg-rose-100 text-rose-600 px-2 py-1 rounded text-xs font-medium">
                        Còn hiệu lực
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChangePage={handleChangePage}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default UserPromotions;
