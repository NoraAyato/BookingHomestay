import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Building,
  Calendar,
  DollarSign,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useDashboardStats } from "../../../hooks/admin/useDashboard";

const DashboardStats = ({ period }) => {
  const { stats, loading, error } = useDashboardStats(period);

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Helper function to format number with thousand separator
  const formatNumber = (num) => {
    return num.toLocaleString("vi-VN");
  };

  // Map API data to UI config with icons and colors
  const getStatsConfig = () => {
    if (!stats) return [];

    return [
      {
        title: stats.totalRevenue.title,
        value: stats.totalRevenue.value,
        change: stats.totalRevenue.change,
        trend: stats.totalRevenue.trend,
        icon: DollarSign,
        color: "green",
      },
      {
        title: stats.totalBookings.title,
        value: stats.totalBookings.value,
        change: stats.totalBookings.change,
        trend: stats.totalBookings.trend,
        icon: Calendar,
        color: "blue",
      },
      {
        title: stats.activeHomestays.title,
        value: stats.activeHomestays.value,
        change: stats.activeHomestays.change,
        trend: stats.activeHomestays.trend,
        icon: Building,
        color: "purple",
      },
      {
        title: stats.totalUsers.title,
        value: stats.totalUsers.value,
        change: stats.totalUsers.change,
        trend: stats.totalUsers.trend,
        icon: Users,
        color: "orange",
      },
    ];
  };

  const getColorClasses = (color, trend) => {
    const getTrendColor = (t) => {
      if (t === "up") return "text-green-600";
      if (t === "down") return "text-red-600";
      return "text-gray-600"; // neutral
    };

    const colors = {
      green: {
        bg: "bg-green-50",
        icon: "text-green-600",
        trend: getTrendColor(trend),
      },
      blue: {
        bg: "bg-blue-50",
        icon: "text-blue-600",
        trend: getTrendColor(trend),
      },
      purple: {
        bg: "bg-purple-50",
        icon: "text-purple-600",
        trend: getTrendColor(trend),
      },
      orange: {
        bg: "bg-orange-50",
        icon: "text-orange-600",
        trend: getTrendColor(trend),
      },
    };
    return colors[color];
  };

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Không thể tải dữ liệu thống kê
            </h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const statsConfig = getStatsConfig();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon =
          stat.trend === "up"
            ? TrendingUp
            : stat.trend === "down"
            ? TrendingDown
            : Minus;
        const colorClasses = getColorClasses(stat.color, stat.trend);

        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendIcon className={`h-4 w-4 mr-1 ${colorClasses.trend}`} />
                  <span className={`text-sm font-medium ${colorClasses.trend}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    so với kỳ trước
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${colorClasses.bg}`}>
                <Icon className={`h-6 w-6 ${colorClasses.icon}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
