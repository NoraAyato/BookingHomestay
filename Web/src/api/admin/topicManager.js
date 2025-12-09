import http from "../http";

/**
 * Lấy danh sách chủ đề/danh mục bài viết cho admin
 * GET /api/admin/topicsmanager
 *
 * @param {number} page - Trang hiện tại (default: 1)
 * @param {number} size - Số lượng items mỗi trang (default: 5)
 * @param {string} search - Từ khóa tìm kiếm (optional)
 * @param {string} status - Trạng thái: "active", "inactive" (optional)
 *
 * @returns {Promise<ApiResponse<PageResponse<TopicDataResponseDto>>>}
 * Response structure:
 * {
 *   success: boolean,
 *   message: string,
 *   data: {
 *     items: Array<{
 *       id: string,
 *       name: string,
 *       description: string | null,
 *       articleCount: number,
 *       active: boolean  // Note: backend uses 'active' not 'isActive'
 *     }>,
 *     total: number,
 *     page: number,
 *     limit: number
 *   }
 * }
 */
export async function getAdminTopics({
  page = 1,
  size = 5,
  search = null,
  status = null,
}) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());

  if (search) params.append("search", search);
  if (status) params.append("status", status);

  return await http.get(`/api/admin/topicsmanager?${params.toString()}`, {
    requireAuth: true,
  });
}

/**
 * Lấy thống kê chủ đề
 * GET /api/admin/topicsmanager/stats
 *
 * @returns {Promise<ApiResponse<TopicStats>>}
 * Response structure:
 * {
 *   success: boolean,
 *   message: string,
 *   data: {
 *     total: number,      // totalTopics
 *     active: number,     // activeTopics
 *     inactive: number,   // inactiveTopics
 *     totalArticles: number
 *   }
 * }
 */
export async function getTopicStats() {
  return await http.get("/api/admin/topicsmanager/stats", {
    requireAuth: true,
  });
}

/**
 * Xóa chủ đề
 * DELETE /api/admin/topicsmanager/{id}
 *
 * @param {number|string} topicId - ID của chủ đề cần xóa
 * @returns {Promise<ApiResponse>}
 */
export async function deleteTopic(topicId) {
  return await http.post(`/api/admin/topicsmanager/delete/${topicId}`, null, {
    requireAuth: true,
  });
}

/**
 * Tạo chủ đề mới
 * POST /api/admin/topicsmanager/create
 *
 * @param {Object} data - Dữ liệu chủ đề
 * @param {string} data.name - Tên chủ đề
 * @param {string} data.description - Mô tả chủ đề
 * @returns {Promise<ApiResponse<Void>>}
 */
export async function createTopic(data) {
  return await http.post("/api/admin/topicsmanager/create", data, {
    requireAuth: true,
  });
}

/**
 * Cập nhật chủ đề
 * PUT /api/admin/topicsmanager/{id}
 *
 * @param {string} topicId - ID của chủ đề cần cập nhật
 * @param {Object} data - Dữ liệu cập nhật
 * @param {string} data.title - Tiêu đề chủ đề
 * @param {string} data.description - Mô tả chủ đề
 * @param {boolean} data.status - Trạng thái (true: active, false: inactive)
 * @returns {Promise<ApiResponse<Void>>}
 */
export async function updateTopic(topicId, data) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("status", data.status);

  return await http.put(`/api/admin/topicsmanager/${topicId}`, formData, {
    requireAuth: true,
  });
}
