import http from "../http";

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

export async function deleteHomestay(id) {
  return http.put(`/api/admin/homestaymanager/delete/${id}`, null, {
    requireAuth: true,
  });
}
