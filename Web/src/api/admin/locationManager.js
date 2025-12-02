import http from "../http";

export async function getLocation({ page = 1, limit = 20, search = "" } = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (search) params.append("search", search);
  return http.get(`/api/admin/locationmanager?${params.toString()}`, {
    requireAuth: true,
  });
}

export async function updateLocation(locationId, data) {
  const formData = new FormData();
  formData.append("name", data.name || "");
  formData.append("description", data.description || "");
  formData.append("status", data.status || "active");
  if (data.imageFile) {
    formData.append("image", data.imageFile);
  }

  return http.put(`/api/admin/locationmanager/${locationId}`, formData, {
    requireAuth: true,
  });
}

export async function createLocation(data) {
  // Backend sử dụng @RequestParam để nhận multipart/form-data
  const formData = new FormData();

  formData.append("name", data.name || "");
  formData.append("description", data.description || "");
  if (data.imageFile) {
    formData.append("image", data.imageFile);
  }

  return http.post("/api/admin/locationmanager", formData, {
    requireAuth: true,
  });
}
