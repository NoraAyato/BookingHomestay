const CACHE_PREFIX = "api_cache_";
const DEFAULT_TTL = 5 * 60 * 1000;

class APICache {
  static set(key, data, ttl = DEFAULT_TTL) {
    const item = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
  }

  static get(key, allowStale = false) {
    const item = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;
    const { data, timestamp, ttl } = JSON.parse(item);
    if (!allowStale && Date.now() - timestamp > ttl) {
      return null;
    }
    return data;
  }

  static remove(key) {
    sessionStorage.removeItem(CACHE_PREFIX + key);
  }

  static clear() {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(CACHE_PREFIX))
      .forEach((key) => sessionStorage.removeItem(key));
  }

  static isStale(key) {
    const item = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!item) return true;
    const { timestamp, ttl } = JSON.parse(item);
    return Date.now() - timestamp > ttl;
  }

  static getTimestamp(key) {
    const item = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!item) return null;
    const { timestamp } = JSON.parse(item);
    return timestamp;
  }
}

export { APICache };
