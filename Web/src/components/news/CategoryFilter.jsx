import React, { useState, useRef, useEffect } from "react";

// Component Dropdown cho categories bổ sung
const CategoryDropdown = ({ categories, activeCategory, onSelect, count }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeInDropdown = categories.some((cat) => cat.id === activeCategory);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center ${
          activeInDropdown
            ? "bg-rose-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {activeInDropdown ? (
          <>
            {categories.find((cat) => cat.id === activeCategory)?.name}
            <span className="ml-1.5 text-xs text-rose-100">
              ({count(activeCategory)})
            </span>
          </>
        ) : (
          "Thêm..."
        )}
        <i
          className={`fas fa-chevron-down ml-2 text-xs transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        ></i>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50 max-h-[300px] overflow-y-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onSelect(category.id);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                activeCategory === category.id
                  ? "bg-rose-50 text-rose-600 font-medium"
                  : "text-gray-700"
              }`}
            >
              <span>{category.name}</span>
              <span
                className={`text-xs ${
                  activeCategory === category.id
                    ? "text-rose-500"
                    : "text-gray-400"
                }`}
              >
                ({count(category.id)})
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Component chính cho Category Filter
const CategoryFilter = ({
  popularCategories = [],
  moreCategories = [],
  currentCategory,
  onCategoryChange,
  getCategoryCount,
  loading = false,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Popular categories as tabs */}
        {popularCategories.map((category) => {
          const count = getCategoryCount(category.id);
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              disabled={loading}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                currentCategory === category.id
                  ? "bg-rose-600 text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
              {count !== "" && (
                <span
                  className={`ml-1.5 text-xs ${
                    currentCategory === category.id
                      ? "text-rose-100"
                      : "text-gray-500"
                  }`}
                >
                  ({count})
                </span>
              )}
            </button>
          );
        })}

        {/* More categories in dropdown */}
        {moreCategories.length > 0 && (
          <CategoryDropdown
            categories={moreCategories}
            activeCategory={currentCategory}
            onSelect={onCategoryChange}
            count={getCategoryCount}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
