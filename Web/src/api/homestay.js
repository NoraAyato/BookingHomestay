import http from "./http";

/**
 * Fetch featured homestays for the homepage
 * @param {number} limit - Number of homestays to return (default: 5)
 * @returns {Promise} - Promise resolving to homestay data
 */
export const getFeaturedHomestays = () => {
  return http.get(`/api/homestays/top`);
};

/**
 * Fetch a specific homestay by ID
 * @param {string} id - Homestay ID
 * @returns {Promise} - Promise resolving to homestay data
 */
export const getHomestayById = (id) => {
  return http.get(`/api/homestays/${id}`);
};

/**
 * Search homestays by location, date range, and other filters
 * @param {Object} params - Search parameters
 * @returns {Promise} - Promise resolving to search results
 */
export const searchHomestays = (params = {}) => {
  // Build query string from params
  const queryParams = new URLSearchParams();

  if (params.locationId) queryParams.append("locationId", params.locationId);
  if (params.checkIn) queryParams.append("checkIn", params.checkIn);
  if (params.checkOut) queryParams.append("checkOut", params.checkOut);
  if (params.minPrice) queryParams.append("minPrice", params.minPrice);
  if (params.maxPrice) queryParams.append("maxPrice", params.maxPrice);
  if (params.amenities) {
    params.amenities.forEach((amenity) =>
      queryParams.append("amenities", amenity)
    );
  }
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);

  return http.get(`/api/homestays/search?${queryParams.toString()}`);
};

export const getAvailableRooms = (params = {}) => {
  // Build query string from params
  const queryParams = new URLSearchParams();

  if (params.checkIn) queryParams.append("ngayDen", params.checkIn);
  if (params.checkOut) queryParams.append("ngayDi", params.checkOut);
  // homestayId truyền vào path
  return http.get(
    `/api/homestays/${
      params.homestayId
    }/available-rooms?${queryParams.toString()}`
  );
};

export const getHomestayServices = (homestayId) => {
  return http.get(`/api/homestays/${homestayId}/services`);
};
