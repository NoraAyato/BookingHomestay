import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import Pagination from "../../components/admin/common/Pagination";
import NewsCategoriesList from "../../components/admin/news/NewsCategoriesList";
import DeleteConfirmModal from "../../components/admin/common/DeleteConfirmModal";
import TopicFormModal from "../../components/admin/news/TopicFormModal";
import { useAdminTopics } from "../../hooks/admin/useTopicManager";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash2,
  FileText,
  Tag,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

const NewsCategories = () => {
  const navigate = useNavigate();
  const pageSize = 5;
  const {
    topics,
    stats,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    changePage,
    createTopic: handleCreateTopicAPI,
    updateTopic: handleUpdateTopicAPI,
    deleteTopic: handleDeleteTopicAPI,
  } = useAdminTopics(1, pageSize);

  const handleBackToNews = () => {
    navigate("/admin/news");
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [topicToEdit, setTopicToEdit] = useState(null);

  // Local search term for debouncing
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
      });
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, setFilters]);

  const handleViewCategory = (topic) => {
    console.log("View topic:", topic);
  };

  const handleEditCategory = (topic) => {
    setTopicToEdit(topic);
    setIsFormModalOpen(true);
  };

  const handleCreateClick = () => {
    setTopicToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (topicToEdit) {
      // Update mode
      const result = await handleUpdateTopicAPI(topicToEdit.id, data);
      if (result.success) {
        setIsFormModalOpen(false);
        setTopicToEdit(null);
      }
    } else {
      // Create mode
      const result = await handleCreateTopicAPI(data);
      if (result.success) {
        setIsFormModalOpen(false);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormModalOpen(false);
    setTopicToEdit(null);
  };

  const handleDeleteClick = (topic) => {
    setTopicToDelete(topic);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!topicToDelete) return;

    const topicId = topicToDelete.id;

    if (!topicId) {
      alert("Không thể xóa chủ đề: ID không hợp lệ");
      return;
    }

    setIsDeleting(true);
    const result = await handleDeleteTopicAPI(topicId);
    setIsDeleting(false);

    if (result.success) {
      setIsDeleteModalOpen(false);
      setTopicToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setTopicToDelete(null);
  };

  // Use stats from API or fallback
  const statsData = stats || {
    totalTopics: 0,
    activeTopics: 0,
    inactiveTopics: 0,
    totalArticles: 0,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBackToNews}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span className="text-sm">Quay lại</span>
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              Quản lý danh mục tin tức
            </h1>
            <p className="text-gray-600 mt-1">
              Tạo và quản lý các danh mục cho bài viết tin tức
            </p>
          </div>
          <button
            onClick={handleCreateClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm danh mục</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Tag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Tổng danh mục</div>
                <div className="text-xl font-semibold text-gray-900">
                  {statsData.totalTopics}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Đang hoạt động</div>
                <div className="text-xl font-semibold text-green-600">
                  {statsData.activeTopics}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Tạm ẩn</div>
                <div className="text-xl font-semibold text-red-600">
                  {statsData.inactiveTopics}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Tổng bài viết</div>
                <div className="text-xl font-semibold text-purple-600">
                  {statsData.totalArticles}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm danh mục..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Tạm ẩn</option>
            </select>
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

        {/* Categories List */}
        {!loading && !error && (
          <>
            <NewsCategoriesList
              categories={topics}
              onView={handleViewCategory}
              onEdit={handleEditCategory}
              onDelete={handleDeleteClick}
            />

            {/* Empty State */}
            {topics.length === 0 && (
              <div className="text-center py-12">
                <Tag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Không có chủ đề nào
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Chưa có chủ đề nào phù hợp với bộ lọc của bạn.
                </p>
              </div>
            )}

            {/* Pagination */}
            {topics.length > 0 && (
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
          title="Xóa chủ đề"
          message="Bạn có chắc chắn muốn xóa chủ đề này? Hành động này không thể hoàn tác."
          itemName={topicToDelete ? `Chủ đề: ${topicToDelete.name}` : ""}
          loading={isDeleting}
        />

        {/* Create/Update Form Modal */}
        <TopicFormModal
          isOpen={isFormModalOpen}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          topic={topicToEdit}
        />
      </div>
    </AdminLayout>
  );
};

export default NewsCategories;
