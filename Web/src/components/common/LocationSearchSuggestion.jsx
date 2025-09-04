import React, { useState, useRef, useEffect } from "react";
import { useLocationData } from "../../hooks/useLocation";

/**
 * Component gợi ý tìm kiếm địa điểm
 * Props:
 * - value: giá trị hiện tại
 * - onChange: hàm gọi khi chọn hoặc nhập
 * - placeholder: placeholder cho input
 * - debounceTime: thời gian debounce trước khi gọi API (ms)
 */
const LocationSearchSuggestion = ({
  value,
  onChange,
  placeholder = "Bạn muốn đi đâu?",
  debounceTime = 300,
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Sử dụng hook useLocationData để tìm kiếm
  const { searchByPrefix, searchResults, loadingSearch, errorSearch } =
    useLocationData();

  // Xử lý nhập
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);

    // Gọi onChange ngay lập tức để cập nhật value trong form cha
    if (onChange) onChange(value);

    // Debounce gọi API tìm kiếm
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchByPrefix(value);
    }, debounceTime);
  };

  // Xử lý chọn gợi ý
  const handleSelect = (location) => {
    // Lấy giá trị tên địa điểm từ kết quả API
    const locationName = location.tenKv || location.name || location;

    setInputValue(locationName);
    setShowSuggestions(false);
    // Truyền cả tên và đối tượng location để form cha có thể lấy id
    if (onChange) onChange(locationName, location);
    inputRef.current.blur();
  };

  // Ẩn gợi ý khi blur
  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100);
  };

  // Cập nhật inputValue khi prop value thay đổi từ bên ngoài
  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-700 shadow-sm transition-all duration-150"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleBlur}
        autoComplete="off"
      />

      {/* Hiển thị biểu tượng loading khi đang tìm kiếm */}
      {loadingSearch && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-5 w-5 border-2 border-rose-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* Danh sách gợi ý */}
      {showSuggestions && searchResults.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-md shadow-lg z-50 max-h-60 overflow-auto divide-y divide-gray-100">
          {searchResults.map((location, idx) => {
            // Xử lý dữ liệu theo đúng định dạng API trả về
            const name = location.tenKv || location.name || location;
            return (
              <li
                key={`${typeof name === "object" ? idx : name}-${idx}`}
                className="cursor-pointer transition-colors duration-150"
                onMouseDown={() => handleSelect(location)}
              >
                <div className="flex items-center px-4 py-3 hover:bg-rose-50">
                  <div className="mr-3 text-rose-500">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{name}</div>
                    <div className="text-sm text-gray-500">
                      Địa điểm du lịch
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Thông báo khi không có kết quả */}
      {showSuggestions &&
        inputValue &&
        !loadingSearch &&
        searchResults.length === 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-md shadow-lg z-50 px-4 py-5 text-center">
            <div className="text-gray-400 mb-1">
              <i className="fas fa-search fa-lg"></i>
            </div>
            <div className="text-gray-700 font-medium">
              Không tìm thấy địa điểm
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Vui lòng thử từ khóa khác
            </div>
          </div>
        )}

      {/* Hiển thị lỗi nếu có */}
      {showSuggestions && errorSearch && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-rose-100 rounded-md shadow-lg z-50 px-4 py-5 text-center">
          <div className="text-rose-500 mb-1">
            <i className="fas fa-exclamation-circle fa-lg"></i>
          </div>
          <div className="text-gray-700 font-medium">Đã xảy ra lỗi</div>
          <div className="text-sm text-rose-500 mt-1">{errorSearch}</div>
        </div>
      )}
    </div>
  );
};

export default LocationSearchSuggestion;
