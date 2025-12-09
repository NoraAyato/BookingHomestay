import React from "react";

// Simple chart components for demo purposes
export const ResponsiveContainer = ({ children, width, height }) => (
  <div className="w-full h-full flex items-center justify-center">
    {children}
  </div>
);

export const LineChart = ({ data, margin, children }) => (
  <div className="bg-gray-100 rounded p-4 h-full flex items-center justify-center">
    <div className="text-center">
      <div className="text-gray-600 mb-2">📊 Revenue Chart</div>
      <div className="text-sm text-gray-500">
        Chart data: {data?.length} points
      </div>
    </div>
  </div>
);

export const BarChart = ({ data, children }) => (
  <div className="bg-gray-100 rounded p-4 h-full flex items-center justify-center">
    <div className="text-center">
      <div className="text-gray-600 mb-2">📊 Bar Chart</div>
      <div className="text-sm text-gray-500">
        Chart data: {data?.length} points
      </div>
    </div>
  </div>
);

export const PieChart = ({ children }) => (
  <div className="bg-gray-100 rounded p-4 h-full flex items-center justify-center">
    <div className="text-center">
      <div className="text-gray-600 mb-2">🥧 Pie Chart</div>
      <div className="text-sm text-gray-500">Booking status distribution</div>
    </div>
  </div>
);

// Empty components for compatibility
export const XAxis = () => null;
export const YAxis = () => null;
export const CartesianGrid = () => null;
export const Tooltip = () => null;
export const Line = () => null;
export const Bar = () => null;
export const Pie = () => null;
export const Cell = () => null;
export const Legend = () => null;
