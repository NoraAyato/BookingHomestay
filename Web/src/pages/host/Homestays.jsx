import React, { useState } from "react";
import HostLayout from "../../components/host/HostLayout";
import Pagination from "../../components/host/Pagination";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  MoreVertical,
  MapPin,
  Star,
  Calendar,
  Users,
  Bed,
  Bath,
  Wifi,
  Coffee,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  DoorOpen,
  Trash2,
  Utensils,
} from "lucide-react";
import mockData from "../../data/hostMockData.json";

const Homestays = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const homestays = mockData.homestays;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Đang hoạt động",
        icon: CheckCircle,
      },
      inactive: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "Tạm dừng",
        icon: XCircle,
      },
      pending: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Chờ duyệt",
        icon: AlertCircle,
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

  const filteredHomestays = homestays.filter((homestay) => {
    const matchesSearch =
      homestay.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      homestay.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || homestay.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalItems = filteredHomestays.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedHomestays = filteredHomestays.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stats = {
    total: homestays.length,
    active: homestays.filter((h) => h.status === "active").length,
    inactive: homestays.filter((h) => h.status === "inactive").length,
    totalRevenue: homestays.reduce((sum, h) => sum + h.revenue, 0),
  };

  return (
    <HostLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Homestay của tôi
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả homestay của bạn
            </p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md">
            <Plus className="h-5 w-5" />
            Thêm Homestay Mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Tổng homestay
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Đang hoạt động
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Tạm dừng
                </p>
                <p className="text-3xl font-bold text-gray-600">
                  {stats.inactive}
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <XCircle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Tổng doanh thu
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm homestay theo tên hoặc địa điểm..."
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
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="pending">Chờ duyệt</option>
              </select>

              <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Filter className="h-5 w-5" />
                <span className="hidden sm:inline">Bộ lọc</span>
              </button>
            </div>
          </div>
        </div>

        {/* Homestays Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedHomestays.map((homestay) => (
            <div
              key={homestay.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={homestay.images[0]}
                  alt={homestay.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(homestay.status)}
                </div>
                <div className="absolute top-2 left-2">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-semibold text-gray-900">
                      {homestay.rating}
                    </span>
                    <span className="text-xs text-gray-600">
                      ({homestay.reviews})
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <div className="mb-2">
                  <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1">
                    {homestay.name}
                  </h3>
                  <div className="flex items-center text-xs text-gray-600">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="line-clamp-1">{homestay.location}</span>
                  </div>
                </div>

                {/* Room Info */}
                <div className="mb-3">
                  <div className="flex items-center justify-between p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded border border-purple-100">
                    <div className="flex items-center gap-1.5">
                      <DoorOpen className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-purple-600 font-semibold">
                          Tổng phòng
                        </p>
                        <p className="text-base font-bold text-gray-900">
                          {homestay.totalRooms}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Phòng trống</p>
                      <p className="text-base font-bold text-green-600">
                        {homestay.availableRooms}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Đặt phòng</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {homestay.totalBookings}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Doanh thu</p>
                    <p className="text-xs font-semibold text-green-600">
                      {formatCurrency(homestay.revenue)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button className="px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center justify-center gap-1 text-xs shadow-sm">
                      <DoorOpen className="h-3.5 w-3.5" />
                      Phòng ({homestay.totalRooms})
                    </button>
                    <button className="px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded hover:from-green-700 hover:to-green-800 transition-all font-semibold flex items-center justify-center gap-1 text-xs shadow-sm">
                      <Utensils className="h-3.5 w-3.5" />
                      Dịch vụ
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button className="px-2 py-1.5 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors flex items-center justify-center gap-1 text-xs font-medium">
                      <Eye className="h-3.5 w-3.5" />
                      Xem
                    </button>
                    <button className="px-2 py-1.5 bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors flex items-center justify-center gap-1 text-xs font-medium">
                      <Edit className="h-3.5 w-3.5" />
                      Sửa
                    </button>
                    <button className="px-2 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-xs font-medium">
                      <Trash2 className="h-3.5 w-3.5" />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredHomestays.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy homestay
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
        {filteredHomestays.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            itemLabel="homestay"
          />
        )}
      </div>
    </HostLayout>
  );
};

export default Homestays;
