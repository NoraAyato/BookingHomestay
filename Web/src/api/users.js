import http from "./http";

export async function getCurrentUser() {
  return await http.get("/api/users/me", { requireAuth: true });
}

export async function updateUser(data) {
  return await http.put("/api/users/me/update-profile", data, {
    requireAuth: true,
  });
}

export async function updateAvatar(file) {
  const formData = new FormData();
  formData.append("file", file);
  return await http.put("/api/users/me/update-picture", formData, {
    requireAuth: true,
  });
}
export async function getMyBooking(page = 1, limit = 10) {
  return http.get(`/api/users/me/my-bookings?page=${page}&limit=${limit}`, {
    requireAuth: true,
  });
}
export async function setReceiveEmail(isReceiveEmail) {
  return await http.put(`/api/users/me/receive-email/${isReceiveEmail}`, {
    requireAuth: true,
  });
}

export async function addToFavorites(homestayId) {
  return await http.post(
    `/api/users/me/add-favorite-homestay?homestayId=${homestayId}`,
    {
      requireAuth: true,
    }
  );
}
export async function getFavorites() {
  return await http.get(`/api/users/me/my-favorites`, {
    requireAuth: true,
  });
}
