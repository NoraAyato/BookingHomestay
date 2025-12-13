import http from "../http";

/**
 * Get host's services with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.size - Items per page (default: 6)
 * @param {string} params.search - Search term for service name
 * @param {string} params.homestayId - Homestay ID filter
 * @returns {Promise} API response with service data
 */
export async function getHostServices({
  page = 1,
  size = 6,
  search = "",
  homestayId = "",
} = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);

  if (search) params.append("search", search);
  if (homestayId) params.append("homestayId", homestayId);

  return http.get(`/api/host/service?${params.toString()}`, {
    requireAuth: true,
  });
}

/**
 * Create new service
 * @param {FormData} formData - FormData object containing service data
 * @returns {Promise} API response
 */
export async function createHostService(formData) {
  return http.post("/api/host/service/create", formData, {
    requireAuth: true,
  });
}

/**
 * Update service information
 * @param {string} id - Service ID
 * @param {FormData} formData - FormData object containing update data
 * @returns {Promise} API response
 */
export async function updateHostService(id, formData) {
  return http.put(`/api/host/service/${id}`, formData, {
    requireAuth: true,
  });
}

/**
 * Delete service
 * @param {string} id - Service ID
 * @returns {Promise} API response
 */
export async function deleteHostService(id) {
  return http.post(`/api/host/service/${id}`, {
    requireAuth: true,
  });
}
