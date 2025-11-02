import http from "./http";

/**
 * Lấy danh sách thông báo của user
 */
export const getMyNotification = async () => {
  return await http.get("/api/notifications", {
    requireAuth: true,
  });
};

/**
 * Lấy số lượng thông báo chưa đọc
 */
export const getUnreadNotificationCount = async () => {
  return await http.get("/api/notifications/unread-count", {
    requireAuth: true,
  });
};

/**
 * Đánh dấu thông báo đã đọc
 * @param {string} notificationId - ID của thông báo
 */
export const markNotificationAsRead = async (notificationId) => {
  return await http.put(
    `/api/notifications/${notificationId}/read`,
    {},
    {
      requireAuth: true,
    }
  );
};

/**
 * Đánh dấu tất cả thông báo đã đọc
 */
export const markAllNotificationsAsRead = async () => {
  return await http.put(
    "/api/notifications/read-all",
    {},
    {
      requireAuth: true,
    }
  );
};

/**
 * Xóa thông báo
 * @param {string} notificationId - ID của thông báo
 */
export const deleteNotification = async (notificationId) => {
  return await http.delete(`/api/notifications/${notificationId}`, {
    requireAuth: true,
  });
};

/**
 * Xóa tất cả thông báo
 */
export const deleteAllNotifications = async () => {
  return await http.delete("/api/notifications/all", {
    requireAuth: true,
  });
};
