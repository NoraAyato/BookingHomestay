import React, { useState, useEffect } from "react";
import HostLayout from "../../components/host/common/HostLayout";
import Pagination from "../../components/host/common/Pagination";
import ReviewsList from "../../components/host/reviews/ReviewsList";
import ReviewDetailModal from "../../components/host/reviews/ReviewDetailModal";
import DateRangePicker from "../../components/common/DateRangePicker";
import { useHostReviews } from "../../hooks/host/useHostReviews";
import { useHostHomestays } from "../../hooks/host/useHostHomestays";
import {
  Search,
  Star,
  MessageSquare,
  TrendingUp,
  Calendar,
  ChevronDown,
  X,
} from "lucide-react";

const Reviews = () => {
  const pageSize = 5;
  const {
    reviews,
    stats,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    changePage,
  } = useHostReviews(1, pageSize);

  const { homestaysSelectList, selectListLoading } = useHostHomestays();

  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Local filters
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Homestay filter states (similar to Rooms page)
  const [homestayFilter, setHomestayFilter] = useState("all");
  const [homestaySearchTerm, setHomestaySearchTerm] = useState("");
  const [showHomestayDropdown, setShowHomestayDropdown] = useState(false);

  // Update filters when local state changes (skip initial mount)
  useEffect(() => {
    // Skip on initial mount to avoid double fetch
    if (isInitialMount) {
      setIsInitialMount(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setFilters({
        search: searchTerm || null,
        rating: ratingFilter !== "all" ? parseInt(ratingFilter) : null,
        startDate: startDate || null,
        endDate: endDate || null,
        homestayId: homestayFilter !== "all" ? homestayFilter : null,
      });
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [
    searchTerm,
    ratingFilter,
    startDate,
    endDate,
    homestayFilter,
    setFilters,
  ]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleViewDetail = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const handlePageChange = (page) => {
    changePage(page);
  };

  // Filter homestays based on search term
  const filteredHomestays = homestaysSelectList.filter((homestay) =>
    homestay.homestayName
      ?.toLowerCase()
      .includes(homestaySearchTerm.toLowerCase())
  );

  // Get selected homestay name for display
  const selectedHomestayName =
    homestayFilter === "all"
      ? "Tất cả homestay"
      : homestaysSelectList.find((hs) => hs.id === homestayFilter)
          ?.homestayName || "Tất cả homestay";

  // Handle homestay selection
  const handleHomestaySelect = (id) => {
    setHomestayFilter(id);
    setHomestaySearchTerm("");
    setShowHomestayDropdown(false);
  };

  // Clear date range
  const handleClearDateRange = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <HostLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý đánh giá
            </h1>
            <p className="text-gray-600 mt-1">
              Theo dõi và xem đánh giá của khách hàng về homestay của bạn
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Tổng đánh giá</div>
                <div className="text-xl font-semibold text-gray-900">
                  {stats?.totalReviews || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <Star className="w-5 h-5 text-red-600 fill-current" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Đánh giá tiêu cực</div>
                <div className="text-xl font-semibold text-red-600">
                  {stats?.negativeRate || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Đánh giá tích cực</div>
                <div className="text-xl font-semibold text-green-600">
                  {stats?.positiveRate || 0}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Đánh giá 30 ngày</div>
                <div className="text-xl font-semibold text-purple-600">
                  {stats?.recentReviews || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="space-y-3">
            {/* Row 1: Search */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên khách, homestay hoặc nội dung..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Row 2: Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Homestay Filter - Searchable Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowHomestayDropdown(!showHomestayDropdown)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex items-center justify-between"
                  disabled={selectListLoading}
                >
                  <span className="truncate">
                    {selectListLoading ? "Đang tải..." : selectedHomestayName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </button>

                {showHomestayDropdown && (
                  <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                    {/* Search in dropdown */}
                    {homestaysSelectList.length > 3 && (
                      <div className="p-2 border-b">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Tìm homestay..."
                            value={homestaySearchTerm}
                            onChange={(e) =>
                              setHomestaySearchTerm(e.target.value)
                            }
                            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {homestaySearchTerm && (
                            <button
                              onClick={() => setHomestaySearchTerm("")}
                              className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Options */}
                    <div className="overflow-y-auto max-h-60">
                      <button
                        onClick={() => handleHomestaySelect("all")}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                          homestayFilter === "all"
                            ? "bg-blue-50 text-blue-600"
                            : ""
                        }`}
                      >
                        Tất cả homestay
                      </button>
                      {filteredHomestays.map((homestay) => (
                        <button
                          key={homestay.id}
                          onClick={() => handleHomestaySelect(homestay.id)}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                            homestayFilter === homestay.id
                              ? "bg-blue-50 text-blue-600"
                              : ""
                          }`}
                        >
                          {homestay.homestayName}
                        </button>
                      ))}
                      {filteredHomestays.length === 0 && (
                        <div className="px-4 py-2 text-gray-500 text-sm">
                          Không tìm thấy homestay
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tất cả đánh giá</option>
                  <option value="5">5 Sao</option>
                  <option value="4">4 Sao</option>
                  <option value="3">3 Sao</option>
                  <option value="2">2 Sao</option>
                  <option value="1">1 Sao</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  onClear={handleClearDateRange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Đang tải đánh giá...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Lỗi tải dữ liệu
            </h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
          </div>
        ) : (
          <>
            <ReviewsList
              reviews={reviews}
              formatDate={formatDate}
              onViewDetail={handleViewDetail}
            />

            {/* Empty State */}
            {reviews.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Không có đánh giá nào
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Chưa có đánh giá nào phù hợp với bộ lọc của bạn.
                </p>
              </div>
            )}

            {/* Pagination */}
            {reviews.length > 0 && (
              <Pagination
                page={pagination.page}
                pageSize={pagination.limit}
                total={pagination.total}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* Review Detail Modal */}
        <ReviewDetailModal
          review={selectedReview}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          formatDate={formatDate}
        />
      </div>
    </HostLayout>
  );
};

export default Reviews;
