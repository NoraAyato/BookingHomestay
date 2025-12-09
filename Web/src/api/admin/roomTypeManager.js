import http from "../http";

/**
 * Get room types with pagination and search
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 6)
 * @param {string} params.search - Search term for room type name/description
 * @returns {Promise} API response with room types data
 */
export async function getRoomTypesData({
  page = 1,
  limit = 6,
  search = "",
} = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (search) params.append("search", search);

  return http.get(`/api/admin/roomsmanager/roomType?${params.toString()}`, {
    requireAuth: true,
  });
}

/**
 * Create new room type
 * @param {Object} data - Room type data
 * @param {string} data.name - Room type name
 * @param {string} data.description - Room type description
 * @returns {Promise} API response
 */
export async function createRoomType(data) {
  return http.post(`/api/admin/roomsmanager/roomType/create`, data, {
    requireAuth: true,
  });
}

/**
 * Update room type
 * @param {string} id - Room type ID
 * @param {Object} data - Update data
 * @param {string} data.name - Room type name
 * @param {string} data.description - Room type description
 * @returns {Promise} API response
 */
export async function updateRoomType(id, data) {
  const formData = new FormData();
  if (data.name) formData.append("newName", data.name);
  if (data.description) formData.append("newDescription", data.description);

  return http.put(`/api/admin/roomsmanager/roomType/${id}`, formData, {
    requireAuth: true,
  });
}

/**
 * Delete room type
 * @param {string} id - Room type ID
 * @returns {Promise} API response
 */
export async function deleteRoomType(id) {
  return http.post(`/api/admin/roomsmanager/roomType/delete/${id}`, null, {
    requireAuth: true,
  });
}
