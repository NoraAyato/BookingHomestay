import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import Pagination from "../../components/admin/common/Pagination";
import PromotionsList from "../../components/admin/promotions/PromotionsList";
import PromotionDetailModal from "../../components/admin/promotions/PromotionDetailModal";
import PromotionCreateModal from "../../components/admin/promotions/PromotionCreateModal";
import PromotionUpdateModal from "../../components/admin/promotions/PromotionUpdateModal";
import DateRangePicker from "../../components/common/DateRangePicker";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { usePromotionManager } from "../../hooks/admin/usePromotionManager";
import { useDebounce } from "../../hooks/useDebounce";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash2,
  Gift,
  Calendar,
  TrendingUp,
  Users,
  Percent,
} from "lucide-react";

const Promotions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const pageSize = 5;

  // Debounce search term (2 seconds)
  const debouncedSearchTerm = useDebounce(searchTerm, 2000);

  const {
    stats,
    promotions,
    pagination,
    loading,
    statsLoading,
    error,
    fetchPromotions,
    refetchStats,
    addPromotion,
    updatePromotion,
  } = usePromotionManager();

  // Fetch promotions when filters change (use debounced search)
  useEffect(() => {
    const params = {
      search: debouncedSearchTerm,
      page: currentPage,
      size: pageSize,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    };

    if (!dateError) {
      fetchPromotions(params);
    }
  }, [
    debouncedSearchTerm,
    startDate,
    endDate,
    statusFilter,
    currentPage,
    dateError,
    fetchPromotions,
  ]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, startDate, endDate, statusFilter]);

  // Validate date range
  const validateDateRange = (start, end) => {
    setDateError("");

    if (!start && !end) {
      return true;
    }

    if (start && !end) {
      setDateError("Vui lòng chọn ngày kết thúc");
      return false;
    }

    if (!start && end) {
      setDateError("Vui lòng chọn ngày bắt đầu");
      return false;
    }

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    if (startDateObj > endDateObj) {
      setDateError("Ngày bắt đầu phải trước ngày kết thúc");
      return false;
    }

    return true;
  };

  const handleDateRangeApply = ({ startDate: start, endDate: end }) => {
    setStartDate(start);
    setEndDate(end);
    validateDateRange(start, end);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { label: "Đang hoạt động", color: "bg-green-100 text-green-800" },
      inactive: { label: "Tạm dừng", color: "bg-gray-100 text-gray-800" },
    };
    const statusInfo = statusMap[status] || statusMap.active;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeMap = {
      percentage: {
        label: "Phần trăm",
        color: "bg-purple-100 text-purple-800",
        icon: Percent,
      },
      fixed: {
        label: "Cố định",
        color: "bg-orange-100 text-orange-800",
        icon: Gift,
      },
    };
    const typeInfo = typeMap[type];
    const Icon = typeInfo.icon;
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${typeInfo.color} flex items-center`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {typeInfo.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatValue = (type, value) => {
    return type === "percentage" ? `${value}%` : formatCurrency(value);
  };

  const getUsagePercentage = (used, total) => {
    if (!total || total === 0) return 0;
    return Math.round((used / total) * 100);
  };

  const handleViewPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setIsDetailModalOpen(true);
  };

  const handleEditPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setIsUpdateModalOpen(true);
  };

  const handleCreatePromotion = async (data) => {
    setCreateLoading(true);
    try {
      const result = await addPromotion(data);

      if (result.success) {
        // Close modal
        setIsCreateModalOpen(false);

        // Refetch data
        const params = {
          search: debouncedSearchTerm,
          page: currentPage,
          size: pageSize,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
        };
        await fetchPromotions(params);
      }
    } catch (err) {
      console.error("Error creating promotion:", err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdatePromotion = async (id, data) => {
    setUpdateLoading(true);
    try {
      const result = await updatePromotion(id, data);

      if (result.success) {
        // Close modal
        setIsUpdateModalOpen(false);
        setSelectedPromotion(null);

        // Refetch data
        const params = {
          search: debouncedSearchTerm,
          page: currentPage,
          size: pageSize,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
        };
        await fetchPromotions(params);
      }
    } catch (err) {
      console.error("Error updating promotion:", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeletePromotion = (promotion) => {
    console.log("Delete promotion:", promotion);
    // TODO: Implement delete confirmation
  };
  if (loading && promotions.length === 0) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý khuyến mãi
            </h1>
            <p className="text-gray-600 mt-1">
              Tạo và quản lý các chương trình khuyến mãi
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Tạo khuyến mãi mới</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Gift className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Tổng khuyến mãi</div>
                <div className="text-xl font-semibold text-gray-900">
                  {statsLoading ? "..." : stats.total}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Đang hoạt động</div>
                <div className="text-xl font-semibold text-emerald-600">
                  {statsLoading ? "..." : stats.active}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Lượt sử dụng</div>
                <div className="text-xl font-semibold text-amber-600">
                  {statsLoading ? "..." : stats.totalUsage.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Tạm dừng</div>
                <div className="text-xl font-semibold text-gray-600">
                  {statsLoading ? "..." : stats.inactive}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm khuyến mãi hoặc mã..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && searchTerm !== debouncedSearchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Trạng thái:
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      statusFilter === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setStatusFilter("active")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      statusFilter === "active"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Đang hoạt động
                  </button>
                  <button
                    onClick={() => setStatusFilter("inactive")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      statusFilter === "inactive"
                        ? "bg-gray-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tạm dừng
                  </button>
                </div>
              </div>

              {/* Date Range Filter */}
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onApply={handleDateRangeApply}
                error={dateError}
              />
            </div>
          </div>
        </div>

        {/* Promotions List */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <PromotionsList
          promotions={promotions}
          onView={handleViewPromotion}
          onEdit={handleEditPromotion}
          onDelete={handleDeletePromotion}
          formatCurrency={formatCurrency}
          formatValue={formatValue}
          getStatusBadge={getStatusBadge}
          getTypeBadge={getTypeBadge}
          getUsagePercentage={getUsagePercentage}
        />

        {/* Pagination */}
        {pagination.total > 0 && (
          <Pagination
            page={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Detail Modal */}
      <PromotionDetailModal
        promotion={selectedPromotion}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        formatCurrency={formatCurrency}
        formatValue={formatValue}
      />

      {/* Create Modal */}
      <PromotionCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAdd={handleCreatePromotion}
        isLoading={createLoading}
      />

      {/* Update Modal */}
      <PromotionUpdateModal
        promotion={selectedPromotion}
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedPromotion(null);
        }}
        onUpdate={handleUpdatePromotion}
        isLoading={updateLoading}
      />
    </AdminLayout>
  );
};

export default Promotions;
