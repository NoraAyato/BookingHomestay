import http from "../http";

/**
 * Send broadcast notification to all users
 * @param {string} title - Notification title
 * @param {string} content - Notification content
 * @returns {Promise} API response
 */
export const sendBroadcastNotification = async (title, content) => {
  try {
    // Gửi dưới dạng JSON body với BroadcastNotificationRequest DTO
    const requestBody = {
      title,
      content,
    };

    const response = await http.post(
      "/api/admin/notification/broadcast",
      requestBody,
      {
        requireAuth: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Error sending broadcast notification:", error);
    throw error;
  }
};
