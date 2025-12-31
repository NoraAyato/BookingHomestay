import http from "../http";

export async function getAdminReviews({
  page = 1,
  size = 5,
  search = null,
  startDate = null,
  endDate = null,
  rating = null,
  status = null,
}) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());

  if (search) params.append("search", search);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (rating) params.append("rating", rating.toString());
  if (status !== null) params.append("status", status.toString());

  return await http.get(`/api/admin/reviewsmanager?${params.toString()}`, {
    requireAuth: true,
  });
}

export async function getReviewStats() {
  return await http.get("/api/admin/reviewsmanager/stats", {
    requireAuth: true,
  });
}

export async function deleteReview(reviewId) {
  return await http.post(`/api/admin/reviewsmanager/delete/${reviewId}`, null, {
    requireAuth: true,
  });
}

export async function approveReview(reviewId) {
  return await http.put(`/api/admin/reviewsmanager/approve/${reviewId}`, null, {
    requireAuth: true,
  });
}
