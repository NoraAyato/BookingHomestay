import React, { useState } from "react";
import HostLayout from "../../components/host/common/HostLayout";
import { useHostDashboard } from "../../hooks/host/useHostDashboard";
import StatsCard from "../../components/host/dashboard/StatsCard";
import RevenueChart from "../../components/host/dashboard/RevenueChart";
import RecentBookings from "../../components/host/dashboard/RecentBookings";
import { Calendar, Home, Star, DollarSign, RefreshCw } from "lucide-react";
import { formatPrice } from "../../utils/price";

const Dashboard = () => {
  const [revenuePeriod, setRevenuePeriod] = useState(6);

  // Sử dụng custom hook để fetch data từ API
  const { stats, revenueData, recentBookings, loading, error, refresh } =
    useHostDashboard(revenuePeriod);

  // Handle revenue time range change
  const handleRevenueTimeRangeChange = (e) => {
    const value = parseInt(e.target.value);
    console.log("[Dashboard] Changing revenuePeriod to:", value);
    setRevenuePeriod(value);
  };

  return (
    <HostLayout>
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-800 font-semibold mb-1">
                Lỗi tải dữ liệu
              </h3>
              <p className="text-red-600">{error}</p>
            </div>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && stats && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tổng quan Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Theo dõi hiệu suất và quản lý homestay của bạn
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                title="Làm mới dữ liệu"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Làm mới</span>
              </button>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Tổng doanh thu"
              value={formatPrice(stats.totalRevenue)}
              icon={<DollarSign />}
              trend="so với kỳ trước"
              trendValue={stats.changePercentages.revenue}
              bgColor="bg-green-50"
              iconColor="text-green-600"
            />
            <StatsCard
              title="Tổng đặt phòng"
              value={stats.totalBookings}
              icon={<Calendar />}
              trend="so với kỳ trước"
              trendValue={stats.changePercentages.bookings}
              bgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatsCard
              title="Homestay của bạn"
              value={stats.totalHomestays}
              subValue={`${stats.activeHomestays} đang hoạt động`}
              icon={<Home />}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
            <StatsCard
              title="Đánh giá trung bình"
              value={`⭐ ${stats.averageRating}/5`}
              icon={<Star />}
              trend="so với kỳ trước"
              trendValue={stats.changePercentages.rating}
              bgColor="bg-yellow-50"
              iconColor="text-yellow-600"
            />
          </div>

          {/* Revenue Chart with Filter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Biểu đồ doanh thu & Booking
              </h2>
              <select
                value={revenuePeriod}
                onChange={handleRevenueTimeRangeChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="6">6 tháng qua</option>
                <option value="12">12 tháng qua</option>
              </select>
            </div>
            <RevenueChart data={revenueData} />
          </div>

          {/* Recent Bookings Table */}
          <RecentBookings bookings={recentBookings} />
        </div>
      )}
    </HostLayout>
  );
};

export default Dashboard;
