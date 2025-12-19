import React from "react";
import { Edit, Eye, Trash2, Gift, Percent } from "lucide-react";

const PromotionsList = ({
  promotions,
  onView,
  onEdit,
  onDelete,
  formatCurrency,
  formatValue,
  getStatusBadge,
  getTypeBadge,
  getUsagePercentage,
}) => {
  // Check if promotion is expired
  const isExpired = (endDate) => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const promoEndDate = new Date(endDate);
    promoEndDate.setHours(0, 0, 0, 0);
    return promoEndDate < currentDate;
  };

  // Get status badge with expired check
  const getPromotionStatusBadge = (promotion) => {
    if (isExpired(promotion.endDate)) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          Hết hạn
        </span>
      );
    }
    return getStatusBadge(promotion.status);
  };

  return (
    <div className="space-y-4">
      {promotions.map((promotion) => (
        <div
          key={promotion.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0 mb-4 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {promotion.title}
                </h3>
                {getPromotionStatusBadge(promotion)}
                {getTypeBadge(promotion.type)}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {promotion.code}
                </span>
                <span>
                  Giá trị:{" "}
                  <strong>
                    {formatValue(promotion.type, promotion.value)}
                  </strong>
                </span>
                <span>
                  Tối thiểu:{" "}
                  <strong>{formatCurrency(promotion.minBookingAmount)}</strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-gray-600">
                  Thời gian: <strong>{promotion.startDate}</strong> -{" "}
                  <strong>{promotion.endDate}</strong>
                </span>
                <span className="text-gray-600">
                  Áp dụng cho homestay:{" "}
                  {promotion.homestays && promotion.homestays.length > 0 ? (
                    <strong className="text-blue-600">
                      {promotion.homestays
                        .map((h) => h.homestayName)
                        .join(", ")}
                    </strong>
                  ) : (
                    <strong className="text-green-600">Tất cả</strong>
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:items-end space-y-3">
              {/* Usage Progress */}
              <div className="w-full lg:w-48">
                <div className="flex justify-between text-sm mb-1">
                  <span>Đã sử dụng</span>
                  <span>
                    {promotion.usageCount}/{promotion.usageLimit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${getUsagePercentage(
                        promotion.usageCount,
                        promotion.usageLimit
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {getUsagePercentage(
                    promotion.usageCount,
                    promotion.usageLimit
                  )}
                  % đã sử dụng
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => onView(promotion)}
                  className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded flex items-center space-x-1 transition-colors"
                >
                  <Eye className="h-3 w-3" />
                  <span>Xem</span>
                </button>
                <button
                  onClick={() => onEdit(promotion)}
                  className="px-3 py-1 text-green-600 hover:bg-green-50 rounded flex items-center space-x-1 transition-colors"
                >
                  <Edit className="h-3 w-3" />
                  <span>Sửa</span>
                </button>
                <button
                  onClick={() => onDelete(promotion)}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded flex items-center space-x-1 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {promotions.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-gray-500">
            <Gift className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Không tìm thấy khuyến mãi</p>
            <p className="text-sm mt-1">
              Hãy thử thay đổi bộ lọc hoặc tìm kiếm
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionsList;
