import React from "react";
import PropTypes from "prop-types";

/**
 * Component hiển thị một card thống kê
 */
const StatsCard = ({
  title,
  value,
  subValue,
  icon,
  trend,
  trendValue,
  bgColor = "bg-blue-50",
  iconColor = "text-blue-600",
}) => {
  const isPositiveTrend = trendValue && trendValue.includes("+");
  const isNegativeTrend = trendValue && trendValue.includes("-");
  const isNeutral = trendValue && trendValue.includes("0.0%");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>

          {subValue && <p className="text-sm text-gray-500 mb-2">{subValue}</p>}

          {trendValue && (
            <div className="flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  isPositiveTrend
                    ? "text-green-600"
                    : isNegativeTrend
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {isPositiveTrend && "↑ "}
                {isNegativeTrend && "↓ "}
                {trendValue}
              </span>
              <span className="text-xs text-gray-500">
                {trend || "so với kỳ trước"}
              </span>
            </div>
          )}
        </div>

        <div className={`${bgColor} p-3 rounded-lg`}>
          <div className={`${iconColor} text-2xl`}>{icon}</div>
        </div>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subValue: PropTypes.string,
  icon: PropTypes.node.isRequired,
  trend: PropTypes.string,
  trendValue: PropTypes.string,
  bgColor: PropTypes.string,
  iconColor: PropTypes.string,
};

export default StatsCard;
