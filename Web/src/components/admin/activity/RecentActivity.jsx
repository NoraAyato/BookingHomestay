import React, { useMemo } from "react";
import {
  Clock,
  User,
  Building,
  Calendar,
  MessageCircle,
  Star,
  CreditCard,
  Settings,
  Activity,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useActivityLogs } from "../../../hooks/admin/useActivityLogs";
import { getActivityTypeColor } from "../../../api/admin/activityLogs";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const RecentActivity = () => {
  // Fetch activity logs with limit of 10 for dashboard, enable real-time
  const { activities, loading, error, hasMore, loadMore, refresh } =
    useActivityLogs({ limit: 10 }, true); // Enable real-time updates

  // Map activity type to icon
  const getIconComponent = (activityType) => {
    const iconMap = {
      BOOKING: Calendar,
      USER: User,
      HOMESTAY: Building,
      REVIEW: Star,
      MESSAGE: MessageCircle,
      PAYMENT: CreditCard,
      SYSTEM: Settings,
    };
    return iconMap[activityType] || Activity;
  };

  // Format time to relative string
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } catch (e) {
      return dateString;
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: "bg-blue-100", icon: "text-blue-600" },
      green: { bg: "bg-green-100", icon: "text-green-600" },
      purple: { bg: "bg-purple-100", icon: "text-purple-600" },
      yellow: { bg: "bg-yellow-100", icon: "text-yellow-600" },
      indigo: { bg: "bg-indigo-100", icon: "text-indigo-600" },
      red: { bg: "bg-red-100", icon: "text-red-600" },
      emerald: { bg: "bg-emerald-100", icon: "text-emerald-600" },
      gray: { bg: "bg-gray-100", icon: "text-gray-600" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Hoạt động gần đây
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Các cập nhật và hoạt động mới nhất trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 flex items-center gap-1"
            title="Làm mới"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <Link
            to="/admin/activity-logs"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Xem tất cả
          </Link>
        </div>
      </div>

      {/* Loading state */}
      {loading && activities.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-center py-12 text-center">
          <div className="space-y-3">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <div>
              <p className="text-sm text-red-600 font-medium">{error}</p>
              <button
                onClick={refresh}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && activities.length === 0 && (
        <div className="text-center py-12">
          <Activity className="h-10 w-10 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Chưa có hoạt động nào</p>
        </div>
      )}

      {/* Activities list */}
      {!loading && !error && activities.length > 0 && (
        <>
          <div className="space-y-4">
            {activities.slice(0, 10).map((activity, index) => {
              const Icon = getIconComponent(activity.activityType);
              const color = getActivityTypeColor(activity.activityType);
              const colorClasses = getColorClasses(color);
              const isNew = index === 0 && activities.length > 0;

              return (
                <div
                  key={activity.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 ${
                    isNew ? "animate-pulse bg-blue-50" : ""
                  }`}
                  style={{
                    animation: isNew ? "slideIn 0.3s ease-out" : "none",
                  }}
                >
                  <div
                    className={`p-2 rounded-full ${colorClasses.bg} flex-shrink-0`}
                  >
                    <Icon className={`h-4 w-4 ${colorClasses.icon}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 whitespace-nowrap">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(activity.createdAt)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {activity.userName} • {activity.activityTypeDisplay}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show more button */}
          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="w-full py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  "Tải thêm hoạt động"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecentActivity;
