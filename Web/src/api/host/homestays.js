import http from "../http";

/**
 * Get homestay statistics for host
 * @returns {Promise} API response with stats data
 */
export async function getHomestayStats() {
  return http.get("/api/host/homestay/stats", {
    requireAuth: true,
  });
}

/**
 * Get host's homestays with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.size - Items per page (default: 4)
 * @param {string} params.search - Search term for homestay name or location
 * @param {string} params.status - Status filter: Active, Inactive
 * @param {string} params.locationId - Location ID filter
 * @param {string} params.sortBy - Sort field
 * @returns {Promise} API response with homestay data
 */
export async function getHostHomestays({
  page = 1,
  size = 4,
  search = "",
  status = "",
  locationId = "",
  sortBy = "",
} = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (locationId) params.append("locationId", locationId);
  if (sortBy) params.append("sortBy", sortBy);

  return http.get(`/api/host/homestay?${params.toString()}`, {
    requireAuth: true,
  });
}

/**
 * Update homestay information
 * @param {string} id - Homestay ID
 * @param {FormData} formData - FormData object containing update data
 * @returns {Promise} API response
 */
export async function updateHostHomestay(id, formData) {
  return http.put(`/api/host/homestay/${id}`, formData, {
    requireAuth: true,
  });
}

/**
 * Delete (deactivate) homestay
 * @param {string} id - Homestay ID
 * @returns {Promise} API response
 */
export async function deleteHostHomestay(id) {
  return http.post(`/api/host/homestay/${id}/delete`, null, {
    requireAuth: true,
  });
}

/**
 * Get host's homestays as select list (for filters/dropdowns)
 * @returns {Promise} API response with array of {id, name}
 */
export async function getHostHomestaysSelectList() {
  return http.get("/api/host/homestay/getHostHomestay", {
    requireAuth: true,
  });
}
