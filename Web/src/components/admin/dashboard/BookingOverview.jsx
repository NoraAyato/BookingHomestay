import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useBookingStatus } from "../../../hooks/admin/useDashboard";
import { Loader2, AlertCircle } from "lucide-react";

const BookingOverview = ({ period }) => {
  const { data, loading, error } = useBookingStatus(period);

  // Map API status names to Vietnamese and assign colors
  const getStatusConfig = (apiData) => {
    if (!apiData) return [];

    const statusMap = {
      Booked: { name: "Đã xác nhận", color: "#10b981" },
      Cancelled: { name: "Đã hủy", color: "#ef4444" },
      Pending: { name: "Chờ xử lý", color: "#f59e0b" },
      Completed: { name: "Hoàn thành", color: "#3b82f6" },
    };

    return apiData.map((item) => ({
      name: statusMap[item.name]?.name || item.name,
      value: item.value, // Already parsed in hook
      color: statusMap[item.name]?.color || "#6b7280",
    }));
  };

  const bookingStatusData = getStatusConfig(data);

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Tổng quan đặt chỗ
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Phân bổ trạng thái đặt chỗ
            </p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Tổng quan đặt chỗ
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Phân bổ trạng thái đặt chỗ
            </p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Không thể tải dữ liệu biểu đồ
                </h4>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Tổng quan đặt chỗ
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Phân bổ trạng thái đặt chỗ
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={bookingStatusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {bookingStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} booking`, name]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Bookings */}
    </div>
  );
};

export default BookingOverview;
