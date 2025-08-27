import { useState, useEffect, useRef } from "react";

/**
 * useFetch - Hook fetch dữ liệu đơn giản, hỗ trợ GET, tự động cập nhật khi url/tham số thay đổi
 * @param {string} url - endpoint cần fetch
 * @param {object} options - tuỳ chọn fetch (method, headers, body...)
 * @param {array} deps - dependencies để tự động refetch
 * @returns {object} { data, error, loading, refetch }
 */
export default function useFetch(url, options = {}, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      const res = await fetch(url, {
        ...options,
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error(await res.text());
      const contentType = res.headers.get("content-type");
      const result =
        contentType && contentType.includes("application/json")
          ? await res.json()
          : await res.text();
      setData(result);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
    // eslint-disable-next-line
  }, [url, ...deps]);

  return { data, error, loading, refetch: fetchData };
}
