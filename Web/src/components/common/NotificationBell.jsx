import React, { useState, useRef, useEffect } from "react";
import { useReloadNavigate } from "../../utils/useReloadNavigate";
import styles from "./NotificationBell.module.css";
import { formatNotificationTime } from "../../utils/date";
import { useNotificationWithWebSocket } from "../../hooks/useNotification";
import { getNotificationConfig } from "../../utils/notificationConfig";

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useReloadNavigate();

  // Sử dụng hook với WebSocket để nhận real-time updates
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotificationWithWebSocket();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = async (notification) => {
    // Đánh dấu là đã đọc
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Xác định link dựa trên type
    let targetLink = null;

    switch (notification.type) {
      case "promotion":
        targetLink = "/user/promotions";
        break;
      case "booking":
      case "payment":
        targetLink = "/user/booking-history";
        break;
      default:
        // Không navigate nếu không xác định được type
        targetLink = null;
    }

    // Navigate nếu có link
    if (targetLink) {
      navigate(targetLink);
      setShowNotifications(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className={styles.notificationWrapper} ref={dropdownRef}>
      <button
        className={styles.notificationButton}
        onClick={(e) => {
          e.stopPropagation();
          setShowNotifications((prev) => !prev);
        }}
        aria-label="Thông báo"
      >
        <svg
          className={styles.bellIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </button>

      {/* Dropdown Menu */}
      <div
        className={`${styles.dropdownMenu} ${
          showNotifications ? styles.dropdownOpen : styles.dropdownClosed
        }`}
      >
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>Thông báo</h3>
          {unreadCount > 0 && (
            <button className={styles.markAllBtn} onClick={handleMarkAllAsRead}>
              Đánh dấu đã đọc
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className={styles.notificationsList}>
          {loading ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>Đang tải...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <svg
                className={styles.emptyIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className={styles.emptyText}>Chưa có thông báo nào</p>
            </div>
          ) : (
            notifications.map((notification) => {
              // Lấy config dựa trên type
              const config = getNotificationConfig(notification.type);
              const icon = config.icon;
              const color = config.color;
              // Chỉ dùng link từ notification backend, không fallback
              const link = notification.link;

              return (
                <button
                  key={notification.id}
                  className={`${styles.notificationItem} ${
                    !notification.read ? styles.unread : ""
                  }`}
                  onClick={() =>
                    handleNotificationClick({ ...notification, link })
                  }
                >
                  <div
                    className={styles.iconWrapper}
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <i
                      className={`fas ${icon} ${styles.icon}`}
                      style={{ color: color }}
                    ></i>
                  </div>
                  <div className={styles.content}>
                    <div className={styles.titleRow}>
                      <p className={styles.notificationTitle}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className={styles.unreadDot}></span>
                      )}
                    </div>
                    <p className={styles.message}>{notification.message}</p>
                    <p className={styles.time}>
                      {formatNotificationTime(notification.timestamp)}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;
