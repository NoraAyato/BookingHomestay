import React, { useState, useRef, useEffect } from "react";
import { useLocationData } from "../../hooks/useLocation";
import { normalizeString } from "../../utils/string";

/**
 * Component gợi ý tìm kiếm địa điểm
 * Props:
 * - value: giá trị hiện tại
 * - onChange: hàm gọi khi chọn hoặc nhập
 * - placeholder: placeholder cho input
 * - debounceTime: thời gian debounce trước khi gọi API (ms)
 * - onLocationMatch: callback khi tìm thấy địa điểm khớp với tên đã nhập
 */
const LocationSearchSuggestion = ({
  value,
  onChange,
  placeholder = "Bạn muốn đi đâu?",
  debounceTime = 300,
  onLocationMatch,
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const justSelectedRef = useRef(false);

  // Sử dụng hook useLocationData để tìm kiếm
  const {
    searchByPrefix,
    searchResults,
    loadingSearch,
    errorSearch,
    allLocations,
  } = useLocationData();
  // Ghost suggestion
  const firstSuggestion =
    showSuggestions && searchResults.length > 0
      ? searchResults[0].tenKv || searchResults[0].name || ""
      : "";

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

  // Xử lý Tab hoặc → để fill gợi ý đầu tiên
  const handleKeyDown = (e) => {
    if ((e.key === "Tab" || e.key === "ArrowRight") && firstSuggestion) {
      // Nếu inputValue là prefix của gợi ý đầu tiên thì fill luôn
      if (
        firstSuggestion.toLowerCase().startsWith(inputValue.toLowerCase()) &&
        inputValue !== firstSuggestion
      ) {
        e.preventDefault();
        setInputValue(firstSuggestion);
        setShowSuggestions(false);
        if (onChange) onChange(firstSuggestion, searchResults[0]);
        // Đưa con trỏ về cuối input
        setTimeout(() => {
          if (inputRef.current)
            inputRef.current.setSelectionRange(
              firstSuggestion.length,
              firstSuggestion.length
            );
        }, 0);
      }
    }
  };

  // Xử lý chọn gợi ý
  const handleSelect = (location) => {
    // Lấy giá trị tên địa điểm từ kết quả API
    const locationName = location.tenKv;

    setInputValue(locationName);
    setShowSuggestions(false);
    justSelectedRef.current = true;
    // Truyền cả tên và đối tượng location để form cha có thể lấy id
    if (onChange) onChange(locationName, location);
    inputRef.current.blur();
  };

  // Ẩn gợi ý khi blur và kiểm tra tìm kiếm chính xác
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      // Nếu vừa chọn từ danh sách thì không làm gì nữa
      if (justSelectedRef.current) {
        justSelectedRef.current = false;
        return;
      }
      // Kiểm tra nếu giá trị nhập khớp chính xác hoặc gần đúng với một địa điểm nào đó
      if (inputValue && inputValue.trim()) {
        const normalizedInput = normalizeString(inputValue);
        // Tìm trong kết quả tìm kiếm hiện tại trước
        let matched = searchResults.find((loc) => {
          const normalizedTenKv = normalizeString(loc.tenKv);
          return normalizedTenKv === normalizedInput;
        });
        // Nếu không có khớp tuyệt đối, tìm khớp gần đúng (input là một phần tên KV)
        if (!matched) {
          matched = searchResults.find((loc) => {
            const normalizedTenKv = normalizeString(loc.tenKv);
            return normalizedTenKv.includes(normalizedInput);
          });
        }
        // Nếu vẫn không có, tìm trong toàn bộ danh sách
        if (!matched) {
          matched = allLocations.find((loc) => {
            const normalizedTenKv = normalizeString(loc.tenKv);
            return normalizedTenKv === normalizedInput;
          });
        }
        if (!matched) {
          matched = allLocations.find((loc) => {
            const normalizedTenKv = normalizeString(loc.tenKv);
            return normalizedTenKv.includes(normalizedInput);
          });
        }
        if (matched) {
          // Tự động fill lại tên khu vực đúng vào input
          const locationName = matched.tenKv;
          setInputValue(locationName);
          if (onChange) onChange(locationName, matched);
        } else if (onChange) {
          onChange(inputValue, undefined);
        }
      }
    }, 100);
  };

  // Cập nhật inputValue khi prop value thay đổi từ bên ngoài
  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  return (
    <div className="relative">
      {/* Ghost suggestion overlay */}
      <div
        className="absolute left-0 top-0 h-full w-full pointer-events-none select-none flex items-center"
        style={{ zIndex: 1 }}
      >
        {firstSuggestion &&
          inputValue &&
          firstSuggestion.toLowerCase().startsWith(inputValue.toLowerCase()) &&
          inputValue !== firstSuggestion && (
            <span
              className="pl-10 pr-4 py-3 text-gray-400 bg-transparent font-normal"
              style={{
                position: "absolute",
                left: 0,
                top: "-5.2px",
                lineHeight: "2.25rem",
                fontSize: "1rem",
                fontFamily: "inherit",
                pointerEvents: "none",
                whiteSpace: "pre",
              }}
            >
              <span style={{ visibility: "hidden" }}>{inputValue}</span>
              {firstSuggestion.slice(inputValue.length)}
            </span>
          )}
      </div>
      <input
        ref={inputRef}
        type="text"
        className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-700 shadow-sm transition-all duration-150 bg-transparent"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        style={{ position: "relative", zIndex: 2, background: "transparent" }}
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
