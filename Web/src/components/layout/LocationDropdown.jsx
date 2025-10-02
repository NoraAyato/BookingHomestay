import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReloadLink from "../common/ReloadLink";
import { useLocationData } from "../../hooks/useLocation";
import "./Dropdown.css";

const LocationDropdown = ({ location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { allLocations, refetchAll } = useLocationData();

  // Hàm tính ngày hiện tại và ngày tiếp theo theo định dạng YYYY-MM-DD
  const getDateStrings = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    return {
      checkInDate: formatDate(today),
      checkOutDate: formatDate(tomorrow),
    };
  };

  // Hàm xử lý click vào địa điểm
  const handleLocationClick = (item) => {
    const { checkInDate, checkOutDate } = getDateStrings();
    navigate({
      pathname: "/homestay",
      search: `?location=${encodeURIComponent(
        item.tenKv
      )}&locationId=${encodeURIComponent(
        item.maKv || ""
      )}&checkIn=${checkInDate}&checkOut=${checkOutDate}`,
    });
    setIsOpen(false);
  };

  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      ref={dropdownRef}
    >
      <div
        className={`relative px-4 py-2 transition-colors duration-200 group flex items-center font-medium ${
          location.pathname.startsWith("/location")
            ? "text-rose-600 font-bold"
            : "text-gray-700 hover:text-rose-600"
        }`}
      >
        <span className="flex items-center">
          <i className="fas fa-map-marker-alt mr-2"></i>
          Địa điểm
          <i className="fas fa-chevron-down ml-1 text-xs"></i>
        </span>
        <span
          className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-rose-600 transition-all duration-300 ${
            location.pathname.startsWith("/location")
              ? "w-3/4"
              : "w-0 group-hover:w-3/4"
          }`}
        ></span>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-0 w-96 bg-white rounded shadow-lg py-2 border border-gray-100 dropdown-enter dropdown-enter-active">
          <div className="grid grid-cols-2 gap-1">
            {allLocations &&
              allLocations.slice(0, 12).map((item) => (
                <button
                  key={item.maKv}
                  onClick={() => handleLocationClick(item)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 w-full text-left"
                >
                  {item.tenKv}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;
