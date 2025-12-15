import http from "../http";

/**
 * Get host's rooms with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.size - Items per page (default: 6)
 * @param {string} params.search - Search term for room name or homestay
 * @param {string} params.status - Status filter: Active, Inactive
 * @param {string} params.homestayId - Homestay ID filter
 * @param {string} params.roomTypeId - Room type ID filter
 * @returns {Promise} API response with room data
 */
export async function getHostRooms({
  page = 1,
  size = 6,
  search = "",
  status = "",
  homestayId = "",
  roomTypeId = "",
} = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (homestayId) params.append("homestayId", homestayId);
  if (roomTypeId) params.append("roomTypeId", roomTypeId);
  return http.get(`/api/host/room?${params.toString()}`, {
    requireAuth: true,
  });
}

/**
 * Update room information
 * @param {string} id - Room ID
 * @param {FormData} formData - FormData object containing update data
 * @returns {Promise} API response
 */
export async function updateHostRoom(id, formData) {
  return http.put(`/api/host/room/${id}`, formData, {
    requireAuth: true,
  });
}

/**
 * Delete (deactivate) room
 * @param {string} id - Room ID
 * @returns {Promise} API response
 */
export async function deleteHostRoom(id) {
  return http.post(`/api/host/room/${id}`, {
    requireAuth: true,
  });
}

/**
 * Create new room
 * @param {FormData} formData - FormData object containing room data (including amenitiesIds and images)
 * @returns {Promise} API response
 */
export async function createHostRoom(formData) {
  return http.post("/api/host/room/create", formData, {
    requireAuth: true,
  });
}

/**
 * Get room types list
 * @returns {Promise} API response with room types
 */
export async function getRoomTypes() {
  return http.get("/api/host/room/roomType-List", {
    requireAuth: true,
  });
}
