import React from "react";

const PromotionsSection = ({ data = [], loading, error }) => {
  if (loading) return <div>Đang tải khuyến mãi...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  return (
    <div className="space-y-4">
      {data.length === 0 && <div>Không có khuyến mãi nào.</div>}
      {data.map((promo, index) => (
        <div key={promo.id || index} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-900">{promo.name}</h4>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                promo.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : promo.status === "Disable"
                  ? "bg-gray-200 text-gray-500"
                  : promo.status === "Drap"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {promo.status === "Active"
                ? "Đang hoạt động"
                : promo.status === "Disable"
                ? "Vô hiệu hóa"
                : promo.status === "Drap"
                ? "Bản nháp"
                : promo.status}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Đã sử dụng: {promo.used}/{promo.total}
            </span>
            <span>
              {promo.total > 0
                ? Math.round((promo.used / promo.total) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${
                  promo.total > 0 ? (promo.used / promo.total) * 100 : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromotionsSection;
