import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DollarSign, TrendingUp, Calendar, Download } from "lucide-react";

const Revenue = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  // Mock data - replace with real API calls
  const monthlyRevenue = [
    { month: "Jan", revenue: 45000000, bookings: 45, commission: 4500000 },
    { month: "Feb", revenue: 52000000, bookings: 52, commission: 5200000 },
    { month: "Mar", revenue: 48000000, bookings: 48, commission: 4800000 },
    { month: "Apr", revenue: 61000000, bookings: 61, commission: 6100000 },
    { month: "May", revenue: 58000000, bookings: 58, commission: 5800000 },
    { month: "Jun", revenue: 67000000, bookings: 67, commission: 6700000 },
    { month: "Jul", revenue: 74000000, bookings: 74, commission: 7400000 },
    { month: "Aug", revenue: 69000000, bookings: 69, commission: 6900000 },
    { month: "Sep", revenue: 63000000, bookings: 63, commission: 6300000 },
    { month: "Oct", revenue: 71000000, bookings: 71, commission: 7100000 },
    { month: "Nov", revenue: 68000000, bookings: 68, commission: 6800000 },
    { month: "Dec", revenue: 78000000, bookings: 78, commission: 7800000 },
  ];

  const revenueByHomestay = [
    { name: "Villa Sapa Dreams", revenue: 85000000, percentage: 15 },
    { name: "Hoi An Traditional", revenue: 72000000, percentage: 13 },
    { name: "Da Lat Cozy House", revenue: 68000000, percentage: 12 },
    { name: "Nha Trang Beach Villa", revenue: 64000000, percentage: 11 },
    { name: "Hanoi Old Quarter", revenue: 58000000, percentage: 10 },
    { name: "Others", revenue: 218000000, percentage: 39 },
  ];

  const revenueBreakdown = [
    { name: "Booking Fees", value: 65, color: "#3b82f6" },
    { name: "Service Fees", value: 20, color: "#10b981" },
    { name: "Cancellation Fees", value: 10, color: "#f59e0b" },
    { name: "Other", value: 5, color: "#8b5cf6" },
  ];

  const topHosts = [
    {
      name: "Nguyễn Văn Host A",
      homestays: 5,
      revenue: 125000000,
      commission: 12500000,
    },
    {
      name: "Trần Thị Host B",
      homestays: 3,
      revenue: 98000000,
      commission: 9800000,
    },
    {
      name: "Lê Văn Host C",
      homestays: 4,
      revenue: 87000000,
      commission: 8700000,
    },
    {
      name: "Phạm Thị Host D",
      homestays: 2,
      revenue: 76000000,
      commission: 7600000,
    },
    {
      name: "Hoàng Văn Host E",
      homestays: 6,
      revenue: 69000000,
      commission: 6900000,
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = monthlyRevenue.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const totalCommission = monthlyRevenue.reduce(
    (sum, item) => sum + item.commission,
    0
  );
  const totalBookings = monthlyRevenue.reduce(
    (sum, item) => sum + item.bookings,
    0
  );
  const avgRevenuePerBooking = totalRevenue / totalBookings;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Revenue Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive revenue tracking and analytics
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalRevenue)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">
                    +12.5%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    vs last year
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Commission Earned
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalCommission)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm font-medium text-blue-600">
                    +8.2%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    vs last year
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalBookings}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm font-medium text-purple-600">
                    +15.3%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    vs last year
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Revenue/Booking
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(avgRevenuePerBooking)}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-sm font-medium text-orange-600">
                    +5.1%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    vs last year
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Trend
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Commission</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="commission"
                    stroke="#10b981"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Revenue Breakdown
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Revenue by Homestay and Top Hosts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Revenue by Homestay */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Revenue by Homestay
            </h3>
            <div className="space-y-4">
              {revenueByHomestay.map((homestay, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {homestay.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {homestay.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${homestay.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(homestay.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Hosts */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Top Performing Hosts
            </h3>
            <div className="space-y-4">
              {topHosts.map((host, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {host.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {host.homestays} homestays
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(host.revenue)}
                    </p>
                    <p className="text-xs text-green-600">
                      Commission: {formatCurrency(host.commission)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Revenue;
