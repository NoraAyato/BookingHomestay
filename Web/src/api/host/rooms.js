import http from "../http";

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

export async function updateHostRoom(id, formData) {
  return http.put(`/api/host/room/${id}`, formData, {
    requireAuth: true,
  });
}

export async function deleteHostRoom(id) {
  return http.post(`/api/host/room/${id}`, {
    requireAuth: true,
  });
}

export async function createHostRoom(formData) {
  return http.post("/api/host/room/create", formData, {
    requireAuth: true,
  });
}

export async function getRoomTypes() {
  return http.get("/api/host/room/roomType-List", {
    requireAuth: true,
  });
}
