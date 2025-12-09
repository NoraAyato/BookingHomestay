import React, { useState } from "react";
import { Search, Plus, Briefcase, Filter } from "lucide-react";
import AdminLayout from "../../../components/admin/common/AdminLayout";
import ServicesList from "../../../components/admin/services/ServicesList";
import ServiceFormModal from "../../../components/admin/services/ServiceFormModal";
import Pagination from "../../../components/admin/common/Pagination";
import DeleteConfirmModal from "../../../components/admin/common/DeleteConfirmModal";
import { useServiceManager } from "../../../hooks/admin/useServiceManager";

const ServicesManager = () => {
  const {
    services,
    page,
    limit,
    total,
    loading,
    error,
    search,
    setPage,
    setSearch,
    createService,
    updateService,
    deleteService,
  } = useServiceManager();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleAddService = async () => {
    if (!formData.name.trim()) return;

    const success = await createService(formData);
    if (success) {
      setShowAddModal(false);
      setFormData({ name: "" });
    }
  };

  const handleEditService = async () => {
    if (!formData.name.trim()) return;

    const success = await updateService(selectedService.id, formData);
    if (success) {
      setShowEditModal(false);
      setSelectedService(null);
      setFormData({ name: "" });
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteService = async () => {
    if (!deleteId) return;

    await deleteService(deleteId);
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setFormData({ name: service.name });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedService(null);
    setFormData({ name: "" });
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
              <Briefcase className="h-7 w-7 text-blue-600" />
              Quản lý Dịch vụ
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các dịch vụ cho homestay
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Thêm dịch vụ
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên dịch vụ..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span>
              Hiển thị {services.length} / {total} dịch vụ
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
      ) : services.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <ServicesList
                services={services}
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
          <div className="text-gray-500">Không có dịch vụ nào</div>
        </div>
      )}

      <ServiceFormModal
        isOpen={showAddModal}
        title="Thêm dịch vụ mới"
        formData={formData}
        originalData={null}
        onChange={setFormData}
        onSubmit={handleAddService}
        onClose={closeModals}
      />

      <ServiceFormModal
        isOpen={showEditModal}
        title="Chỉnh sửa dịch vụ"
        formData={formData}
        originalData={selectedService}
        onChange={setFormData}
        onSubmit={handleEditService}
        onClose={closeModals}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteService}
        title="Xóa dịch vụ"
        message="Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể hoàn tác."
        itemName={services.find((s) => s.id === deleteId)?.name}
      />
    </AdminLayout>
  );
};

export default ServicesManager;
