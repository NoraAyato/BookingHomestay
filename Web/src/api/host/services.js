import http from "../http";

export async function getHostServices({
  page = 1,
  size = 6,
  search = "",
  homestayId = "",
  status = "",
} = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);

  if (search) params.append("search", search);
  if (homestayId) params.append("homestayId", homestayId);
  if (status) params.append("status", status);

  return http.get(`/api/host/service?${params.toString()}`, {
    requireAuth: true,
  });
}

export async function createHostService(formData) {
  return http.post("/api/host/service/create", formData, {
    requireAuth: true,
  });
}

export async function updateHostService(id, formData) {
  return http.put(`/api/host/service/${id}`, formData, {
    requireAuth: true,
  });
}

export async function deleteHostService(id) {
  return http.post(`/api/host/service/${id}`, {
    requireAuth: true,
  });
}

export async function getSuggestedServices() {
  return http.get("/api/host/service/suggest-list", {
    requireAuth: true,
  });
}
