import http from "../http";

/**
 * Get amenities with pagination and search
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 6)
 * @param {string} params.search - Search term for amenity name/description
 * @returns {Promise} API response with amenities data
 */
export async function getAmenitiesData({
  page = 1,
  limit = 6,
  search = "",
} = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (search) params.append("search", search);

  return http.get(`/api/admin/UtilitiesManager?${params.toString()}`, {
    requireAuth: true,
  });
}

/**
 * Create new amenity
 * @param {Object} data - Amenity data
 * @param {string} data.name - Amenity name
 * @param {string} data.description - Amenity description
 * @returns {Promise} API response
 */
export async function createAmenity(data) {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);

  return http.post(`/api/admin/UtilitiesManager/create`, formData, {
    requireAuth: true,
  });
}

/**
 * Update amenity
 * @param {string} id - Amenity ID
 * @param {Object} data - Update data
 * @param {string} data.name - Amenity name
 * @param {string} data.description - Amenity description
 * @returns {Promise} API response
 */
export async function updateAmenity(id, data) {
  const formData = new FormData();
  if (data.name) formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);

  return http.put(`/api/admin/UtilitiesManager/${id}`, formData, {
    requireAuth: true,
  });
}

/**
 * Delete amenity
 * @param {string} id - Amenity ID
 * @returns {Promise} API response
 */
export async function deleteAmenity(id) {
  return http.post(`/api/admin/UtilitiesManager/delete/${id}`, null, {
    requireAuth: true,
  });
}
