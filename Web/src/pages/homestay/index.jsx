import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import HomestayList from "../../components/homestay/HomestayList";
import SearchSection from "../../components/homestay/SearchSection";
import { useHomestayData } from "../../hooks/useHomestay";
import { useDebounce } from "../../hooks/useDebounce";
import { useAmenities } from "../../hooks/useAmenities";
import { formatPrice } from "../../utils/price";
import {
  isValidCheckInDate,
  isValidCheckOutDate,
  getDaysBetween,
  getLocalDate,
} from "../../utils/date";
const HomestayIndex = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy giá trị từ URL nếu có, nếu không thì dùng giá trị mặc định
  const getInitialSearchParams = () => {
    const params = new URLSearchParams(location.search);
    const hasParams = params.toString().length > 0;

    if (!hasParams) {
      // Nếu không có tham số trong URL, sử dụng giá trị mặc định
      return {
        location: "",
        locationId: "",
        checkIn: getLocalDate(0),
        checkOut: getLocalDate(1),
        minPrice: 100000,
        maxPrice: 5000000,
        amenities: [],
        page: 1,
        limit: 12,
      };
    }

    // Nếu có tham số trong URL, lấy từ URL
    const initialParams = {
      location: params.get("location") || "",
      locationId: params.get("locationId") || "",
      checkIn: params.get("checkIn") || getLocalDate(0),
      checkOut: params.get("checkOut") || getLocalDate(1),
      minPrice: params.get("minPrice")
        ? parseInt(params.get("minPrice"))
        : 100000,
      maxPrice: params.get("maxPrice")
        ? parseInt(params.get("maxPrice"))
        : 5000000,
      amenities: params.getAll("amenities") || [],
      page: params.get("page") ? parseInt(params.get("page")) : 1,
      limit: 12,
    };

    return initialParams;
  };

  // State for search parameters and results
  const [searchParams, setSearchParams] = useState(getInitialSearchParams());

  // Debounced search params để giảm thiểu số lần gọi API khi người dùng đang thay đổi tham số
  const debouncedSearchParams = useDebounce(searchParams, 500);

  // Hàm kiểm tra xem có thể tìm kiếm với tham số hiện tại hay không
  const canSearch = (params) => {
    // Kiểm tra cả checkIn và checkOut phải tồn tại và không phải chuỗi rỗng
    if (
      !params.checkIn ||
      params.checkIn.trim() === "" ||
      !params.checkOut ||
      params.checkOut.trim() === ""
    ) {
      return false;
    }

    // Validate ngày nhận không quá 30 ngày từ hôm nay
    if (!isValidCheckInDate(params.checkIn)) {
      return false;
    }

    // Validate ngày trả phải sau ngày nhận
    if (!isValidCheckOutDate(params.checkIn, params.checkOut)) {
      return false;
    }

    // Validate khoảng cách không quá 30 ngày
    const diff = getDaysBetween(params.checkIn, params.checkOut);
    if (diff > 30) {
      return false;
    }

    return true;
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.getAll("amenities") || [];
  });
  const [priceRange, setPriceRange] = useState(() => {
    const params = new URLSearchParams(location.search);
    const minPrice = params.get("minPrice")
      ? parseInt(params.get("minPrice"))
      : 100000;
    const maxPrice = params.get("maxPrice")
      ? parseInt(params.get("maxPrice"))
      : 5000000;
    return [minPrice, maxPrice];
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const { searchResults, loadingSearch, errorSearch, searchHomestays } =
    useHomestayData();

  // Hook để lấy danh sách tiện ích từ API
  const {
    amenities,
    loading: amenitiesLoading,
    error: amenitiesError,
  } = useAmenities();

  // Fetch homestays based on debounced search parameters
  useEffect(() => {
    // Chỉ gọi API khi cả checkIn và checkOut đều có giá trị hợp lệ
    if (canSearch(debouncedSearchParams)) {
      searchHomestays(debouncedSearchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchParams]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateUrlAndRefetch();
  };

  // Handle price range change
  const handlePriceRangeChange = (newPriceRange) => {
    let [min, max] = newPriceRange;
    // Đảm bảo min không lớn hơn max và max không nhỏ hơn min
    if (min > max) min = max;
    if (max < min) max = min;
    // Giới hạn min/max trong khoảng hợp lệ
    if (min < 100000) min = 100000;
    if (max > 10000000) max = 10000000;
    setPriceRange([min, max]);
  };

  // Handle amenity selection
  const handleAmenityChange = (amenityId) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenityId)) {
        return prev.filter((id) => id !== amenityId);
      } else {
        return [...prev, amenityId];
      }
    });
  };

  // Apply filters button click
  const applyFilters = () => {
    setSearchParams((prev) => ({
      ...prev,
      page: 1, // Reset to first page when applying new filters
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
      amenities: selectedAmenities,
    }));

    // updateUrlAndRefetch();
  };

  // Reset filters button click
  const resetFilters = () => {
    setSearchParams({
      location: "",
      locationId: "",
      checkIn: getLocalDate(0),
      checkOut: getLocalDate(1),
      minPrice: 100000,
      maxPrice: 5000000,
      amenities: [],
      page: 1,
      limit: 12,
    });
    setSelectedAmenities([]);
    setPriceRange([100000, 5000000]);

    // Clear URL parameters and navigate to base path
    navigate("/homestay");
  }; // Handle page change for pagination
  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({
      ...prev,
      page: newPage,
    }));

    updateUrlAndRefetch();
  };

  // Update URL with current search parameters
  const updateUrlAndRefetch = () => {
    // Kiểm tra xem có thể tìm kiếm với tham số hiện tại hay không
    if (!canSearch(searchParams)) {
      return; // Không thực hiện tìm kiếm nếu thiếu tham số
    }

    const params = new URLSearchParams();

    if (searchParams.location) params.append("location", searchParams.location);
    if (searchParams.locationId)
      params.append("locationId", searchParams.locationId);
    if (searchParams.checkIn) params.append("checkIn", searchParams.checkIn);
    if (searchParams.checkOut) params.append("checkOut", searchParams.checkOut);
    if (priceRange[0] !== 100000)
      params.append("minPrice", priceRange[0].toString());
    if (priceRange[1] !== 5000000)
      params.append("maxPrice", priceRange[1].toString());
    if (searchParams.page > 1)
      params.append("page", searchParams.page.toString());

    // Add all selected amenities
    selectedAmenities.forEach((amenity) => {
      params.append("amenities", amenity);
    });

    navigate({
      pathname: "/homestay",
      search: params.toString(),
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search section */}
      <SearchSection
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        handleSubmit={handleSubmit}
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6 py-6">
          {/* Filters */}
          <div
            className={`${
              isFilterVisible ? "block" : "hidden"
            } md:block md:w-64 shrink-0`}
          >
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-6 md:sticky md:top-10">
              <h2 className="text-lg font-semibold text-gray-800 pb-2 border-b">
                Bộ lọc
              </h2>

              {/* Price range filter */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Khoảng giá</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">
                    {formatPrice(priceRange[0])}đ
                  </span>
                  <span className="text-gray-600 text-sm">
                    {formatPrice(priceRange[1])}đ
                  </span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="100000"
                  value={priceRange[0]}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    // Không cho min vượt quá max
                    if (val > priceRange[1]) val = priceRange[1];
                    handlePriceRangeChange([val, priceRange[1]]);
                  }}
                  className="w-full"
                />
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="100000"
                  value={priceRange[1]}
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    // Không cho max nhỏ hơn min
                    if (val < priceRange[0]) val = priceRange[0];
                    handlePriceRangeChange([priceRange[0], val]);
                  }}
                  className="w-full"
                />
              </div>

              {/* Amenities filter */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-700">Tiện nghi</h3>
                {amenitiesLoading ? (
                  <div className="text-gray-500 text-sm">
                    Đang tải tiện ích...
                  </div>
                ) : amenitiesError ? (
                  <div className="text-red-500 text-sm">
                    Lỗi: {amenitiesError}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {amenities.map((amenity) => (
                      <label
                        key={amenity.id}
                        className="flex items-start gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 text-rose-600 rounded focus:ring-rose-500"
                          checked={selectedAmenities.includes(amenity.id)}
                          onChange={() => handleAmenityChange(amenity.id)}
                        />
                        <div className="flex items-center">
                          <span className="text-gray-700">{amenity.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={applyFilters}
                  className="w-full py-2 px-4 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
                >
                  Áp dụng bộ lọc
                </button>
                <button
                  onClick={resetFilters}
                  className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Đặt lại
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* Loading state */}
            {loadingSearch ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <LoadingSpinner />
              </div>
            ) : errorSearch ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p>{errorSearch}</p>
              </div>
            ) : (
              <>
                <HomestayList
                  homestays={searchResults}
                  loading={loadingSearch}
                  totalResults={searchResults.length}
                  formatPrice={formatPrice}
                  searchParams={searchParams}
                />

                {/* Pagination */}
                {searchResults.length > searchParams.limit && (
                  <Pagination
                    currentPage={searchParams.page}
                    totalPages={Math.ceil(
                      searchResults.length / searchParams.limit
                    )}
                    onChangePage={handlePageChange}
                    prevLabel="Trước"
                    nextLabel="Sau"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomestayIndex;
