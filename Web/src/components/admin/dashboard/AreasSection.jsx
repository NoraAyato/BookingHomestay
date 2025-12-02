import React from "react";
import { MapPin } from "lucide-react";

const AreasSection = ({ data = [], loading, error }) => {
  if (loading) return <div>Đang tải khu vực...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="space-y-4">
      {data.length === 0 && <div>Không có khu vực nào.</div>}
      {data.map((item, index) => (
        <div
          key={item.id || index}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-blue-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">
              {item.location || item.name}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-600">
              {item.homestayCount || item.count || 0}
            </span>
            <span className="text-sm text-gray-600">homestay</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AreasSection;
