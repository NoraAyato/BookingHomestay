import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import HomestayList from "../../components/homestay/HomestayList";
import SearchSection from "../../components/homestay/SearchSection";
import { useHomestayData } from "../../hooks/useHomestay";
import { useDebounce } from "../../hooks/useDebounce";
import { formatPrice } from "../../utils/price";
const HomestayIndex = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hàm lấy local date yyyy-mm-dd
  const getLocalDate = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // State for search parameters and results
  const [searchParams, setSearchParams] = useState({
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

  // Debounced search params để giảm thiểu số lần gọi API khi người dùng đang thay đổi tham số
  const debouncedSearchParams = useDebounce(searchParams, 500);

  // Hàm kiểm tra xem có thể tìm kiếm với tham số hiện tại hay không
  const canSearch = (params) => {
    // Kiểm tra cả checkIn và checkOut phải tồn tại và không phải chuỗi rỗng
    return (
      params.checkIn &&
      params.checkIn.trim() !== "" &&
      params.checkOut &&
      params.checkOut.trim() !== ""
    );
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [priceRange, setPriceRange] = useState([100000, 5000000]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const { searchResults, loadingSearch, errorSearch, searchHomestays } =
    useHomestayData();

  // Parse URL query parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newSearchParams = { ...searchParams };

    if (params.has("location"))
      newSearchParams.location = params.get("location");
    if (params.has("locationId"))
      newSearchParams.locationId = params.get("locationId");
    if (params.has("checkIn")) newSearchParams.checkIn = params.get("checkIn");
    if (params.has("checkOut"))
      newSearchParams.checkOut = params.get("checkOut");
    if (params.has("minPrice"))
      newSearchParams.minPrice = params.get("minPrice");
    if (params.has("maxPrice"))
      newSearchParams.maxPrice = params.get("maxPrice");
    if (params.has("page")) newSearchParams.page = parseInt(params.get("page"));
    if (params.has("amenities")) {
      const amenities = params.getAll("amenities");
      newSearchParams.amenities = amenities;
      setSelectedAmenities(amenities);
    }

    setSearchParams(newSearchParams);

    // Update price range if min/max price are in URL
    if (newSearchParams.minPrice && newSearchParams.maxPrice) {
      setPriceRange([
        parseInt(newSearchParams.minPrice),
        parseInt(newSearchParams.maxPrice),
      ]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

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

    updateUrlAndRefetch();
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

  // List of amenity options
  const amenityOptions = [
    { id: "Wifi", label: "Wifi", icon: "fa-wifi" },
    { id: "Máy lạnh", label: "Máy lạnh", icon: "fa-snowflake" },
    { id: "Bếp", label: "Bếp", icon: "fa-utensils" },
    { id: "Máy giặt", label: "Máy giặt", icon: "fa-tshirt" },
    { id: "TV", label: "TV", icon: "fa-tv" },
    { id: "Hồ bơi", label: "Hồ bơi", icon: "fa-swimming-pool" },
    { id: "Bãi đậu xe", label: "Bãi đậu xe", icon: "fa-parking" },
    { id: "Bồn tắm", label: "Bồn tắm", icon: "fa-bath" },
  ];

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
                <div className="space-y-2">
                  {amenityOptions.map((amenity) => (
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
                        <i
                          className={`fas ${amenity.icon} text-gray-500 mr-2 w-5`}
                        ></i>
                        <span className="text-gray-700">{amenity.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
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
