import http from "../http";

export const getActivityLogs = async (params = {}) => {
  const queryParams = new URLSearchParams();

  // Add parameters only if they exist
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.cursor) queryParams.append("cursor", params.cursor);
  if (params.activityType)
    queryParams.append("activityType", params.activityType);
  if (params.action) queryParams.append("action", params.action);
  if (params.userId) queryParams.append("userId", params.userId);
  if (params.entityType) queryParams.append("entityType", params.entityType);
  if (params.startDate) queryParams.append("startDate", params.startDate);
  if (params.endDate) queryParams.append("endDate", params.endDate);
  if (params.keyword) queryParams.append("keyword", params.keyword);

  const queryString = queryParams.toString();
  const endpoint = `/api/admin/activity-logs${
    queryString ? `?${queryString}` : ""
  }`;

  return http.get(endpoint, { requireAuth: true });
};

/**
 * Activity type options for filter
 */
export const ACTIVITY_TYPES = {
  ALL: "",
  BOOKING: "BOOKING",
  USER: "USER",
  HOMESTAY: "HOMESTAY",
  REVIEW: "REVIEW",
  MESSAGE: "MESSAGE",
  PAYMENT: "PAYMENT",
  SYSTEM: "SYSTEM",
};

/**
 * Action options for filter
 */
export const ACTIVITY_ACTIONS = {
  ALL: "",
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  VIEW: "VIEW",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

/**
 * Get display name for activity type
 */
export const getActivityTypeDisplay = (type) => {
  const displayNames = {
    BOOKING: "Đặt phòng",
    USER: "Người dùng",
    HOMESTAY: "Homestay",
    REVIEW: "Đánh giá",
    MESSAGE: "Tin nhắn",
    PAYMENT: "Thanh toán",
    SYSTEM: "Hệ thống",
  };
  return displayNames[type] || type;
};

/**
 * Get display name for action
 */
export const getActionDisplay = (action) => {
  const displayNames = {
    CREATE: "Tạo mới",
    UPDATE: "Cập nhật",
    DELETE: "Xóa",
    VIEW: "Xem",
    LOGIN: "Đăng nhập",
    LOGOUT: "Đăng xuất",
  };
  return displayNames[action] || action;
};

/**
 * Get color for activity type
 */
export const getActivityTypeColor = (type) => {
  const colors = {
    BOOKING: "blue",
    USER: "green",
    HOMESTAY: "purple",
    REVIEW: "yellow",
    MESSAGE: "indigo",
    PAYMENT: "emerald",
    SYSTEM: "gray",
  };
  return colors[type] || "blue";
};

/**
 * Get icon name for activity type (for lucide-react icons)
 */
export const getActivityTypeIcon = (type) => {
  const icons = {
    BOOKING: "Calendar",
    USER: "User",
    HOMESTAY: "Building",
    REVIEW: "Star",
    MESSAGE: "MessageCircle",
    PAYMENT: "CreditCard",
    SYSTEM: "Settings",
  };
  return icons[type] || "Activity";
};
