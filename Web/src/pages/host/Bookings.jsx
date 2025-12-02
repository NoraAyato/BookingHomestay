import React, { useState } from "react";
import HostLayout from "../../components/host/HostLayout";
import Pagination from "../../components/host/Pagination";
import {
  Search,
  Filter,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  MessageSquare,
  Download,
  Check,
  MoreVertical,
} from "lucide-react";
import mockData from "../../data/hostMockData.json";

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const bookings = mockData.bookings;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        label: "Đã xác nhận",
        icon: CheckCircle,
      },
      pending: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Chờ xác nhận",
        icon: Clock,
      },
      completed: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Hoàn thành",
        icon: CheckCircle,
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Đã hủy",
        icon: XCircle,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const statusConfig = {
      paid: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Đã thanh toán",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Chờ thanh toán",
      },
      refunded: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        label: "Đã hoàn tiền",
      },
    };

    const config = statusConfig[status];

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.homestayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    totalRevenue: bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + b.hostRevenue, 0),
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
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md">
            <Download className="h-5 w-5" />
            Xuất báo cáo
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-gray-600 font-medium">Tổng</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm text-gray-600 font-medium">Xác nhận</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {stats.confirmed}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-gray-600 font-medium">Chờ duyệt</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-gray-600 font-medium">Hoàn thành</p>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {stats.completed}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-gray-600 font-medium">Đã hủy</p>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-5 w-5 text-white" />
              <p className="text-sm text-blue-100 font-medium">Doanh thu</p>
            </div>
            <p className="text-lg font-bold text-white">
              {formatCurrency(stats.totalRevenue)}
            </p>
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Tất cả thời gian</option>
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
              </select>

              <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-3">
          {paginatedBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              {/* Compact Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={booking.guestAvatar}
                      alt={booking.guestName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {booking.guestName}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono text-gray-600">
                          {booking.bookingCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(booking.status)}
                    {getPaymentBadge(booking.paymentStatus)}
                  </div>
                </div>
              </div>

              {/* Compact Content */}
              <div className="p-4">
                {/* Homestay Name */}
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-900">
                    {booking.homestayName}
                  </span>
                </div>

                {/* Info Grid - 2 columns */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* Dates */}
                  <div className="bg-blue-50 p-2.5 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-xs text-blue-700 font-semibold">
                        Lưu trú
                      </span>
                    </div>
                    <p className="text-xs text-gray-900 font-medium">
                      {formatDate(booking.checkIn)} →{" "}
                      {formatDate(booking.checkOut)}
                    </p>
                    <p className="text-xs text-blue-700 font-bold mt-0.5">
                      {booking.nights} đêm
                    </p>
                  </div>

                  {/* Revenue */}
                  <div className="bg-amber-50 p-2.5 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="h-3.5 w-3.5 text-amber-600" />
                      <span className="text-xs text-amber-700 font-semibold">
                        Doanh thu
                      </span>
                    </div>
                    <p className="text-sm text-green-600 font-bold">
                      {formatCurrency(booking.hostRevenue)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Tổng: {formatCurrency(booking.totalAmount)}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-3 pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{booking.guestPhone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{booking.guestEmail}</span>
                  </div>
                </div>

                {/* Cancellation Reason */}
                {booking.cancellationReason && (
                  <div className="mb-3 p-2 bg-red-50 rounded border-l-2 border-red-400">
                    <p className="text-xs text-red-700 font-semibold mb-0.5">
                      Lý do hủy:
                    </p>
                    <p className="text-xs text-red-900">
                      {booking.cancellationReason}
                    </p>
                  </div>
                )}

                {/* Compact Actions */}
                {booking.status === "pending" && (
                  <div className="bg-amber-50 p-2 rounded text-center">
                    <p className="text-xs text-amber-900 font-medium">
                      ⏳ Đang chờ xử lý
                    </p>
                  </div>
                )}

                {booking.status === "confirmed" &&
                  booking.paymentStatus === "paid" && (
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Nhắn tin
                      </button>
                      <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Hoàn thành
                      </button>
                      <button className="px-3 py-2 bg-white border border-red-300 text-red-600 rounded text-xs font-semibold hover:bg-red-50 transition-colors">
                        <XCircle className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                {booking.status === "confirmed" &&
                  booking.paymentStatus !== "paid" && (
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Nhắn tin
                      </button>
                      <button className="px-3 py-2 bg-white border border-red-300 text-red-600 rounded text-xs font-semibold hover:bg-red-50 transition-colors flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" />
                        Hủy
                      </button>
                    </div>
                  )}

                {booking.status === "completed" && (
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <p className="text-xs text-blue-900 font-medium">
                      ✨ Đã hoàn thành
                    </p>
                  </div>
                )}

                {booking.status === "cancelled" && (
                  <div className="bg-gray-100 p-2 rounded text-center">
                    <p className="text-xs text-gray-700 font-medium">Đã hủy</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
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
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setCurrentPage(1);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredBookings.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            itemLabel="booking"
          />
        )}
      </div>
    </HostLayout>
  );
};

export default Bookings;
