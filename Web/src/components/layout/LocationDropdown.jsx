import React, { useState, useRef, useEffect } from "react";
import ReloadLink from "../common/ReloadLink";
import { useLocationData } from "../../hooks/useLocation";
import "./Dropdown.css";

const LocationDropdown = ({ location }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { allLocations, refetchAll } = useLocationData();

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
                <ReloadLink
                  key={item.maKv}
                  to={`/location/${item.maKv}`}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                >
                  {item.tenKv}
                </ReloadLink>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDropdown;
