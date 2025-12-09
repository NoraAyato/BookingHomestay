import http from "../http";

/**
 * Get services with pagination and search
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 6)
 * @param {string} params.search - Search term for service name
 * @returns {Promise} API response with services data
 */
export async function getServicesData({
  page = 1,
  limit = 6,
  search = "",
} = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (search) params.append("search", search);

  return http.get(`/api/admin/servicemanager?${params.toString()}`, {
    requireAuth: true,
  });
}

/**
 * Create new service
 * @param {Object} data - Service data
 * @param {string} data.name - Service name
 * @returns {Promise} API response
 */
export async function createService(data) {
  const params = new URLSearchParams();
  params.append("serviceName", data.name);

  return http.post(
    `/api/admin/servicemanager/create?${params.toString()}`,
    null,
    {
      requireAuth: true,
    }
  );
}

/**
 * Update service
 * @param {string} id - Service ID
 * @param {Object} data - Update data
 * @param {string} data.name - Service name
 * @returns {Promise} API response
 */
export async function updateService(id, data) {
  const params = new URLSearchParams();
  params.append("name", data.name);

  return http.put(
    `/api/admin/servicemanager/update/${id}?${params.toString()}`,
    null,
    {
      requireAuth: true,
    }
  );
}

/**
 * Delete service
 * @param {string} id - Service ID
 * @returns {Promise} API response
 */
export async function deleteService(id) {
  return http.post(`/api/admin/servicemanager/delete/${id}`, null, {
    requireAuth: true,
  });
}
