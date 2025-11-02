import React, { useState } from "react";
import Pagination from "../common/Pagination";
import { getImageUrl } from "../../utils/imageUrl";
import { formatPrice } from "../../utils/price";
import { Link } from "react-router-dom";

const FAVORITES_PER_PAGE = 6;

const UserFavorites = ({ favorites, addFavorite, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Ensure favorites is always an array
  const favoritesList = Array.isArray(favorites) ? favorites : [];

  const totalPages = Math.ceil(favoritesList.length / FAVORITES_PER_PAGE);
  const paginatedFavorites = favoritesList.slice(
    (currentPage - 1) * FAVORITES_PER_PAGE,
    currentPage * FAVORITES_PER_PAGE
  );

  const scrollToFavoritesTitle = () => {
    const el = document.getElementById("favorites-title");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
    setTimeout(scrollToFavoritesTitle, 0);
  };
  console.log("Favorites:", favoritesList);
  return (
    <div>
      {/* Simple Header - matching UserBookings style */}
      <h3
        id="favorites-title"
        className="text-xl font-bold text-gray-900 mb-6 flex items-center"
      >
        <svg
          className="w-5 h-5 mr-2 text-rose-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
        Homestay yêu thích của bạn
      </h3>

      {paginatedFavorites.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedFavorites.map((fav) => (
              <div
                key={fav.homestayId || fav.id}
                className="bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden hover:border-rose-200 transition-colors"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={getImageUrl(fav.image)}
                    alt={fav.name}
                    className="w-full h-48 object-cover"
                  />
                  {/* Heart button on image */}
                  <button
                    onClick={() => addFavorite(fav.idHomestay)}
                    disabled={loading}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-rose-500 p-2 rounded-full shadow-lg hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Rating badge */}
                  {fav.rating > 0 && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-amber-200 shadow-sm">
                      <svg
                        className="w-3.5 h-3.5 text-amber-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xs font-bold text-amber-700">
                        {fav.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content - compact style matching booking */}
                <div className="p-3">
                  <h4 className="font-bold text-gray-900 text-base mb-2 truncate">
                    {fav.name}
                  </h4>

                  {/* Location */}
                  <div className="flex items-center text-xs text-gray-500 mb-3">
                    <svg
                      className="w-3.5 h-3.5 mr-1 flex-shrink-0 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="truncate">{fav.location}</span>
                  </div>

                  {/* Price and action */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t-2 border-gray-100">
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100 px-2 py-1.5 rounded-lg border border-rose-200 shadow-sm">
                      <div className="text-[9px] font-medium text-rose-700 mb-0.5">
                        Giá khởi điểm
                      </div>
                      <span className="font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-500 whitespace-nowrap">
                        {formatPrice(fav.price)}đ
                      </span>
                    </div>

                    <Link
                      to={`/homestay/detail/${fav.idHomestay}`}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-[10px] font-bold shadow-md transition-all"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChangePage={handleChangePage}
              prevLabel="Trước"
              nextLabel="Sau"
            />
          )}
        </>
      ) : (
        <div className="bg-gradient-to-br from-gray-50 via-white to-rose-50 rounded-2xl p-10 text-center border-2 border-gray-100 shadow-lg">
          <div className="bg-gradient-to-br from-rose-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <svg
              className="w-10 h-10 text-rose-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">
            Chưa có homestay yêu thích
          </h4>
          <p className="text-gray-500 mb-4 text-sm max-w-md mx-auto">
            Hãy khám phá và thêm những homestay yêu thích vào danh sách để dễ
            dàng tìm lại sau này!
          </p>
          <Link
            to="/homestay"
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl hover:from-rose-600 hover:to-rose-700 inline-flex items-center text-sm font-bold shadow-lg transition-all"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Khám phá homestay
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserFavorites;
