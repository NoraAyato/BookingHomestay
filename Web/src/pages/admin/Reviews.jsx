import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import Pagination from "../../components/admin/common/Pagination";
import ReviewsList from "../../components/admin/reviews/ReviewsList";
import ReviewDetailModal from "../../components/admin/reviews/ReviewDetailModal";
import DeleteConfirmModal from "../../components/admin/common/DeleteConfirmModal";
import DateRangePicker from "../../components/common/DateRangePicker";
import { useAdminReviews } from "../../hooks/admin/useReviewManager";
import {
  Search,
  Star,
  Eye,
  Trash2,
  MessageSquare,
  TrendingUp,
  Calendar,
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
    deleteReview: handleDeleteReviewAPI,
  } = useAdminReviews(1, pageSize);

  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Local search term for debouncing
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isInitialMount, setIsInitialMount] = useState(true);

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
      });
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, ratingFilter, startDate, endDate, setFilters]);

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

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;

    const reviewId = reviewToDelete.id;

    if (!reviewId) {
      alert("Không thể xóa đánh giá: ID không hợp lệ");
      return;
    }

    setIsDeleting(true);
    const result = await handleDeleteReviewAPI(reviewId);
    setIsDeleting(false);

    if (result.success) {
      // Đóng modal sau khi xóa thành công (toast đã được hiển thị trong hook)
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
    }
    // Lỗi đã được xử lý và hiển thị toast trong hook
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  // Use stats from API or fallback
  const statsData = stats || {
    totalReviews: 0,
    negativeRate: 0,
    positiveRate: 0,
    recentReviews: 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý đánh giá
            </h1>
            <p className="text-gray-600 mt-1">
              Theo dõi và quản lý tất cả đánh giá của khách hàng
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
                  {statsData.totalReviews}
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
                  {statsData.negativeRate}%
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
                  {statsData.positiveRate}%
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
                  {statsData.recentReviews}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm đánh giá theo tên khách, homestay hoặc nội dung..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả đánh giá</option>
                <option value="5">5 Sao</option>
                <option value="4">4 Sao</option>
                <option value="3">3 Sao</option>
                <option value="2">2 Sao</option>
                <option value="1">1 Sao</option>
              </select>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onApply={({ startDate: newStartDate, endDate: newEndDate }) => {
                  setStartDate(newStartDate);
                  setEndDate(newEndDate);
                }}
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Reviews List */}
        {!loading && !error && (
          <>
            <ReviewsList
              reviews={reviews}
              formatDate={formatDate}
              onViewDetail={handleViewDetail}
              onDelete={handleDeleteClick}
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
                onPageChange={changePage}
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

        {/* Delete Confirm Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Xóa đánh giá"
          message="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác."
          itemName={
            reviewToDelete
              ? `Đánh giá của ${reviewToDelete.guestName} cho ${reviewToDelete.homestayName}`
              : ""
          }
          loading={isDeleting}
        />
      </div>
    </AdminLayout>
  );
};

export default Reviews;
