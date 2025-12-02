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
export async function getMyPromotion(page = 1, limit = 5) {
  return http.get(`/api/users/me/my-promotions?page=${page}&limit=${limit}`, {
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
    {},
    {
      requireAuth: true,
    }
  );
}
export async function getFavorites(page = 1, limit = 3) {
  return await http.get(
    `/api/users/me/my-favorites?page=${page}&limit=${limit}`,
    {
      requireAuth: true,
    }
  );
}

// Thêm review cho homestay - gửi FormData cho @RequestParam
export async function addReview({
  bookingId,
  homestayId,
  cleanlinessRating,
  serviceRating,
  utilitiesRating,
  image, // optional
  comment,
}) {
  const formData = new FormData();
  formData.append("bookingId", String(bookingId));
  formData.append("homestayId", String(homestayId));
  formData.append("cleanlinessRating", String(cleanlinessRating));
  formData.append("serviceRating", String(serviceRating));
  formData.append("utilitiesRating", String(utilitiesRating));
  if (image) {
    formData.append("image", image);
  }
  formData.append("comment", comment);

  return await http.post("/api/users/me/add-review", formData, {
    requireAuth: true,
  });
}
