import http from "../http";

export async function getHostReviewStats() {
  return await http.get("/api/host/reviews/stats", {
    requireAuth: true,
  });
}

export async function getHostReviews({
  page = 1,
  size = 5,
  search = null,
  startDate = null,
  endDate = null,
  rating = null,
  homestayId = null,
  status = null,
}) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());

  if (search) params.append("search", search);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (rating) params.append("rating", rating.toString());
  if (homestayId) params.append("homestayId", homestayId);
  if (status !== null) params.append("status", status.toString());

  return await http.get(`/api/host/reviews?${params.toString()}`, {
    requireAuth: true,
  });
}

export async function approveHostReview(reviewId) {
  return await http.put(`/api/host/reviews/approve/${reviewId}`, null, {
    requireAuth: true,
  });
}
