import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

/**
 * SearchableDropdown - A reusable searchable dropdown component
 *
 * @param {Object} props
 * @param {string} props.label - Label text for the dropdown
 * @param {string} props.placeholder - Placeholder text for the dropdown button
 * @param {string} props.value - Currently selected value (ID)
 * @param {Function} props.onChange - Callback when value changes (receives ID)
 * @param {Array} props.options - Array of options: [{id: string, label: string, subtitle?: string}]
 * @param {boolean} props.loading - Loading state
 * @param {string} props.emptyLabel - Label to show when no value is selected
 * @param {string} props.searchPlaceholder - Placeholder for search input
 * @param {React.ReactNode} props.icon - Icon component to show in label
 * @param {boolean} props.allowEmpty - Whether to allow empty selection
 * @param {string} props.emptyOptionLabel - Label for empty option
 */
const SearchableDropdown = ({
  label,
  placeholder = "Chọn...",
  value,
  onChange,
  options = [],
  loading = false,
  emptyLabel = "Chưa chọn",
  searchPlaceholder = "Tìm kiếm...",
  icon,
  allowEmpty = true,
  emptyOptionLabel = "Không chọn",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showDropdown]);

  // Get selected option label
  const getSelectedLabel = () => {
    if (!value) return emptyLabel;
    const option = options.find((opt) => opt.id === value);
    return option ? option.label : emptyLabel;
  };

  // Filter options by search term
  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.subtitle &&
        option.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle option selection
  const handleSelect = (optionId) => {
    onChange(optionId);
    setShowDropdown(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {icon && <span className="inline-block mr-1">{icon}</span>}
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-left bg-white flex items-center justify-between hover:border-gray-400 transition-colors"
      >
        <span className={!value ? "text-gray-400" : ""}>
          {getSelectedLabel() || placeholder}
        </span>
        <Search className="w-4 h-4 text-gray-400" />
      </button>

      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-48">
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500">Đang tải...</div>
            ) : filteredOptions.length > 0 ? (
              <>
                {allowEmpty && !value && (
                  <button
                    type="button"
                    onClick={() => handleSelect("")}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors bg-emerald-50 text-emerald-700"
                  >
                    {emptyOptionLabel}
                  </button>
                )}
                {filteredOptions.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                      value === option.id
                        ? "bg-emerald-50 text-emerald-700"
                        : ""
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    {option.subtitle && (
                      <div className="text-xs text-gray-500">
                        {option.subtitle}
                      </div>
                    )}
                  </button>
                ))}
              </>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                Không tìm thấy kết quả
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
