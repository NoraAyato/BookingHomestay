import React, { useState } from "react";
import { Search, Plus, Filter, Sparkles } from "lucide-react";
import AdminLayout from "../../../components/admin/common/AdminLayout";
import AmenitiesList from "../../../components/admin/amenities/AmenitiesList";
import AmenityFormModal from "../../../components/admin/amenities/AmenityFormModal";
import Pagination from "../../../components/admin/common/Pagination";
import DeleteConfirmModal from "../../../components/admin/common/DeleteConfirmModal";
import { useAmenitiesManager } from "../../../hooks/admin/useAmenitiesAdmin";

const AmenitiesManager = () => {
  const {
    amenities,
    page,
    limit,
    total,
    loading,
    error,
    search,
    setPage,
    setSearch,
    createAmenity,
    updateAmenity,
    deleteAmenity,
  } = useAmenitiesManager();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleAddAmenity = async () => {
    if (!formData.name.trim()) return;

    const success = await createAmenity(formData);
    if (success) {
      setShowAddModal(false);
      setFormData({ name: "", description: "" });
    }
  };

  const handleEditAmenity = async () => {
    if (!formData.name.trim()) return;

    const success = await updateAmenity(selectedAmenity.id, formData);
    if (success) {
      setShowEditModal(false);
      setSelectedAmenity(null);
      setFormData({ name: "", description: "" });
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteAmenity = async () => {
    if (!deleteId) return;

    await deleteAmenity(deleteId);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const openEditModal = (amenity) => {
    setSelectedAmenity(amenity);
    setFormData({
      name: amenity.name,
      description: amenity.description,
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedAmenity(null);
    setFormData({ name: "", description: "" });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-blue-600" />
              Quản lý Tiện nghi
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các tiện nghi cho homestay
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Thêm tiện nghi
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mô tả..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>
              Hiển thị {amenities.length} / {total} tiện nghi
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-red-500">{error}</div>
        </div>
      ) : amenities.length > 0 ? (
        <>
          <AmenitiesList
            amenities={amenities}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />

          <div className="mt-6">
            <Pagination
              page={page}
              pageSize={limit}
              total={total}
              onPageChange={setPage}
            />
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-500">Không có tiện nghi nào</div>
        </div>
      )}

      <AmenityFormModal
        isOpen={showAddModal}
        title="Thêm tiện nghi mới"
        formData={formData}
        originalData={null}
        onChange={setFormData}
        onSubmit={handleAddAmenity}
        onClose={closeModals}
      />

      <AmenityFormModal
        isOpen={showEditModal}
        title="Chỉnh sửa tiện nghi"
        formData={formData}
        originalData={selectedAmenity}
        onChange={setFormData}
        onSubmit={handleEditAmenity}
        onClose={closeModals}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAmenity}
        title="Xóa tiện nghi"
        message="Bạn có chắc chắn muốn xóa tiện nghi này?"
        itemName={amenities.find((a) => a.id === deleteId)?.name}
      />
    </AdminLayout>
  );
};

export default AmenitiesManager;
