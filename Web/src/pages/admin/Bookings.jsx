import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import Pagination from "../../components/admin/common/Pagination";
import BookingsList from "../../components/admin/bookings/BookingsList";
import BookingDetailModal from "../../components/admin/bookings/BookingDetailModal";
import DateRangePicker from "../../components/common/DateRangePicker";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAdminBookings } from "../../hooks/admin/useBookingManager";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  Clock,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertCircle,
  XCircle,
  CalendarCheck,
  FileText,
} from "lucide-react";

const Bookings = () => {
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use admin bookings hook
  const {
    bookings,
    stats,
    loading,
    error,
    pagination,
    setFilters,
    changePage,
    refetch,
  } = useAdminBookings(1, pageSize);

  // Update filters when search/status/date changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({
        status: statusFilter === "all" ? null : statusFilter,
        startDate: dateRange.startDate || null,
        endDate: dateRange.endDate || null,
        keyword: searchTerm || null,
      });
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, dateRange, setFilters]);

  const getStatusBadge = (status) => {
    const statusMap = {
      Booked: {
        label: "Đã xác nhận",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      },
      Pending: {
        label: "Chờ xử lý",
        color: "bg-amber-100 text-amber-800 border-amber-200",
      },
      Completed: {
        label: "Đã hoàn thành",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      },
      Cancelled: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800 border-red-200",
      },
    };
    const statusInfo = statusMap[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus) => {
    if (!paymentStatus) {
      return (
        <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border bg-gray-100 text-gray-800 border-gray-200">
          Chưa có
        </span>
      );
    }

    const paymentMap = {
      Paid: {
        label: "Đã thanh toán",
        color: "bg-green-100 text-green-800 border-green-200",
      },
      Pending: {
        label: "Chờ thanh toán",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
      Failed: {
        label: "Thất bại",
        color: "bg-red-100 text-red-800 border-red-200",
      },
      Refunded: {
        label: "Đã hoàn tiền",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      },
      Cancelled: {
        label: "Đã hủy",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      },
    };
    const paymentInfo = paymentMap[paymentStatus] || {
      label: paymentStatus,
      color: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${paymentInfo.color}`}
      >
        {paymentInfo.label}
      </span>
    );
  };

  const getPaymentMethodLabel = (method) => {
    if (!method) return "Chưa có";

    const methodMap = {
      credit_card: "Thẻ tín dụng",
      bank_transfer: "Chuyển khoản",
      momo: "MoMo",
      vnpay: "VNPay",
      cash: "Tiền mặt",
    };
    return methodMap[method] || method;
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "Chưa có";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  // Calculate nights from checkIn and checkOut
  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statsData = stats || {
    total: 0,
    booked: 0,
    pending: 0,
    completed: 0,
    cancelled: 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý đặt chỗ
            </h1>
            <p className="text-gray-600 mt-1">
              Xem và theo dõi tất cả đặt chỗ trên hệ thống
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {statsData.total}
                </p>
                <p className="text-sm text-gray-600">Tổng đặt chỗ</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-emerald-600">
                  {statsData.booked}
                </p>
                <p className="text-sm text-gray-600">Đã xác nhận</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-amber-600">
                  {statsData.pending}
                </p>
                <p className="text-sm text-gray-600">Chờ xử lý</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <CalendarCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-blue-600">
                  {statsData.completed}
                </p>
                <p className="text-sm text-gray-600">Hoàn thành</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-red-600">
                  {statsData.cancelled}
                </p>
                <p className="text-sm text-gray-600">Đã hủy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="booked">Đã xác nhận</option>
                <option value="pending">Chờ xử lý</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>

              <DateRangePicker
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onApply={setDateRange}
              />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-10 text-center">
            <p className="text-gray-500">Không có dữ liệu đặt chỗ</p>
          </div>
        ) : (
          <BookingsList
            bookings={bookings.map((booking) => ({
              ...booking,
              nights: calculateNights(booking.checkIn, booking.checkOut),
            }))}
            onView={handleViewBooking}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
            getStatusBadge={getStatusBadge}
            getPaymentBadge={getPaymentBadge}
            getPaymentMethodLabel={getPaymentMethodLabel}
          />
        )}

        {/* Pagination */}
        {!loading && bookings.length > 0 && (
          <Pagination
            page={pagination.page}
            pageSize={pagination.limit}
            total={pagination.total}
            onPageChange={changePage}
          />
        )}

        {/* Booking Detail Modal */}
        <BookingDetailModal
          booking={selectedBooking}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          formatDate={formatDate}
          formatCurrency={formatCurrency}
        />
      </div>
    </AdminLayout>
  );
};

export default Bookings;
