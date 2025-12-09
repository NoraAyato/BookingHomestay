import http from "./http";

/**
 * Get all news with pagination and optional topic filter
 * @param {number} page - Page number (default: 1)
 * @param {number} size - Items per page (default: 6)
 * @param {string} idTopic - Optional topic ID filter
 * @returns {Promise} Response with { success, message, data: { items, total, page, limit } }
 */
export const getNewsList = async (page = 1, size = 6, idTopic = null) => {
  try {
    const params = { page, size };
    if (idTopic && idTopic !== "all") {
      params.idTopic = idTopic;
    }
    const response = await http.get("/api/news", { params });
    console.log("API response for news list:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching news list:", error);
    throw error;
  }
};

/**
 * Get news detail by ID
 * @param {string} id - News ID
 * @returns {Promise} News detail data
 */
export const getNewsDetail = async (id) => {
  try {
    const response = await http.get(`/api/news/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching news detail:", error);
    throw error;
  }
};

/**
 * Get all news categories/topics
 * @returns {Promise} List of categories
 */
export const getNewsCategories = async () => {
  try {
    const response = await http.get("/api/news/topic");
    return response.data;
  } catch (error) {
    console.error("Error fetching news categories:", error);
    throw error;
  }
};
