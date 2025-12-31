import { useState, useCallback, useEffect } from "react";
import {
  getMyNotification,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../api/notifications";
import { isAuthError, handleApiResponse } from "../utils/apiHelper";
import { showToast } from "../components/common/Toast";
import {
  subscribe,
  unsubscribe,
  isConnected,
  onStompConnected,
} from "../api/socket";

import { APICache } from "../utils/cache";

export function useNotification() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Check cache trước khi fetch
  const CACHE_KEY = "notifications";
  const CACHE_TTL = 30000; // 30 seconds

  // Lấy danh sách notifications
  const fetchNotifications = useCallback(async () => {
    const cachedData = APICache.get(CACHE_KEY);
    if (cachedData) {
      console.log("⚡ Using cached notifications");
      setNotifications(cachedData);
      return cachedData;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getMyNotification();

      const isSuccess = handleApiResponse(
        response,
        null, // Không show toast khi fetch
        "Không thể tải thông báo"
      );

      if (isSuccess && response.data) {
        // Backend trả về đúng format rồi, không cần mapping
        setNotifications(response.data);

        // Cache data với TTL 30s
        APICache.set(CACHE_KEY, response.data, CACHE_TTL);

        console.log("Fetched notifications:", response.data);
        return response.data;
      } else {
        setError(response.message || "Không thể tải thông báo");
        return [];
      }
    } catch (err) {
      const errorMessage = err.message || "Lỗi khi tải thông báo";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy số lượng thông báo chưa đọc
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadNotificationCount();

      const isSuccess = handleApiResponse(
        response,
        null,
        "Không thể tải số thông báo chưa đọc"
      );

      if (isSuccess && response.data !== undefined) {
        // Backend có thể return { data: 5 } hoặc { data: { count: 5 } }
        const count =
          typeof response.data === "number"
            ? response.data
            : response.data?.count || 0;

        setUnreadCount(count);
        return count;
      } else {
        return 0;
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
      return 0;
    }
  }, []);

  // Đánh dấu thông báo đã đọc
  const markAsRead = useCallback(async (notificationId) => {
    try {
      // Update local state ngay lập tức (optimistic update)
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // ⚡ XÓA CACHE vì có thay đổi
      APICache.remove("notifications");

      // Gọi API
      const response = await markNotificationAsRead(notificationId);

      // Chỉ check auth error, không hiển thị toast
      if (isAuthError(response)) {
        // Rollback nếu auth error
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, read: false } : notif
          )
        );
        setUnreadCount((prev) => prev + 1);
        return false;
      }

      const isSuccess = response.success;

      if (!isSuccess) {
        // Rollback nếu API fail
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, read: false } : notif
          )
        );
        setUnreadCount((prev) => prev + 1);
      }

      return isSuccess;
    } catch (err) {
      console.error("Error marking notification as read:", err);
      return false;
    }
  }, []);

  // Đánh dấu tất cả đã đọc
  const markAllAsRead = useCallback(async () => {
    try {
      // Backup old state
      const oldNotifications = [...notifications];
      const oldUnreadCount = unreadCount;

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);

      // ⚡ XÓA CACHE vì có thay đổi
      APICache.remove("notifications");

      // Gọi API
      const response = await markAllNotificationsAsRead();

      // Chỉ check auth error, không hiển thị toast
      if (isAuthError(response)) {
        // Rollback nếu auth error
        setNotifications(oldNotifications);
        setUnreadCount(oldUnreadCount);
        return false;
      }

      const isSuccess = response.success;

      if (!isSuccess) {
        // Rollback nếu API fail
        setNotifications(oldNotifications);
        setUnreadCount(oldUnreadCount);
      }

      return isSuccess;
    } catch (err) {
      console.error("Error marking all as read:", err);
      return false;
    }
  }, [notifications, unreadCount]);

  // Xóa thông báo
  const removeNotification = useCallback(
    async (notificationId) => {
      try {
        // Backup notification
        const notification = notifications.find((n) => n.id === notificationId);

        // Update local state
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        if (notification && !notification.read) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }

        // ⚡ XÓA CACHE vì có thay đổi
        APICache.remove("notifications");

        // Gọi API
        const response = await deleteNotification(notificationId);

        const isSuccess = handleApiResponse(
          response,
          "Đã xóa thông báo",
          "Không thể xóa thông báo"
        );

        if (!isSuccess && notification) {
          // Rollback nếu API fail
          setNotifications((prev) => [...prev, notification]);
          if (!notification.read) {
            setUnreadCount((count) => count + 1);
          }
        }

        return isSuccess;
      } catch (err) {
        console.error("Error deleting notification:", err);
        return false;
      }
    },
    [notifications]
  );

  // Xóa tất cả thông báo
  const removeAllNotifications = useCallback(async () => {
    try {
      // Backup old state
      const oldNotifications = [...notifications];
      const oldUnreadCount = unreadCount;

      // Update local state
      setNotifications([]);
      setUnreadCount(0);

      // ⚡ XÓA CACHE vì có thay đổi
      APICache.remove("notifications");

      // Gọi API
      const response = await deleteAllNotifications();

      const isSuccess = handleApiResponse(
        response,
        "Đã xóa tất cả thông báo",
        "Không thể xóa tất cả thông báo"
      );

      if (!isSuccess) {
        // Rollback nếu API fail
        setNotifications(oldNotifications);
        setUnreadCount(oldUnreadCount);
      }

      return isSuccess;
    } catch (err) {
      console.error("Error deleting all notifications:", err);
      return false;
    }
  }, [notifications, unreadCount]);

  // Refresh notifications và unread count
  const refreshNotifications = useCallback(async () => {
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
  }, [fetchNotifications, fetchUnreadCount]);

  // Reset state
  const reset = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    setError(null);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    removeAllNotifications,
    refreshNotifications,
    reset,
  };
}

