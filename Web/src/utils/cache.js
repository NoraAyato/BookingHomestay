const CACHE_PREFIX = "api_cache_";
const DEFAULT_TTL = 5 * 60 * 1000;

export class APICache {
  static set(key, data, ttl = DEFAULT_TTL) {
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  }

  static get(key, allowStale = false) {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;

    const { data, timestamp, ttl } = JSON.parse(item);
    // If allowStale is true, return the data even if expired
    if (!allowStale && Date.now() - timestamp > ttl) {
      // Mark as stale but don't remove - useful for fallback scenarios
      return null;
    }
    return data;
  }

  static remove(key) {
    localStorage.removeItem(CACHE_PREFIX + key);
  }

  static clear() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  }

  static isStale(key) {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return true;

    const { timestamp, ttl } = JSON.parse(item);
    return Date.now() - timestamp > ttl;
  }

  static getTimestamp(key) {
    const item = localStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;

    const { timestamp } = JSON.parse(item);
    return timestamp;
  }
}
