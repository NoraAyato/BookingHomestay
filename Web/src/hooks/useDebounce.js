import { useState, useEffect, useRef } from "react";

// Custom hook để debounce giá trị
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const isFirstRender = useRef(true);
  const previousValue = useRef(value);

  useEffect(() => {
    // Nếu là lần đầu render, không cần debounce
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousValue.current = value;
      return;
    }

    // So sánh deep equality để tránh trigger khi object reference thay đổi nhưng giá trị giống nhau
    const hasChanged =
      JSON.stringify(previousValue.current) !== JSON.stringify(value);

    if (!hasChanged) {
      return;
    }

    // Tạo timer để trì hoãn việc cập nhật giá trị
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      previousValue.current = value;
    }, delay);

    // Xóa timer cũ nếu giá trị thay đổi
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