// Hook để auto-fetch notifications khi component mount
export function useNotificationAutoFetch(interval = null) {
  const notification = useNotification();

  useEffect(() => {
    // Fetch ngay khi mount
    notification.refreshNotifications();

    // Nếu có interval, setup polling
    if (interval && interval > 0) {
      const timer = setInterval(() => {
        notification.fetchUnreadCount();
      }, interval);

      return () => clearInterval(timer);
    }
  }, [interval]); // eslint-disable-line react-hooks/exhaustive-deps

  return notification;
}

// Hook với WebSocket (STOMP) real-time updates
export function useNotificationWithWebSocket() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    removeAllNotifications,
    refreshNotifications,
    reset,
  } = useNotification();

  // Local state để có thể update từ WebSocket
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);

  // Sync với parent state
  useEffect(() => {
    setLocalNotifications(notifications);
    setLocalUnreadCount(unreadCount);
  }, [notifications, unreadCount]);

  useEffect(() => {
    // Fetch initial data
    refreshNotifications();

    // Setup subscriptions function
    const setupSubscriptions = () => {
      console.log("🔔 Setting up notification subscriptions...");

      // ✅ Subscribe to new notifications
      subscribe("/user/queue/notifications", (notification) => {
        console.log("🔔 New notification received:", notification);

        // ⚡ XÓA CACHE khi có notification mới
        APICache.remove("notifications");

        // Backend trả về đúng format rồi, không cần mapping
        setLocalNotifications((prev) => [notification, ...prev]);

        // Tăng unread count nếu notification chưa đọc
        if (!notification.read) {
          setLocalUnreadCount((prev) => prev + 1);
        }

        // Show toast notification
        showToast("info", notification.title || "Bạn có thông báo mới");
      });

      // ✅ Subscribe to unread count updates
      subscribe("/user/queue/unread-count", (count) => {
        console.log("📊 Unread count updated:", count);

        // Backend trả về số hoặc string, parse nó
        const unreadCount = typeof count === "number" ? count : parseInt(count);
        setLocalUnreadCount(unreadCount);
      });

      // ✅ Optional: Subscribe to broadcast notifications
      subscribe("/topic/broadcast", (notification) => {
        console.log("📢 Broadcast notification:", notification);

        // ⚡ XÓA CACHE khi có broadcast notification
        APICache.remove("notifications");

        // Backend trả về đúng format rồi, không cần mapping
        setLocalNotifications((prev) => [notification, ...prev]);

        // Tăng unread count nếu notification chưa đọc
        if (!notification.read) {
          setLocalUnreadCount((prev) => prev + 1);
        }

        // Show toast with warning style for system announcements
        showToast("warning", notification.title || "Thông báo hệ thống");
      });
    };

    // Register callback để setup subscriptions khi STOMP connected
    onStompConnected(setupSubscriptions);

    // Cleanup
    return () => {
      console.log("🔕 Unsubscribing from notification topics...");
      unsubscribe("/user/queue/notifications");
      unsubscribe("/user/queue/unread-count");
      unsubscribe("/topic/broadcast");
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    notifications: localNotifications,
    unreadCount: localUnreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    removeNotification,
    removeAllNotifications,
    refreshNotifications,
    reset,
  };
}
