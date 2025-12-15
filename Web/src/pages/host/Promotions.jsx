import React, { useState, useEffect } from "react";
import HostLayout from "../../components/host/common/HostLayout";
import Pagination from "../../components/host/common/Pagination";
import PromotionsList from "../../components/host/promotions/PromotionsList";
import PromotionDetailModal from "../../components/host/promotions/PromotionDetailModal";
import PromotionCreateModal from "../../components/host/promotions/PromotionCreateModal";
import PromotionUpdateModal from "../../components/host/promotions/PromotionUpdateModal";
import PromotionDeleteModal from "../../components/host/promotions/PromotionDeleteModal";
import DateRangePicker from "../../components/common/DateRangePicker";
import usePromotionManager from "../../hooks/host/usePromotionManager";
import { useHostHomestays } from "../../hooks/host/useHostHomestays";
import { useDebounce } from "../../hooks/useDebounce";
import {
  Plus,
  Search,
  Filter,
  Gift,
  TrendingUp,
  Users,
  Calendar,
  Percent,
} from "lucide-react";

const Promotions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search term (2 seconds)
  const debouncedSearchTerm = useDebounce(searchTerm, 2000);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const pageSize = 5;

  // Use promotion manager hook
  const {
    promotions,
    stats,
    pagination,
    loading,
    fetchPromotions,
    fetchStats,
    createPromotion,
    updatePromotion,
    deletePromotion,
  } = usePromotionManager();

  // Use homestays hook for select list
  const { homestaysSelectList, selectListLoading } = useHostHomestays();

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch promotions when filters change (use debounced search)
  useEffect(() => {
    const params = {
      search: debouncedSearchTerm,
      page: currentPage,
      size: pageSize,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status:
        statusFilter === "active"
          ? "Active"
          : statusFilter === "inactive"
          ? "Inactive"
          : statusFilter !== "all"
          ? statusFilter
          : undefined,
      type:
        typeFilter === "percentage"
          ? "Percentage"
          : typeFilter === "fixed"
          ? "Fixed"
          : typeFilter !== "all"
          ? typeFilter
          : undefined,
    };

    console.log("Fetching promotions with params:", params);

    if (!dateError) {
      fetchPromotions(params);
    }
  }, [
    debouncedSearchTerm,
    startDate,
    endDate,
    statusFilter,
    typeFilter,
    currentPage,
    dateError,
    fetchPromotions,
  ]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, startDate, endDate, statusFilter, typeFilter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatValue = (type, value) => {
    return type?.toLowerCase() === "percentage"
      ? `${value}%`
      : formatCurrency(value);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      Active: { label: "Đang hoạt động", color: "bg-green-100 text-green-800" },
      Inactive: { label: "Tạm dừng", color: "bg-amber-100 text-amber-800" },
    };
    const statusInfo = statusMap[status] || statusMap.Active;
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
    const typeInfo = typeMap[type?.toLowerCase()] || typeMap.percentage;
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

  const getUsagePercentage = (used, total) => {
    if (!total || total === 0) return 0;
    return Math.round((used / total) * 100);
  };

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

  // Pagination - use pagination from hook
  const totalItems = pagination.total;
  const totalPages = Math.ceil(totalItems / pageSize);

  console.log("Pagination state:", {
    totalItems,
    totalPages,
    currentPage,
    pagination,
  });

  // No need to filter again, promotions from hook are already filtered
  const paginatedPromotions = promotions;

  const handleViewPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setIsDetailModalOpen(true);
  };

  const handleEditPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setIsUpdateModalOpen(true);
  };

  const handleCreatePromotion = async (formDataToSend) => {
    setCreateLoading(true);
    try {
      const { success } = await createPromotion(formDataToSend);

      if (success) {
        setIsCreateModalOpen(false);
        // Refresh data
        await fetchPromotions({
          search: debouncedSearchTerm,
          page: 1,
          size: pageSize,
          startDate,
          endDate,
          status: statusFilter !== "all" ? statusFilter : undefined,
          type: typeFilter !== "all" ? typeFilter : undefined,
        });
        await fetchStats();
        setCurrentPage(1);
      }
    } catch (err) {
      console.error("Error creating promotion:", err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdatePromotion = async (id, updateData) => {
    setUpdateLoading(true);
    try {
      const { success } = await updatePromotion(id, updateData);

      if (success) {
        setIsUpdateModalOpen(false);
        setSelectedPromotion(null);
        // Refresh data
        await fetchPromotions({
          search: debouncedSearchTerm,
          page: currentPage,
          size: pageSize,
          startDate,
          endDate,
          status: statusFilter !== "all" ? statusFilter : undefined,
          type: typeFilter !== "all" ? typeFilter : undefined,
        });
        await fetchStats();
      }
    } catch (err) {
      console.error("Error updating promotion:", err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeletePromotionClick = (promotion) => {
    setSelectedPromotion(promotion);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    setDeleteLoading(true);
    try {
      const { success } = await deletePromotion(id);

      if (success) {
        setIsDeleteModalOpen(false);
        setSelectedPromotion(null);
        // Refresh data - go to page 1 if current page becomes empty
        const newTotal = pagination.total - 1;
        const newTotalPages = Math.ceil(newTotal / pageSize);
        const pageToFetch = currentPage > newTotalPages ? 1 : currentPage;

        await fetchPromotions({
          search: debouncedSearchTerm,
          page: pageToFetch,
          size: pageSize,
          startDate,
          endDate,
          status: statusFilter !== "all" ? statusFilter : undefined,
          type: typeFilter !== "all" ? typeFilter : undefined,
        });
        await fetchStats();

        if (pageToFetch !== currentPage) {
          setCurrentPage(pageToFetch);
        }
      }
    } catch (err) {
      console.error("Error deleting promotion:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <HostLayout>
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
                  {stats.total}
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
                  {stats.active}
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
                  {stats.totalUsage.toLocaleString()}
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
                  {stats.inactive || 0}
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
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Tìm kiếm khuyến mãi hoặc mã..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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

              {/* Type Filter and Date Range - Side by Side */}
              <div className="flex items-center space-x-4">
                {/* Type Filter */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Loại:
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setTypeFilter("all")}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        typeFilter === "all"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setTypeFilter("percentage")}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center ${
                        typeFilter === "percentage"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Percent className="h-3 w-3 mr-1" />
                      Phần trăm
                    </button>
                    <button
                      onClick={() => setTypeFilter("fixed")}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center ${
                        typeFilter === "fixed"
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Gift className="h-3 w-3 mr-1" />
                      Cố định
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
        </div>

        {/* Promotions List */}
        <PromotionsList
          promotions={paginatedPromotions}
          onView={handleViewPromotion}
          onEdit={handleEditPromotion}
          onDelete={handleDeletePromotionClick}
          formatCurrency={formatCurrency}
          formatValue={formatValue}
          getStatusBadge={getStatusBadge}
          getTypeBadge={getTypeBadge}
          getUsagePercentage={getUsagePercentage}
        />

        {/* Pagination */}
        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            itemsPerPage={pagination.limit || pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            itemLabel="khuyến mãi"
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
        homestays={homestaysSelectList}
        homestaysLoading={selectListLoading}
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
        homestays={homestaysSelectList}
        homestaysLoading={selectListLoading}
      />

      {/* Delete Modal */}
      <PromotionDeleteModal
        promotion={selectedPromotion}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPromotion(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
      />
    </HostLayout>
  );
};

export default Promotions;
