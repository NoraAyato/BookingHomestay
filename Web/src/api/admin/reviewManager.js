import http from "../http";

/**
 * Lấy danh sách đánh giá cho admin
 * GET /api/admin/reviewsmanager
 *
 * @param {number} page - Trang hiện tại (default: 1)
 * @param {number} size - Số lượng items mỗi trang (default: 5)
 * @param {string} search - Từ khóa tìm kiếm (optional)
 * @param {string} startDate - Ngày bắt đầu lọc (format: YYYY-MM-DD, optional)
 * @param {string} endDate - Ngày kết thúc lọc (format: YYYY-MM-DD, optional)
 * @param {number} rating - Lọc theo số sao (1-5, optional)
 *
 * @returns {Promise<ApiResponse<PageResponse<ReviewsDataResponseDto>>>}
 * Response structure:
 * {
 *   success: boolean,
 *   message: string,
 *   data: {
 *     items: Array<{
 *       id: number,
 *       guestName: string,
 *       guestAvatar: string,
 *       homestayName: string,
 *       homestayId: string,
 *       rating: number,
 *       content: string,
 *       date: string (YYYY-MM-DD),
 *       bookingId: string,
 *       image: string
 *     }>,
 *     total: number,
 *     page: number,
 *     limit: number
 *   }
 * }
 */
export async function getAdminReviews({
  page = 1,
  size = 5,
  search = null,
  startDate = null,
  endDate = null,
  rating = null,
}) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());

  if (search) params.append("search", search);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (rating) params.append("rating", rating.toString());

  return await http.get(`/api/admin/reviewsmanager?${params.toString()}`, {
    requireAuth: true,
  });
}

/**
 * Lấy thống kê đánh giá
 * GET /api/admin/reviewsmanager/stats
 *
 * @returns {Promise<ApiResponse<ReviewStats>>}
 * Response structure:
 * {
 *   success: boolean,
 *   message: string,
 *   data: {
 *     totalReviews: number,
 *     negativeRate: number,
 *     positiveRate: number,
 *     recentReviews: number,
 *     averageRating: number
 *   }
 * }
 */
export async function getReviewStats() {
  return await http.get("/api/admin/reviewsmanager/stats", {
    requireAuth: true,
  });
}

/**
 * Xóa đánh giá
 * DELETE /api/admin/reviewsmanager/{id}
 *
 * @param {number} reviewId - ID của đánh giá cần xóa
 * @returns {Promise<ApiResponse>}
 */
export async function deleteReview(reviewId) {
  return await http.post(`/api/admin/reviewsmanager/delete/${reviewId}`, null, {
    requireAuth: true,
  });
}
