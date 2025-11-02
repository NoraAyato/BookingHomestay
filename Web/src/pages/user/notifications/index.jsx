import React, { useState } from "react";
import { useReloadNavigate } from "../../../utils/useReloadNavigate";
import {
  mockNotifications,
  formatNotificationTime,
} from "../../../api/mockData/notifications";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const navigate = useReloadNavigate();

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors"
            >
              Đánh dấu tất cả đã đọc
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                filter === "all"
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                filter === "unread"
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Chưa đọc ({notifications.filter((n) => !n.isRead).length})
            </button>
            <button
              onClick={() => setFilter("read")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                filter === "read"
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Đã đọc ({notifications.filter((n) => n.isRead).length})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
              <p className="text-gray-500">Không có thông báo nào</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-4 p-5 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-rose-50/50" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${notification.color}15` }}
                  >
                    <i
                      className={`fas ${notification.icon} text-lg`}
                      style={{ color: notification.color }}
                    ></i>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="flex-shrink-0 w-2 h-2 bg-rose-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatNotificationTime(notification.timestamp)}
                        </p>
                      </div>

                      {/* Actions */}
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          className="text-xs text-rose-600 hover:text-rose-700 font-medium whitespace-nowrap"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;
