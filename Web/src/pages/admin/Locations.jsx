import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import LocationsList from "../../components/admin/locations/LocationsList";
import LocationDetailModal from "../../components/admin/locations/LocationDetailModal";
import LocationUpdateModal from "../../components/admin/locations/LocationUpdateModal";
import LocationAddModal from "../../components/admin/locations/LocationAddModal";
import { Search, Plus, MapPin, Users, TrendingUp } from "lucide-react";
import { useLocationManager } from "../../hooks/admin/useLocationManager";
import { getImageUrl } from "../../utils/imageUrl";
import { showToast } from "../../components/common/Toast";

const Locations = () => {
  const {
    locations: apiLocations,
    page,
    limit,
    total,
    loading,
    error,
    search,
    setPage,
    setLimit,
    setSearch,
    refresh,
    updateLocation,
    createLocation,
  } = useLocationManager();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const pageSize = 6; // 3 cột x 2 hàng

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, setSearch]);

  // Transform API data to match component expectations
  const locations = apiLocations.map((location, index) => ({
    id: location.id,
    name: location.name,
    province: location.name,
    description: location.description || "",
    homestaysCount: location.homestaysCount || 0,
    totalBookings: location.bookingsCount || 0,
    image: getImageUrl(location.image),
    status: location.status,
  }));

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleView = (location) => {
    setSelectedLocation(location);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (location) => {
    setSelectedLocation(location);
    setIsUpdateModalOpen(true);
  };

  const handleUpdate = async (locationId, data) => {
    try {
      await updateLocation(locationId, data);
      showToast("success", "Cập nhật khu vực thành công!");
      setIsUpdateModalOpen(false);
      setSelectedLocation(null);
    } catch (error) {
      showToast("error", error.message || "Cập nhật khu vực thất bại!");
      throw error;
    }
  };

  const handleAdd = async (data) => {
    try {
      await createLocation(data);
      showToast("success", "Thêm khu vực mới thành công!");
      setIsAddModalOpen(false);
    } catch (error) {
      showToast("error", error.message || "Thêm khu vực thất bại!");
      throw error;
    }
  };

  const handleDelete = (location) => {
    console.log("Delete location:", location);
    // TODO: Implement delete logic
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý khu vực
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các điểm đến và khu vực homestay
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm khu vực mới</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Tổng khu vực</div>
                <div className="text-xl font-semibold text-gray-900">
                  {total}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Tổng homestay</div>
                <div className="text-xl font-semibold text-emerald-600">
                  {locations.reduce((sum, loc) => sum + loc.homestaysCount, 0)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Tổng đặt chỗ</div>
                <div className="text-xl font-semibold text-amber-600">
                  {locations.reduce((sum, loc) => sum + loc.totalBookings, 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm khu vực..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Locations List with Pagination */}
        <LocationsList
          locations={locations}
          loading={loading}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Modals */}
        <LocationDetailModal
          location={selectedLocation}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedLocation(null);
          }}
        />

        <LocationUpdateModal
          location={selectedLocation}
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedLocation(null);
          }}
          onUpdate={handleUpdate}
        />

        <LocationAddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAdd}
        />
      </div>
    </AdminLayout>
  );
};

export default Locations;
