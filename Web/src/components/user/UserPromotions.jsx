import React, { useState, useEffect } from "react";
import Pagination from "../common/Pagination";
import useUser from "../../hooks/useUser";
import { getImageUrl } from "../../utils/imageUrl";
import { formatDateDisplay } from "../../utils/date";
const UserPromotions = () => {
  const {
    promotions,
    getMypromotion,
    promotionsPage,
    promotionsLimit,
    promotionsTotal,
    loading,
  } = useUser();

  const LIMIT = 3; // Số lượng khuyến mãi mỗi trang
  // Phân trang local để điều khiển UI
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Load first page on mount với limit = 3
    getMypromotion(1, LIMIT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
    getMypromotion(newPage, LIMIT);
    setTimeout(() => {
      const el = document.getElementById("promotions-title");
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 0);
  };

  const totalPages = LIMIT > 0 ? Math.ceil(promotionsTotal / LIMIT) : 0;
  const pagedPromotions = promotions || [];

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
        {!promotions || promotions.length === 0 ? (
          <p className="text-gray-500 text-center">
            Bạn chưa có khuyến mãi nào.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagedPromotions.map((promo) => (
                <div
                  key={promo.id || promo.code || promo.promotionId}
                  className="group bg-gradient-to-br from-rose-50 via-white to-cyan-50 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full"
                >
                  <div className="relative">
                    <img
                      src={
                        getImageUrl(promo.image) ||
                        promo.thumbnail ||
                        promo.picture ||
                        "https://source.unsplash.com/400x300/?discount,homestay"
                      }
                      alt={
                        promo.title || promo.name || promo.code || "Khuyến mãi"
                      }
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-rose-600 text-white text-xs px-3 py-1 rounded-full shadow">
                      {promo.id || promo.code || promo.promotionId}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col p-4">
                    <h3 className="font-bold text-lg text-rose-700 mb-2 group-hover:text-rose-800 transition-colors">
                      {promo.title || promo.name || promo.code}
                    </h3>
                    <p className="text-gray-700 text-sm mb-3 flex-1">
                      {promo.description || promo.content || ""}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-gray-400">
                        HSD:{" "}
                        {formatDateDisplay(
                          promo.expiry ||
                            promo.expiredAt ||
                            promo.expiryDate ||
                            ""
                        )}
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
