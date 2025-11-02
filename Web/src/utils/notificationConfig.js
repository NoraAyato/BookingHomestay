/**
 * Notification Configuration Helper
 * Centralized configuration for notification types
 */

export const NOTIFICATION_TYPES = {
  BOOKING: "booking",
  PROMOTION: "promotion",
  PAYMENT: "payment",
  REVIEW: "review",
  SYSTEM: "system",
  REMINDER: "reminder",
  DISCOUNT: "discount",
};

export const NOTIFICATION_CONFIGS = {
  [NOTIFICATION_TYPES.BOOKING]: {
    icon: "fa-calendar-check",
    color: "#10b981", // green
    link: "/user/booking-history",
  },
  [NOTIFICATION_TYPES.PROMOTION]: {
    icon: "fa-gift",
    color: "#f59e0b", // amber
    link: "/user/promotions",
  },
  [NOTIFICATION_TYPES.PAYMENT]: {
    icon: "fa-credit-card",
    color: "#3b82f6", // blue
    link: "/user/booking-history",
  },
  [NOTIFICATION_TYPES.REVIEW]: {
    icon: "fa-star",
    color: "#eab308", // yellow
    link: "/user/booking-history",
  },
  [NOTIFICATION_TYPES.SYSTEM]: {
    icon: "fa-bell",
    color: "#6366f1", // indigo
    link: "/news",
  },
  [NOTIFICATION_TYPES.REMINDER]: {
    icon: "fa-calendar-alt",
    color: "#10b981", // green
    link: "/user/booking-history",
  },
  [NOTIFICATION_TYPES.DISCOUNT]: {
    icon: "fa-percentage",
    color: "#f59e0b", // amber
    link: "/homestay",
  },
};

/**
 * Get notification configuration by type
 * @param {string} type - Notification type (booking, promotion, payment, etc.)
 * @returns {Object} Configuration object with icon, color, and link
 */
export const getNotificationConfig = (type) => {
  return (
    NOTIFICATION_CONFIGS[type] ||
    NOTIFICATION_CONFIGS[NOTIFICATION_TYPES.SYSTEM]
  );
};

/**
 * Get icon for notification type
 * @param {string} type - Notification type
 * @returns {string} FontAwesome icon class
 */
export const getNotificationIcon = (type) => {
  const config = getNotificationConfig(type);
  return config.icon;
};

/**
 * Get color for notification type
 * @param {string} type - Notification type
 * @returns {string} Hex color code
 */
export const getNotificationColor = (type) => {
  const config = getNotificationConfig(type);
  return config.color;
};

/**
 * Get link for notification type
 * @param {string} type - Notification type
 * @returns {string} Navigation link
 */
export const getNotificationLink = (type) => {
  const config = getNotificationConfig(type);
  return config.link;
};

/**
 * Apply notification config to notification object
 * @param {Object} notification - Notification object
 * @returns {Object} Notification with config applied
 */
export const applyNotificationConfig = (notification) => {
  const config = getNotificationConfig(notification.type);
  return {
    ...notification,
    icon: notification.icon || config.icon,
    color: notification.color || config.color,
    link: notification.link || config.link,
  };
};
