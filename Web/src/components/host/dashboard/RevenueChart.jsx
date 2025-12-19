import React from "react";
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "../../../utils/price";

/**
 * Component hiển thị biểu đồ doanh thu và booking
 */
const RevenueChart = ({ data }) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">
            {payload[0].payload.month}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600">
              Doanh thu: {formatPrice(payload[0].value)}
            </p>
            <p className="text-sm text-green-600">
              Booking: {payload[1].value} đơn
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Y-axis formatter cho doanh thu
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value;
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Biểu đồ Doanh thu & Booking
        </h2>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Chưa có dữ liệu
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Biểu đồ Doanh thu & Booking
        </h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Doanh thu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Booking</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#3b82f6"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickFormatter={formatYAxis}
            tickLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#10b981"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
            maxBarSize={50}
          />
          <Bar
            yAxisId="right"
            dataKey="bookings"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

RevenueChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      revenue: PropTypes.number.isRequired,
      bookings: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default RevenueChart;
