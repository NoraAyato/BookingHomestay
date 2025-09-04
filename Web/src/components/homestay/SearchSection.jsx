import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LocationSearchSuggestion from "../common/LocationSearchSuggestion";

const SearchSection = ({ searchParams, setSearchParams, handleSubmit }) => {
  // Lấy query params từ URL
  const [urlSearchParams] = useSearchParams();

  // Đồng bộ query params vào state của component cha khi lần đầu load
  useEffect(() => {
    const location = urlSearchParams.get("location");
    const locationId = urlSearchParams.get("locationId");
    const checkIn = urlSearchParams.get("checkIn");
    const checkOut = urlSearchParams.get("checkOut");

    if (location || checkIn || checkOut) {
      // Chỉ cập nhật nếu có ít nhất một tham số
      const newParams = { ...searchParams };

      if (location) newParams.location = location;
      if (locationId) newParams.locationId = locationId;
      if (checkIn) newParams.checkIn = checkIn;
      if (checkOut) newParams.checkOut = checkOut;

      setSearchParams(newParams);
    }
  }, []);
  return (
    <div className="bg-gradient-to-r from-rose-500 to-rose-600 py-12 relative overflow-visible">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white"></div>
        <div className="absolute top-20 right-20 w-24 h-24 rounded-full bg-white"></div>
        <div className="absolute bottom-10 left-1/3 w-16 h-16 rounded-full bg-white"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Tìm kiếm Homestay
          </h1>
          <p className="text-rose-100 text-lg max-w-2xl mx-auto">
            Khám phá và đặt phòng tại những Homestay tuyệt vời trên khắp Việt
            Nam
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 max-w-5xl mx-auto transform transition-all">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-5 relative z-30">
                <label
                  htmlFor="location"
                  className="block text-gray-700 font-medium text-sm mb-1"
                >
                  <i className="fas fa-map-marker-alt text-rose-500 mr-2"></i>
                  Địa điểm
                </label>
                <LocationSearchSuggestion
                  value={searchParams.location}
                  onChange={(value, locationData) => {
                    setSearchParams({
                      ...searchParams,
                      location: value,
                      locationId:
                        locationData && locationData.id
                          ? locationData.id
                          : searchParams.locationId,
                    });
                  }}
                  placeholder="Nhập thành phố, quận, huyện..."
                />
              </div>

              <div className="md:col-span-3">
                <label
                  htmlFor="checkIn"
                  className="block text-gray-700 font-medium text-sm mb-1"
                >
                  <i className="far fa-calendar-alt text-rose-500 mr-2"></i>
                  Nhận phòng
                </label>
                <input
                  type="date"
                  id="checkIn"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-700 shadow-sm"
                  value={searchParams.checkIn}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      checkIn: e.target.value,
                    })
                  }
                />
              </div>

              <div className="md:col-span-3">
                <label
                  htmlFor="checkOut"
                  className="block text-gray-700 font-medium text-sm mb-1"
                >
                  <i className="far fa-calendar-alt text-rose-500 mr-2"></i>
                  Trả phòng
                </label>
                <input
                  type="date"
                  id="checkOut"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-700 shadow-sm"
                  value={searchParams.checkOut}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      checkOut: e.target.value,
                    })
                  }
                />
              </div>

              <div className="md:col-span-1 flex justify-center">
                <button
                  type="submit"
                  className="w-full h-12 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
                  aria-label="Tìm kiếm"
                >
                  <i className="fas fa-search text-xl"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
