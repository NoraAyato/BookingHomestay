import React, { useState } from "react";
import { Search, Plus, LayoutGrid, Filter } from "lucide-react";
import AdminLayout from "../../../components/admin/common/AdminLayout";
import RoomTypesList from "../../../components/admin/roomtypes/RoomTypesList";
import RoomTypeFormModal from "../../../components/admin/roomtypes/RoomTypeFormModal";
import Pagination from "../../../components/admin/common/Pagination";
import DeleteConfirmModal from "../../../components/admin/common/DeleteConfirmModal";
import { useRoomTypeManager } from "../../../hooks/admin/useRoomTypeManager";

const RoomTypesManager = () => {
  const {
    roomTypes,
    page,
    limit,
    total,
    loading,
    error,
    search,
    setPage,
    setSearch,
    createRoomType,
    updateRoomType,
    deleteRoomType,
  } = useRoomTypeManager();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleAddRoomType = async () => {
    if (!formData.name.trim()) return;

    const success = await createRoomType(formData);
    if (success) {
      setShowAddModal(false);
      setFormData({ name: "", description: "" });
    }
  };

  const handleEditRoomType = async () => {
    if (!formData.name.trim()) return;

    const success = await updateRoomType(selectedRoomType.id, formData);
    if (success) {
      setShowEditModal(false);
      setSelectedRoomType(null);
      setFormData({ name: "", description: "" });
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteRoomType = async () => {
    if (!deleteId) return;

    await deleteRoomType(deleteId);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const openEditModal = (roomType) => {
    setSelectedRoomType(roomType);
    setFormData({
      name: roomType.name,
      description: roomType.description,
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedRoomType(null);
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
              <LayoutGrid className="h-7 w-7 text-blue-600" />
              Quản lý Loại phòng
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các loại phòng cho homestay
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Thêm loại phòng
          </button>
        </div>
      </div>

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
              Hiển thị {roomTypes.length} / {total} loại phòng
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
      ) : roomTypes.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <RoomTypesList
                roomTypes={roomTypes}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            </div>
          </div>

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
          <div className="text-gray-500">Không có loại phòng nào</div>
        </div>
      )}

      <RoomTypeFormModal
        isOpen={showAddModal}
        title="Thêm loại phòng mới"
        formData={formData}
        originalData={null}
        onChange={setFormData}
        onSubmit={handleAddRoomType}
        onClose={closeModals}
      />

      <RoomTypeFormModal
        isOpen={showEditModal}
        title="Chỉnh sửa loại phòng"
        formData={formData}
        originalData={selectedRoomType}
        onChange={setFormData}
        onSubmit={handleEditRoomType}
        onClose={closeModals}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteRoomType}
        title="Xóa loại phòng"
        message="Bạn có chắc chắn muốn xóa loại phòng này? Hành động này không thể hoàn tác."
        itemName={roomTypes.find((rt) => rt.id === deleteId)?.name}
      />
    </AdminLayout>
  );
};

export default RoomTypesManager;
