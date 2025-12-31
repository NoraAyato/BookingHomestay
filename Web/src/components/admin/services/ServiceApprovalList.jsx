import React from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Home,
  Package,
  Calendar,
  Ban,
} from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";

const ServiceApprovalList = ({
  services,
  loading,
  onViewDetail,
  onApprove,
  onReject,
  formatDate,
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 font-medium">
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Đã duyệt
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center text-sm text-red-700 bg-red-50 px-3 py-1.5 rounded-full border border-red-200 font-medium">
            <Ban className="h-4 w-4 mr-1.5" />
            Từ chối
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center text-sm text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200 font-medium">
            <Clock className="h-4 w-4 mr-1.5" />
            Chờ duyệt
          </span>
        );
    }
  };

  const getBorderColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "border-gray-200";
      case "REJECTED":
        return "border-red-200 bg-red-50/30";
      case "PENDING":
      default:
        return "border-orange-200 bg-orange-50/30";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Không tìm thấy dịch vụ
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Không có dịch vụ nào phù hợp với bộ lọc của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {services.map((service) => (
        <div
          key={service.id}
          className={`bg-white rounded-lg border-2 ${getBorderColor(
            service.status
          )} p-4 hover:shadow-lg transition-all duration-200`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Home className="h-4 w-4 text-gray-500" />
                <h3 className="text-base font-semibold text-gray-900">
                  {service.homestayName}
                </h3>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span>Chủ nhà: {service.hostName}</span>
                <span>•</span>
                <span>{service.hostPhone}</span>
              </div>
            </div>
            {getStatusBadge(service.status)}
          </div>

          {/* Service Info */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg p-3 mb-3">
            <div className="flex items-start gap-3">
              {/* Service Image */}
              <div className="flex-shrink-0">
                <img
                  src={getImageUrl(service.image)}
                  alt={service.serviceName}
                  className="w-20 h-20 rounded-lg object-cover border-2 border-white shadow-sm"
                />
              </div>

              {/* Service Details */}
              <div className="flex-1">
                <div className="flex items-center space-x-1.5 mb-1">
                  <Package className="h-4 w-4 text-blue-600" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    {service.serviceName}
                  </h4>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-gray-600 mb-2">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(service.requestDate)}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              {service.status === "APPROVED" && service.approveDate && (
                <span className="text-xs text-gray-500">
                  Duyệt lúc: {formatDate(service.approveDate)}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                onClick={() => onViewDetail(service)}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Chi tiết</span>
              </button>
              {service.status === "PENDING" && (
                <>
                  <button
                    className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    onClick={() => onApprove(service)}
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Duyệt</span>
                  </button>
                  <button
                    className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    onClick={() => onReject(service)}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    <span>Từ chối</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceApprovalList;
