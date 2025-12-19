import http from "../http";

/**
 * Lấy thống kê đánh giá cho host
 * GET /api/host/reviews/stats
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
 *     recentReviews: number
 *   }
 * }
 */
export async function getHostReviewStats() {
  return await http.get("/api/host/reviews/stats", {
    requireAuth: true,
  });
}

/**
 * Lấy danh sách đánh giá cho host
 * GET /api/host/reviews
 *
 * @param {number} page - Trang hiện tại (default: 1)
 * @param {number} size - Số lượng items mỗi trang (default: 5)
 * @param {string} search - Từ khóa tìm kiếm (optional)
 * @param {string} startDate - Ngày bắt đầu lọc (format: YYYY-MM-DD, optional)
 * @param {string} endDate - Ngày kết thúc lọc (format: YYYY-MM-DD, optional)
 * @param {number} rating - Lọc theo số sao (1-5, optional)
 * @param {string} homestayId - Lọc theo homestay ID (optional)
 *
 * @returns {Promise<ApiResponse<PageResponse<ReviewsDataResponseDto>>>}
 * Response structure:
 * {
 *   success: boolean,
 *   message: string,
 *   data: {
 *     items: Array<{
 *       id: string,
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
export async function getHostReviews({
  page = 1,
  size = 5,
  search = null,
  startDate = null,
  endDate = null,
  rating = null,
  homestayId = null,
}) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());

  if (search) params.append("search", search);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (rating) params.append("rating", rating.toString());
  if (homestayId) params.append("homestayId", homestayId);

  return await http.get(`/api/host/reviews?${params.toString()}`, {
    requireAuth: true,
  });
}
