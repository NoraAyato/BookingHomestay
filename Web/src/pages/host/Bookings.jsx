import React, { useState, useEffect } from "react";
import HostLayout from "../../components/host/common/HostLayout";
import Pagination from "../../components/host/common/Pagination";
import BookingDetailModal from "../../components/host/bookings/BookingDetailModal";
import BookingList from "../../components/host/bookings/BookingList";
import CompleteBookingModal from "../../components/host/bookings/CompleteBookingModal";
import ExportOptionsModal from "../../components/host/bookings/ExportOptionsModal";
import DateRangePicker from "../../components/common/DateRangePicker";
import useHostBookings from "../../hooks/host/useHostBookings";
import { handleApiResponse } from "../../utils/apiHelper";
import {
  Search,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Download,
  Loader2,
} from "lucide-react";

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [bookingToComplete, setBookingToComplete] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sử dụng hook để lấy data từ API
  const {
    stats,
    bookings,
    pagination,
    isLoadingStats,
    isLoadingBookings,
    isExporting,
    error,
    updateFilters,
    changePage,
    refresh,
    updateBooking,
    exportBookings,
  } = useHostBookings();

  // Sync local state với filters của hook
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({
        keyword: searchTerm,
        status: statusFilter,
        startDate: startDate || null,
        endDate: endDate || null,
      });
    }, 500); // Debounce 500ms cho search

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, startDate, endDate, updateFilters]);

  const handlePageChange = (page) => {
    changePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedBooking(null);
  };

  const handleDateRangeApply = ({ startDate: start, endDate: end }) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setStartDate("");
    setEndDate("");
  };

  const handleOpenCompleteModal = (booking) => {
    setBookingToComplete(booking);
    setIsCompleteModalOpen(true);
  };

  const handleCloseCompleteModal = () => {
    setIsCompleteModalOpen(false);
    setBookingToComplete(null);
  };

  const handleCompleteBooking = async (bookingId) => {
    const response = await updateBooking(bookingId);
    const isSuccess = handleApiResponse(
      response,
      response.message || "Hoàn thành đơn đặt phòng thành công",
      "Có lỗi xảy ra khi hoàn thành đơn"
    );

    if (isSuccess) {
      await refresh();
      handleCloseCompleteModal();
    }
  };

  const handleOpenExportModal = () => {
    setIsExportModalOpen(true);
  };

  const handleCloseExportModal = () => {
    setIsExportModalOpen(false);
  };

  const handleExport = async (days) => {
    await exportBookings(days, {
      status: statusFilter,
      keyword: searchTerm,
    });
    handleCloseExportModal();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <HostLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý đặt phòng
            </h1>
            <p className="text-gray-600 mt-1">
              Xem và quản lý tất cả booking của bạn
            </p>
          </div>
          <button
            onClick={handleOpenExportModal}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md"
          >
            <Download className="h-5 w-5" />
            Xuất báo cáo
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-gray-600 font-medium">Tổng</p>
            </div>
            {isLoadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-gray-600 font-medium">Chờ duyệt</p>
            </div>
            {isLoadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <p className="text-2xl font-bold text-amber-600">
                {stats.pending}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm text-gray-600 font-medium">Đã đặt</p>
            </div>
            {isLoadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <p className="text-2xl font-bold text-green-600">
                {stats.booked}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-gray-600 font-medium">Hoàn thành</p>
            </div>
            {isLoadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <p className="text-2xl font-bold text-blue-600">
                {stats.completed}
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-gray-600 font-medium">Đã hủy</p>
            </div>
            {isLoadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <p className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </p>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-5 w-5 text-white" />
              <p className="text-sm text-blue-100 font-medium">Doanh thu</p>
            </div>
            {isLoadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            ) : (
              <p className="text-lg font-bold text-white">
                {formatCurrency(stats.revenue)}
              </p>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên khách, mã booking, homestay..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Pending">Chờ xác nhận</option>
                <option value="Booked">Đã đặt</option>
                <option value="Completed">Hoàn thành</option>
                <option value="Cancelled">Đã hủy</option>
              </select>

              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onApply={handleDateRangeApply}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingBookings && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Đang tải danh sách booking...</p>
            </div>
          </div>
        )}

        {/* Bookings List */}
        {!isLoadingBookings && bookings.length > 0 && (
          <BookingList
            bookings={bookings}
            onViewDetail={handleViewDetail}
            onComplete={handleOpenCompleteModal}
          />
        )}

        {/* Empty State */}
        {!isLoadingBookings && bookings.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy booking
              </h3>
              <p className="text-gray-600 mb-6">
                Thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn
              </p>
              <button
                onClick={handleResetFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoadingBookings && bookings.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalItems={pagination.total}
            itemsPerPage={pagination.limit}
            onPageChange={handlePageChange}
            itemLabel="booking"
          />
        )}

        {/* Booking Detail Modal */}
        <BookingDetailModal
          booking={selectedBooking}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetail}
        />

        {/* Complete Booking Modal */}
        <CompleteBookingModal
          booking={bookingToComplete}
          isOpen={isCompleteModalOpen}
          onClose={handleCloseCompleteModal}
          onConfirm={handleCompleteBooking}
        />

        {/* Export Options Modal */}
        <ExportOptionsModal
          isOpen={isExportModalOpen}
          onClose={handleCloseExportModal}
          onExport={handleExport}
          isExporting={isExporting}
        />
      </div>
    </HostLayout>
  );
};

export default Bookings;
