import { useState, useEffect } from "react";

// Custom hook để debounce giá trị
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Tạo timer để trì hoãn việc cập nhật giá trị
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Xóa timer cũ nếu giá trị thay đổi
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
