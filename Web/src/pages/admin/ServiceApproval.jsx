import React, { useState } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import Pagination from "../../components/admin/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import ServiceApprovalList from "../../components/admin/services/ServiceApprovalList";
import { useHomestayServiceApproval } from "../../hooks/admin/useHomestayServiceApproval";
import { getImageUrl } from "../../utils/imageUrl";
import {
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Package,
  Ban,
} from "lucide-react";

const ServiceApproval = () => {
  const {
    services,
    loading,
    page,
    limit,
    total,
    stats,
    statusFilter: currentStatusFilter,
    handlePageChange,
    handleSearch,
    handleStatusFilter,
    handleApprove,
    handleReject,
  } = useHomestayServiceApproval();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [serviceToAction, setServiceToAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewDetail = (service) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
  };

  const handleApproveClick = (service) => {
    setServiceToAction(service);
    setIsApproveModalOpen(true);
  };

  const handleRejectClick = (service) => {
    setServiceToAction(service);
    setIsRejectModalOpen(true);
  };

  const handleApproveConfirm = async () => {
    setIsProcessing(true);
    const success = await handleApprove(serviceToAction.id);
    setIsProcessing(false);

    if (success) {
      setIsApproveModalOpen(false);
      setServiceToAction(null);
    }
  };

  const handleRejectConfirm = async () => {
    setIsProcessing(true);
    const success = await handleReject(serviceToAction.id);
    setIsProcessing(false);

    if (success) {
      setIsRejectModalOpen(false);
      setServiceToAction(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Xét duyệt dịch vụ Homestay
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý và phê duyệt các dịch vụ được đề xuất bởi chủ homestay
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Tổng dịch vụ</div>
                <div className="text-xl font-semibold text-gray-900">
                  {stats.total}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Chờ duyệt</div>
                <div className="text-xl font-semibold text-orange-600">
                  {stats.pending}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Đã duyệt</div>
                <div className="text-xl font-semibold text-green-600">
                  {stats.approved}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <Ban className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Từ chối</div>
                <div className="text-xl font-semibold text-red-600">
                  {stats.rejected}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo homestay, dịch vụ, chủ nhà..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={currentStatusFilter || "all"}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "all") {
                    handleStatusFilter(null);
                  } else {
                    handleStatusFilter(value);
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="PENDING">Chờ duyệt</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="REJECTED">Từ chối</option>
              </select>
            </div>
          </div>
        </div>

        {/* Services List */}
        <ServiceApprovalList
          services={services}
          loading={loading}
          onViewDetail={handleViewDetail}
          onApprove={handleApproveClick}
          onReject={handleRejectClick}
          formatDate={formatDate}
        />

        {/* Pagination */}
        {!loading && services.length > 0 && total > limit && (
          <Pagination
            page={page}
            pageSize={limit}
            total={total}
            onPageChange={handlePageChange}
          />
        )}

        {/* Detail Modal */}
        {isDetailModalOpen && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
                <h2 className="text-lg font-semibold text-gray-900">
                  Chi tiết dịch vụ
                </h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Homestay
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedService.homestayName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Tên dịch vụ
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedService.serviceName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Hình ảnh dịch vụ
                  </label>
                  <div className="mt-2">
                    <img
                      src={getImageUrl(selectedService.image)}
                      alt={selectedService.serviceName}
                      className="w-full rounded-lg border border-gray-200 shadow-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Mô tả
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedService.description}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Chủ homestay
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedService.hostName} - {selectedService.hostPhone}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Ngày yêu cầu
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(selectedService.requestDate)}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Trạng thái
                  </label>
                  <div className="mt-1">
                    {selectedService.status === "APPROVED" ? (
                      <span className="inline-flex items-center text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200 font-medium">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Đã duyệt
                        {selectedService.approveDate &&
                          ` - ${formatDate(selectedService.approveDate)}`}
                      </span>
                    ) : selectedService.status === "REJECTED" ? (
                      <span className="inline-flex items-center text-xs text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 font-medium">
                        <Ban className="h-3.5 w-3.5 mr-1" />
                        Từ chối
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 font-medium">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Chờ duyệt
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Approve Modal */}
        <ConfirmModal
          isOpen={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          onConfirm={handleApproveConfirm}
          title="Duyệt dịch vụ"
          message="Bạn có chắc chắn muốn phê duyệt dịch vụ này?"
          itemName={
            serviceToAction
              ? `${serviceToAction.serviceName} - ${serviceToAction.homestayName}`
              : ""
          }
          loading={isProcessing}
          confirmText="Duyệt"
          confirmButtonClass="bg-green-600 hover:bg-green-700 text-white"
          type="success"
        />

        {/* Reject Modal */}
        <ConfirmModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          onConfirm={handleRejectConfirm}
          title="Từ chối dịch vụ"
          message="Bạn có chắc chắn muốn từ chối dịch vụ này? Dịch vụ sẽ bị xóa khỏi danh sách."
          itemName={
            serviceToAction
              ? `${serviceToAction.serviceName} - ${serviceToAction.homestayName}`
              : ""
          }
          loading={isProcessing}
          confirmText="Từ chối"
          confirmButtonClass="bg-red-600 hover:bg-red-700 text-white"
          type="danger"
        />
      </div>
    </AdminLayout>
  );
};

export default ServiceApproval;
