import { APICache } from "../utils/cache";
import { useState, useEffect } from "react";
const useCachedFetch = (endpoint, options = {}, ttl) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Check cache first
        const cachedData = APICache.get(endpoint);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        // If not in cache, fetch from API
        const response = await fetch(endpoint, options);
        const json = await response.json();

        // Store in cache
        APICache.set(endpoint, json, ttl);

        setData(json);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  const invalidateCache = () => {
    APICache.remove(endpoint);
  };

  return { data, loading, error, invalidateCache };
};
