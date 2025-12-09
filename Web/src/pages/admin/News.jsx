import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import Pagination from "../../components/admin/common/Pagination";
import NewsList from "../../components/admin/news/NewsList";
import DeleteConfirmModal from "../../components/admin/common/DeleteConfirmModal";
import NewsFormModal from "../../components/admin/news/NewsFormModal";
import NewsDetailModal from "../../components/admin/news/NewsDetailModal";
import DateRangePicker from "../../components/common/DateRangePicker";
import { useAdminNews } from "../../hooks/admin/useNewsManager";
import { useNews } from "../../hooks/useNews";
import { formatDateDisplay } from "../../utils/date";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash2,
  FileText,
  Calendar,
  User,
  TrendingUp,
  Clock,
  Image as ImageIcon,
  Tag,
  Star,
  FolderOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const News = () => {
  const navigate = useNavigate();
  const pageSize = 5;

  // Hook quản lý news từ API
  const {
    news,
    stats,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    changePage,
    createNews: handleCreateNewsAPI,
    updateNews: handleUpdateNewsAPI,
    deleteNews: handleDeleteNewsAPI,
  } = useAdminNews(1, pageSize);

  // Hook để lấy categories từ useNews
  const { categories: categoriesData } = useNews();

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form modal state (create/edit)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" or "edit"
  const [newsToEdit, setNewsToEdit] = useState(null);

  // Detail modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newsToView, setNewsToView] = useState(null);

  // Local state cho debouncing
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
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
        status: statusFilter !== "all" ? statusFilter : null,
        category: categoryFilter !== "all" ? categoryFilter : null,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, categoryFilter, dateRange, setFilters]);

  // Delete handlers
  const handleDeleteClick = (newsItem) => {
    setNewsToDelete(newsItem);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!newsToDelete) return;

    const newsId = newsToDelete.id;

    if (!newsId) {
      alert("Không thể xóa tin tức: ID không hợp lệ");
      return;
    }

    setIsDeleting(true);
    const result = await handleDeleteNewsAPI(newsId);
    setIsDeleting(false);

    if (result.success) {
      setIsDeleteModalOpen(false);
      setNewsToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setNewsToDelete(null);
  };

  // Create handlers
  const handleCreateClick = () => {
    setFormMode("create");
    setNewsToEdit(null);
    setIsFormModalOpen(true);
  };

  // Edit handlers
  const handleEditClick = (newsItem) => {
    setFormMode("edit");
    setNewsToEdit(newsItem);
    setIsFormModalOpen(true);
  };

  // Form submit handler (create or edit)
  const handleFormSubmit = async (data) => {
    let result;
    if (formMode === "edit" && newsToEdit) {
      result = await handleUpdateNewsAPI(newsToEdit.id, data);
    } else {
      result = await handleCreateNewsAPI(data);
    }

    if (result.success) {
      setIsFormModalOpen(false);
      setNewsToEdit(null);
    }
  };

  const handleFormClose = () => {
    setIsFormModalOpen(false);
    setNewsToEdit(null);
  };

  // View/Detail handlers
  const handleViewClick = (newsItem) => {
    setNewsToView(newsItem);
    setIsDetailModalOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailModalOpen(false);
    setNewsToView(null);
  };

  // Mock data for fallback (removed - now using API)
  const mockNews = [
    {
      id: 1,
      title:
        "Xu hướng du lịch homestay năm 2024: Trải nghiệm địa phương là chìa khóa",
      slug: "xu-huong-du-lich-homestay-2024",
      excerpt:
        "Khách du lịch ngày càng ưa chuộng những trải nghiệm gần gũi với địa phương, văn hóa bản địa thông qua các homestay.",
      content: "Nội dung chi tiết về xu hướng du lịch homestay...",
      category: "trend",
      status: "published",
      featured: true,
      author: "Nguyễn Văn Admin",
      publishDate: "2024-12-15",

      likes: 89,
      comments: 23,
      featuredImage:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop",
      createdAt: "2024-12-10",
      updatedAt: "2024-12-15",
    },
    {
      id: 2,
      title: "Hướng dẫn host quản lý homestay hiệu quả trong mùa cao điểm",
      slug: "huong-dan-host-quan-ly-homestay-hieu-qua",
      excerpt:
        "Những mẹo và chiến lược giúp các host quản lý homestay một cách chuyên nghiệp và tăng doanh thu.",
      content: "Nội dung chi tiết về cách quản lý homestay...",
      category: "guide",
      status: "draft",
      featured: false,
      author: "Trần Thị Admin",
      publishDate: null,
      views: 0,
      likes: 0,
      comments: 0,
      featuredImage:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=500&fit=crop",
      createdAt: "2024-12-14",
      updatedAt: "2024-12-14",
    },
    {
      id: 3,
      title: "Chính sách mới về đánh giá và xếp hạng homestay",
      slug: "chinh-sach-moi-danh-gia-xep-hang-homestay",
      excerpt:
        "Cập nhật về hệ thống đánh giá mới nhằm nâng cao chất lượng dịch vụ homestay trên nền tảng.",
      content: "Nội dung chi tiết về chính sách mới...",
      category: "policy",
      status: "published",
      featured: true,
      author: "Lê Văn Admin",
      publishDate: "2024-12-12",
      views: 890,
      likes: 67,
      comments: 15,
      featuredImage:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop",
      createdAt: "2024-12-11",
      updatedAt: "2024-12-12",
    },
    {
      id: 4,
      title: "Top 10 homestay được yêu thích nhất tháng 12",
      slug: "top-10-homestay-yeu-thich-nhat-thang-12",
      excerpt:
        "Danh sách những homestay có đánh giá cao nhất và được khách hàng yêu thích trong tháng 12.",
      content: "Nội dung chi tiết về top 10 homestay...",
      category: "ranking",
      status: "draft",
      featured: false,
      author: "Phạm Thị Admin",
      publishDate: null,
      views: 0,
      likes: 0,
      comments: 0,
      featuredImage:
        "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&h=500&fit=crop",
      createdAt: "2024-12-13",
      updatedAt: "2024-12-13",
    },
    {
      id: 5,
      title: "Khuyến mãi đặc biệt dịp Tết Nguyên Đán 2025",
      slug: "khuyen-mai-dac-biet-tet-nguyen-dan-2025",
      excerpt:
        "Thông tin về các chương trình khuyến mãi hấp dẫn dành cho khách hàng trong dịp Tết 2025.",
      content: "Nội dung chi tiết về khuyến mãi Tết...",
      category: "promotion",
      status: "published",
      featured: true,
      author: "Hoàng Văn Admin",
      publishDate: "2024-12-10",
      views: 2100,
      likes: 156,
      comments: 42,
      featuredImage:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop",
      createdAt: "2024-12-08",
      updatedAt: "2024-12-10",
    },
  ];

  // Map categories từ API thành format cần thiết cho UI
  const categories = categoriesData
    .filter((cat) => cat.id !== "all")
    .map((cat, index) => {
      const colors = [
        "bg-blue-100 text-blue-800",
        "bg-green-100 text-green-800",
        "bg-purple-100 text-purple-800",
        "bg-yellow-100 text-yellow-800",
        "bg-red-100 text-red-800",
        "bg-indigo-100 text-indigo-800",
        "bg-pink-100 text-pink-800",
        "bg-orange-100 text-orange-800",
      ];
      return {
        value: cat.name,
        label: cat.name,
        color: colors[index % colors.length],
      };
    });

  const getStatusBadge = (status) => {
    const statusMap = {
      published: { label: "Đã xuất bản", color: "bg-green-100 text-green-800" },
      draft: { label: "Bản nháp", color: "bg-gray-100 text-gray-800" },
    };
    const statusInfo = statusMap[status];
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  const getCategoryBadge = (categoryValue) => {
    const category = categories.find((c) => c.value === categoryValue);
    return category ? (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${category.color}`}
      >
        {category.label}
      </span>
    ) : null;
  };

  // Use stats from API or fallback
  const statsData = stats || {
    total: 0,
    published: 0,
    draft: 0,
    featured: 0,
  };

  const handleManageCategories = () => {
    navigate("/admin/news-categories");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý tin tức
            </h1>
            <p className="text-gray-600 mt-1">
              Tạo và quản lý các bài viết, tin tức trên hệ thống
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleManageCategories}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors"
            >
              <FolderOpen className="h-4 w-4" />
              <span>Quản lý danh mục</span>
            </button>
            <button
              onClick={handleCreateClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Viết bài mới</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Tổng bài viết</div>
                <div className="text-xl font-semibold text-gray-900">
                  {statsData.total}
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
                <div className="text-sm text-gray-600">Đã xuất bản</div>
                <div className="text-xl font-semibold text-emerald-600">
                  {statsData.published}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Bản nháp</div>
                <div className="text-xl font-semibold text-amber-600">
                  {statsData.draft}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Bài viết nổi bật</div>
                <div className="text-xl font-semibold text-purple-600">
                  {statsData.featured}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search - Left side */}
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-80"
              />
            </div>

            {/* Filters - Right side */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              {/* Date Range Picker */}
              <div className="flex-shrink-0">
                <DateRangePicker
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                  onChange={(range) => setDateRange(range)}
                  placeholder="Chọn khoảng thời gian"
                />
              </div>
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

        {/* News List */}
        {!loading && !error && (
          <>
            <NewsList
              news={news}
              formatDate={formatDateDisplay}
              getStatusBadge={getStatusBadge}
              getCategoryBadge={getCategoryBadge}
              onView={handleViewClick}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />

            {/* Empty State */}
            {news.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Không có bài viết nào
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Chưa có bài viết nào phù hợp với bộ lọc của bạn.
                </p>
              </div>
            )}

            {/* Pagination */}
            {news.length > 0 && (
              <Pagination
                page={pagination.page}
                pageSize={pagination.limit}
                total={pagination.total}
                onPageChange={changePage}
              />
            )}
          </>
        )}

        {/* Delete Confirm Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Xóa tin tức"
          message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
          itemName={newsToDelete ? `Bài viết: ${newsToDelete.title}` : ""}
          loading={isDeleting}
        />

        {/* News Form Modal (Create/Edit) */}
        <NewsFormModal
          isOpen={isFormModalOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          categories={categoriesData}
          initialData={newsToEdit}
          mode={formMode}
        />

        {/* News Detail Modal */}
        <NewsDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleDetailClose}
          news={newsToView}
          formatDate={formatDateDisplay}
          getStatusBadge={getStatusBadge}
          getCategoryBadge={getCategoryBadge}
        />
      </div>
    </AdminLayout>
  );
};

export default News;
