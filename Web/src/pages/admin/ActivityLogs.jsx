import React, { useState } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import {
  Calendar,
  User,
  Building,
  Star,
  MessageCircle,
  CreditCard,
  Settings,
  Activity,
  Clock,
  Search,
  Filter,
  X,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { useActivityLogs } from "../../hooks/admin/useActivityLogs";
import {
  ACTIVITY_TYPES,
  ACTIVITY_ACTIONS,
  getActivityTypeColor,
} from "../../api/admin/activityLogs";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const ActivityLogs = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [tempFilters, setTempFilters] = useState({
    activityType: "",
    action: "",
    entityType: "",
    startDate: "",
    endDate: "",
  });

  const {
    activities,
    loading,
    error,
    hasMore,
    total,
    filters,
    newActivitiesCount,
    loadMore,
    refresh,
    updateFilters,
    resetFilters,
    search,
    clearNewActivitiesCount,
  } = useActivityLogs({}, true); // Enable real-time with notification

  // Handle refresh with new activities
  const handleRefreshWithNew = () => {
    clearNewActivitiesCount();
    refresh();
  };

  // Icon mapping
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

  // Color classes
  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: "bg-blue-100",
        icon: "text-blue-600",
        badge: "bg-blue-50 text-blue-700 border-blue-200",
      },
      green: {
        bg: "bg-green-100",
        icon: "text-green-600",
        badge: "bg-green-50 text-green-700 border-green-200",
      },
      purple: {
        bg: "bg-purple-100",
        icon: "text-purple-600",
        badge: "bg-purple-50 text-purple-700 border-purple-200",
      },
      yellow: {
        bg: "bg-yellow-100",
        icon: "text-yellow-600",
        badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
      },
      indigo: {
        bg: "bg-indigo-100",
        icon: "text-indigo-600",
        badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
      },
      red: {
        bg: "bg-red-100",
        icon: "text-red-600",
        badge: "bg-red-50 text-red-700 border-red-200",
      },
      emerald: {
        bg: "bg-emerald-100",
        icon: "text-emerald-600",
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
      gray: {
        bg: "bg-gray-100",
        icon: "text-gray-600",
        badge: "bg-gray-50 text-gray-700 border-gray-200",
      },
    };
    return colors[color] || colors.blue;
  };

  // Format date time
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy HH:mm", { locale: vi });
    } catch (e) {
      return dateString;
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    search(searchKeyword);
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    updateFilters(tempFilters);
    setShowFilters(false);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setTempFilters({
      activityType: "",
      action: "",
      entityType: "",
      startDate: "",
      endDate: "",
    });
    setSearchKeyword("");
    resetFilters();
    setShowFilters(false);
  };

  // Check if filters are active
  const hasActiveFilters =
    filters.activityType ||
    filters.action ||
    filters.entityType ||
    filters.startDate ||
    filters.endDate ||
    filters.keyword;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Lịch sử hoạt động
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Theo dõi và quản lý tất cả các hoạt động trong hệ thống
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* New Activities Notification Banner */}
        {newActivitiesCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 rounded-full p-2">
                  <Activity className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Có {newActivitiesCount} hoạt động mới
                  </p>
                  <p className="text-xs text-blue-700">
                    Click để tải và xem hoạt động mới nhất
                  </p>
                </div>
              </div>
              <button
                onClick={handleRefreshWithNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Tải ngay
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo từ khóa..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                hasActiveFilters
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="h-4 w-4" />
              Bộ lọc
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  •
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Activity Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại hoạt động
                  </label>
                  <select
                    value={tempFilters.activityType}
                    onChange={(e) =>
                      setTempFilters({
                        ...tempFilters,
                        activityType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tất cả</option>
                    <option value={ACTIVITY_TYPES.BOOKING}>Đặt phòng</option>
                    <option value={ACTIVITY_TYPES.USER}>Người dùng</option>
                    <option value={ACTIVITY_TYPES.HOMESTAY}>Homestay</option>
                    <option value={ACTIVITY_TYPES.REVIEW}>Đánh giá</option>
                    <option value={ACTIVITY_TYPES.MESSAGE}>Tin nhắn</option>
                    <option value={ACTIVITY_TYPES.PAYMENT}>Thanh toán</option>
                    <option value={ACTIVITY_TYPES.SYSTEM}>Hệ thống</option>
                  </select>
                </div>

                {/* Action */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hành động
                  </label>
                  <select
                    value={tempFilters.action}
                    onChange={(e) =>
                      setTempFilters({ ...tempFilters, action: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tất cả</option>
                    <option value={ACTIVITY_ACTIONS.CREATE}>Tạo mới</option>
                    <option value={ACTIVITY_ACTIONS.UPDATE}>Cập nhật</option>
                    <option value={ACTIVITY_ACTIONS.DELETE}>Xóa</option>
                    <option value={ACTIVITY_ACTIONS.VIEW}>Xem</option>
                    <option value={ACTIVITY_ACTIONS.LOGIN}>Đăng nhập</option>
                    <option value={ACTIVITY_ACTIONS.LOGOUT}>Đăng xuất</option>
                  </select>
                </div>

                {/* Entity Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại đối tượng
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Booking, User, Homestay..."
                    value={tempFilters.entityType}
                    onChange={(e) =>
                      setTempFilters({
                        ...tempFilters,
                        entityType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Từ ngày
                  </label>
                  <input
                    type="datetime-local"
                    value={tempFilters.startDate}
                    onChange={(e) =>
                      setTempFilters({
                        ...tempFilters,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đến ngày
                  </label>
                  <input
                    type="datetime-local"
                    value={tempFilters.endDate}
                    onChange={(e) =>
                      setTempFilters({
                        ...tempFilters,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-end gap-3 mt-4">
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Đặt lại
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Tổng số:{" "}
                <span className="font-semibold text-gray-900">{total}</span>{" "}
                hoạt động
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        )}

        {/* Activity List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Loading state */}
          {loading && activities.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}
          {/* Error state */}
          {error && (
            <div className="flex items-center justify-center py-16 text-center">
              <div className="space-y-3">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <div>
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                  <button
                    onClick={refresh}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Empty state */}
          {!loading && !error && activities.length === 0 && (
            <div className="text-center py-16">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500">
                {hasActiveFilters
                  ? "Không tìm thấy hoạt động nào phù hợp với bộ lọc"
                  : "Chưa có hoạt động nào"}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          )}
          {/* Activities Table */}
          {!loading && !error && activities.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hoạt động
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người thực hiện
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đối tượng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.map((activity) => {
                    const Icon = getIconComponent(activity.activityType);
                    const color = getActivityTypeColor(activity.activityType);
                    const colorClasses = getColorClasses(color);

                    return (
                      <tr
                        key={activity.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Type Icon & Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-2 rounded-lg ${colorClasses.bg} flex-shrink-0`}
                            >
                              <Icon
                                className={`h-4 w-4 ${colorClasses.icon}`}
                              />
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-md border ${colorClasses.badge}`}
                            >
                              {activity.activityTypeDisplay}
                            </span>
                          </div>
                        </td>

                        {/* Activity Title & Description */}
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <div className="text-sm font-semibold text-gray-900">
                              {activity.title}
                            </div>
                            <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {activity.description}
                            </div>
                          </div>
                        </td>

                        {/* User Info */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {activity.userName}
                              </div>
                              <div className="text-xs text-gray-500">
                                <span
                                  className={`px-1.5 py-0.5 rounded ${
                                    activity.userRole === "Admin"
                                      ? "bg-purple-100 text-purple-700"
                                      : activity.userRole === "SYSTEM"
                                      ? "bg-gray-100 text-gray-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {activity.userRole}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                            {activity.actionDisplay}
                          </span>
                        </td>

                        {/* Entity */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {activity.entityType || "-"}
                          </div>
                          {activity.entityId && (
                            <div className="text-xs text-gray-500 font-mono">
                              {activity.entityId.substring(0, 20)}...
                            </div>
                          )}
                        </td>

                        {/* Timestamp */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium">
                                {
                                  formatDateTime(activity.createdAt).split(
                                    " "
                                  )[0]
                                }
                              </div>
                              <div className="text-xs text-gray-500">
                                {
                                  formatDateTime(activity.createdAt).split(
                                    " "
                                  )[1]
                                }
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}{" "}
          {/* Load More Button */}
          {!loading && !error && hasMore && (
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={loadMore}
                disabled={loading}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-5 w-5" />
                    Tải thêm hoạt động
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ActivityLogs;
