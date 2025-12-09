import http from "../http";

/**
 * Get homestays with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 6)
 * @param {string} params.search - Search term for homestay name
 * @param {string} params.status - Status filter: Active, Inactive, Pending
 * @param {number} params.minPrice - Minimum price per night
 * @param {number} params.minRoom - Minimum number of rooms
 * @param {string} params.locationId - Location ID (UUID)
 * @param {number} params.rating - Minimum rating
 * @returns {Promise} API response with homestay data
 */
export async function getHomestays({
  page = 1,
  limit = 6,
  search = "",
  status = "",
  minPrice = null,
  minRoom = null,
  locationId = "",
  rating = null,
} = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);

  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (minPrice !== null) params.append("minPrice", minPrice);
  if (minRoom !== null) params.append("minRoom", minRoom);
  if (locationId) params.append("locationId", locationId);
  if (rating !== null) params.append("rating", rating);

  return http.get(`/api/admin/homestaymanager?${params.toString()}`, {
    requireAuth: true,
  });
}

/**
 * Update homestay information
 * @param {string} id - Homestay ID
 * @param {Object} data - Update data
 * @param {string} data.name - Homestay name
 * @param {string} data.description - Description
 * @param {string} data.hostId - Host ID (idHost)
 * @param {string} data.address - Address
 * @param {string} data.locationId - Location ID
 * @param {string} data.status - Status (Active/Inactive)
 * @param {File} data.imageFile - Optional image file
 * @returns {Promise} API response
 */
export async function updateHomestay(id, data) {
  const formData = new FormData();

  // Map frontend field names to backend DTO field names
  if (data.name) formData.append("homestayName", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.hostId) formData.append("idHost", data.hostId);
  if (data.address) formData.append("address", data.address);
  if (data.locationId) formData.append("locationId", data.locationId);
  if (data.status) {
    // Capitalize first letter for backend (Active/Inactive)
    const capitalizedStatus =
      data.status.charAt(0).toUpperCase() + data.status.slice(1);
    formData.append("status", capitalizedStatus);
  }
  if (data.imageFile) formData.append("image", data.imageFile);

  return http.put(`/api/admin/homestaymanager/${id}`, formData, {
    requireAuth: true,
  });
}

/**
 * Add new homestay
 * @param {Object} data - Homestay data
 * @param {string} data.name - Homestay name
 * @param {string} data.description - Description
 * @param {string} data.hostId - Host ID (idHost)
 * @param {string} data.address - Address
 * @param {string} data.locationId - Location ID
 * @param {File} data.imageFile - Required image file
 * @returns {Promise} API response
 */
export async function addHomestay(data) {
  const formData = new FormData();

  // Map frontend field names to backend DTO field names
  if (data.name) formData.append("homestayName", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.hostId) formData.append("idHost", data.hostId);
  if (data.address) formData.append("address", data.address);
  if (data.locationId) formData.append("locationId", data.locationId);
  if (data.imageFile) formData.append("image", data.imageFile);

  return http.post(`/api/admin/homestaymanager`, formData, {
    requireAuth: true,
  });
}

/**
 * Delete homestay
 * @param {string} id - Homestay ID
 * @returns {Promise} API response
 */
export async function deleteHomestay(id) {
  return http.put(`/api/admin/homestaymanager/delete/${id}`, null, {
    requireAuth: true,
  });
}
