import React, { useState } from "react";
import HostLayout from "../../components/host/HostLayout";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  TrendingUp,
  Users,
  Gift,
  Percent,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  BarChart3,
} from "lucide-react";
import mockData from "../../data/hostMockData.json";

const Promotions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const promotions = mockData.promotions;
  const homestays = mockData.homestays;

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
      active: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Đang hoạt động",
        icon: CheckCircle,
      },
      paused: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        label: "Tạm dừng",
        icon: Clock,
      },
      expired: {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Hết hạn",
        icon: XCircle,
      },
      scheduled: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Đã lên lịch",
        icon: Calendar,
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

  const getTypeBadge = (type, value) => {
    if (type === "percentage") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
          <Percent className="h-3 w-3" />
          Giảm {value}%
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">
          <Gift className="h-3 w-3" />
          Giảm {formatCurrency(value)}
        </span>
      );
    }
  };

  const getUsagePercentage = (used, total) => {
    return Math.round((used / total) * 100);
  };

  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch =
      promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || promo.status === statusFilter;
    const matchesType = typeFilter === "all" || promo.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: promotions.length,
    active: promotions.filter((p) => p.status === "active").length,
    totalUsage: promotions.reduce((sum, p) => sum + p.usageCount, 0),
    totalDiscount: promotions.reduce(
      (sum, p) => sum + p.usageCount * (p.type === "fixed" ? p.value : 50000),
      0
    ),
  };

  return (
    <HostLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý khuyến mãi
            </h1>
            <p className="text-gray-600 mt-1">
              Tạo và quản lý mã giảm giá cho homestay của bạn
            </p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-md">
            <Plus className="h-5 w-5" />
            Tạo khuyến mãi mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Gift className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">
              Tổng khuyến mãi
            </p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">
              Đang hoạt động
            </p>
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">
              Lượt sử dụng
            </p>
            <p className="text-3xl font-bold text-purple-600">
              {stats.totalUsage}
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-md p-6">
            <p className="text-amber-100 text-sm font-medium mb-1">
              Tổng giảm giá
            </p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(stats.totalDiscount)}
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
                placeholder="Tìm kiếm theo tên hoặc mã khuyến mãi..."
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
                <option value="paused">Tạm dừng</option>
                <option value="expired">Hết hạn</option>
                <option value="scheduled">Đã lên lịch</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Tất cả loại</option>
                <option value="percentage">Phần trăm</option>
                <option value="fixed">Cố định</option>
              </select>
            </div>
          </div>
        </div>

        {/* Promotions List */}
        <div className="space-y-4">
          {filteredPromotions.map((promo) => {
            const usagePercent = getUsagePercentage(
              promo.usageCount,
              promo.usageLimit
            );
            const applicableHomestayNames = homestays
              .filter((h) => promo.applicableHomestays.includes(h.id))
              .map((h) => h.name);

            return (
              <div
                key={promo.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {promo.name}
                        </h3>
                        {getStatusBadge(promo.status)}
                        {getTypeBadge(promo.type, promo.value)}
                      </div>
                      <p className="text-gray-600 mb-3">{promo.description}</p>
                      <div className="flex items-center gap-2">
                        <code className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-bold text-lg tracking-wider">
                          {promo.code}
                        </code>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <Copy className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        Giá trị tối thiểu
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(promo.minBookingAmount)}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Giảm tối đa</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(promo.maxDiscount)}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Thời gian</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(promo.startDate)}
                      </p>
                      <p className="text-xs text-gray-500">
                        đến {formatDate(promo.endDate)}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">
                        Số lượt sử dụng
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {promo.usageCount} / {promo.usageLimit}
                      </p>
                      <p className="text-xs text-gray-500">{usagePercent}%</p>
                    </div>
                  </div>

                  {/* Usage Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        Tiến độ sử dụng
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {promo.usageCount} / {promo.usageLimit}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          usagePercent >= 80
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : usagePercent >= 50
                            ? "bg-gradient-to-r from-amber-500 to-amber-600"
                            : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}
                        style={{ width: `${usagePercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Applicable Homestays */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Áp dụng cho homestay:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {applicableHomestayNames.map((name, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {promo.status === "active" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      <button className="flex-1 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-medium">
                        Tạm dừng
                      </button>
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Xem thống kê
                      </button>
                    </div>
                  )}

                  {promo.status === "paused" && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                        Kích hoạt lại
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPromotions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy khuyến mãi
              </h3>
              <p className="text-gray-600 mb-6">
                Thử điều chỉnh bộ lọc hoặc tạo khuyến mãi mới
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTypeFilter("all");
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredPromotions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Hiển thị {filteredPromotions.length} trên tổng số{" "}
                {promotions.length} khuyến mãi
              </p>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Trước
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </HostLayout>
  );
};

export default Promotions;
