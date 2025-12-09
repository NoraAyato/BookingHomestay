import http from "../http";

/**
 * Lấy danh sách tin tức cho admin
 * GET /api/admin/newsmanager
 *
 * @param {number} page - Trang hiện tại (default: 1)
 * @param {number} size - Số lượng items mỗi trang (default: 5)
 * @param {string} search - Từ khóa tìm kiếm (optional)
 * @param {string} startDate - Ngày bắt đầu lọc (format: YYYY-MM-DD, optional)
 * @param {string} endDate - Ngày kết thúc lọc (format: YYYY-MM-DD, optional)
 * @param {string} status - Trạng thái: "published", "draft" (optional)
 * @param {string} category - Danh mục tin tức (optional)
 *
 * @returns {Promise<ApiResponse<PageResponse<NewsDataResponseDto>>>}
 * Response structure:
 * {
 *   success: boolean,
 *   message: string,
 *   data: {
 *     items: Array<{
 *       id: string,
 *       title: string,
 *       content: string,
 *       category: string,
 *       status: string,
 *       featured: boolean,
 *       author: string,
 *       image: string,
 *       createdAt: string (YYYY-MM-DD)
 *     }>,
 *     total: number,
 *     page: number,
 *     limit: number
 *   }
 * }
 */
export async function getAdminNews({
  page = 1,
  size = 5,
  search = null,
  startDate = null,
  endDate = null,
  status = null,
  category = null,
}) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());

  if (search) params.append("search", search);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (status) params.append("status", status);
  if (category) params.append("category", category);

  return await http.get(`/api/admin/newsmanager?${params.toString()}`, {
    requireAuth: true,
  });
}

/**
 * Lấy thống kê tin tức
 * GET /api/admin/newsmanager/stats
 *
 * @returns {Promise<ApiResponse<NewsStats>>}
 * Response structure:
 * {
 *   success: boolean,
 *   message: string,
 *   data: {
 *     total: number,
 *     published: number,
 *     draft: number,
 *     featured: number
 *   }
 * }
 */
export async function getNewsStats() {
  return await http.get("/api/admin/newsmanager/stats", {
    requireAuth: true,
  });
}

/**
 * Tạo tin tức mới
 * POST /api/admin/newsmanager/create
 *
 * @param {Object} data - Dữ liệu tin tức
 * @param {string} data.title - Tiêu đề tin tức
 * @param {string} data.content - Nội dung tin tức
 * @param {string} data.status - Trạng thái: "published" hoặc "draft"
 * @param {string} data.categoryId - ID danh mục
 * @param {File} data.image - File hình ảnh
 * @param {boolean} data.featured - Đánh dấu tin nổi bật
 * @returns {Promise<ApiResponse<Void>>}
 */
export async function createNews(data) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("status", data.status);
  formData.append("categoryId", data.categoryId);
  formData.append("featured", data.featured);

  if (data.image) {
    formData.append("image", data.image);
  }

  return await http.post("/api/admin/newsmanager/create", formData, {
    requireAuth: true,
  });
}

/**
 * Cập nhật tin tức
 * PUT /api/admin/newsmanager/{id}
 *
 * @param {string} newsId - ID tin tức cần cập nhật
 * @param {Object} data - Dữ liệu tin tức
 * @param {string} data.title - Tiêu đề tin tức
 * @param {string} data.content - Nội dung tin tức
 * @param {string} data.status - Trạng thái: "published" hoặc "draft"
 * @param {string} data.categoryId - ID danh mục
 * @param {File} [data.image] - File hình ảnh (tùy chọn)
 * @param {boolean} data.featured - Đánh dấu tin nổi bật
 * @returns {Promise<ApiResponse<Void>>}
 */
export async function updateNews(newsId, data) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("status", data.status);
  formData.append("categoryId", data.categoryId);
  formData.append("featured", data.featured);

  // Image là tùy chọn khi update
  if (data.image) {
    formData.append("image", data.image);
  }

  return await http.put(`/api/admin/newsmanager/${newsId}`, formData, {
    requireAuth: true,
  });
}

/**
 * Xóa tin tức
 * POST /api/admin/newsmanager/delete/{id}
 *
 * @param {string} newsId - ID tin tức cần xóa
 * @returns {Promise<ApiResponse<Void>>}
 */
export async function deleteNews(newsId) {
  return await http.post(`/api/admin/newsmanager/delete/${newsId}`, null, {
    requireAuth: true,
  });
}
