import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HostLayout from "../../components/host/common/HostLayout";
import Pagination from "../../components/host/common/Pagination";
import HomestaysList from "../../components/host/homestays/HomestaysList";
import ViewHomestayModal from "../../components/host/homestays/ViewHomestayModal";
import EditHomestayModal from "../../components/host/homestays/EditHomestayModal";
import DeleteHomestayModal from "../../components/host/homestays/DeleteHomestayModal";
import {
  Search,
  TrendingUp,
  CheckCircle,
  XCircle,
  Home as HomeIcon,
} from "lucide-react";
import { useLocationData } from "../../hooks/useLocation";
import { useHostHomestays } from "../../hooks/host/useHostHomestays";
import {
  updateHostHomestay,
  deleteHostHomestay,
} from "../../api/host/homestays";

const Homestays = () => {
  const navigate = useNavigate();

  // Get data from API
  const {
    stats,
    homestays,
    page,
    size,
    total,
    loading,
    setPage,
    setSearch,
    setStatus,
    setLocationId,
    setSortBy,
    refresh,
    updateHomestay,
    deleteHomestay,
  } = useHostHomestays();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("all");

  // Location filter states
  const [locationFilter, setLocationFilter] = useState("all");
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedHomestay, setSelectedHomestay] = useState(null);

  const { allLocations } = useLocationData();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, setSearch]);

  // Update status filter
  useEffect(() => {
    if (statusFilter === "all") {
      setStatus("");
    } else {
      // Capitalize first letter for backend
      const backendStatus =
        statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
      setStatus(backendStatus);
    }
  }, [statusFilter, setStatus]);

  // Update location filter
  useEffect(() => {
    if (locationFilter === "all") {
      setLocationId("");
    } else {
      setLocationId(locationFilter);
    }
  }, [locationFilter, setLocationId]);

  // Update sort filter
  useEffect(() => {
    if (sortFilter === "all") {
      setSortBy("");
    } else {
      setSortBy(sortFilter);
    }
  }, [sortFilter, setSortBy]);

  // Filter locations based on search term
  const filteredLocations = allLocations.filter((location) =>
    location.tenKv.toLowerCase().includes(locationSearchTerm.toLowerCase())
  );

  // Get selected location name for display
  const selectedLocationName =
    locationFilter === "all"
      ? "Tất cả khu vực"
      : allLocations.find((loc) => loc.maKv === locationFilter)?.tenKv ||
        "Tất cả khu vực";

  // Handle location selection
  const handleLocationSelect = (maKv) => {
    setLocationFilter(maKv);
    setLocationSearchTerm("");
    setShowLocationDropdown(false);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Modal handlers
  const handleViewHomestay = (homestay) => {
    setSelectedHomestay(homestay);
    setViewModalOpen(true);
  };

  const handleEditHomestay = (homestay) => {
    setSelectedHomestay(homestay);
    setEditModalOpen(true);
  };

  const handleDeleteHomestay = (homestay) => {
    setSelectedHomestay(homestay);
    setDeleteModalOpen(true);
  };

  const handleSaveHomestay = async (homestayId, formData) => {
    try {
      // Create FormData object for multipart upload
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("address", formData.address);
      data.append("locationId", formData.locationId);
      data.append("status", formData.status);

      // Only append image if a new one was selected
      if (formData.image) {
        data.append("image", formData.image);
      }

      await updateHostHomestay(homestayId, data);

      // Close modal and refresh data
      setEditModalOpen(false);
      setSelectedHomestay(null);

      // Refresh the homestays list
      await refresh();

      alert("Cập nhật homestay thành công!");
    } catch (error) {
      console.error("Error updating homestay:", error);
      alert("Có lỗi xảy ra khi cập nhật homestay. Vui lòng thử lại.");
    }
  };

  const handleConfirmDelete = async (homestayId) => {
    try {
      await deleteHostHomestay(homestayId);

      // Close modal
      setDeleteModalOpen(false);
      setSelectedHomestay(null);

      // Refresh the homestays list
      await refresh();

      alert("Dừng hoạt động homestay thành công!");
    } catch (error) {
      console.error("Error deleting homestay:", error);
      alert("Có lỗi xảy ra khi xóa homestay. Vui lòng thử lại.");
    }
  };

  // Navigation handlers
  const handleViewRooms = (homestay) => {
    navigate(`/host/rooms?homestayId=${homestay.id}`);
  };

  const handleViewServices = (homestay) => {
    navigate(`/host/services?homestayId=${homestay.id}`);
  };

  // Close location dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLocationDropdown && !event.target.closest(".relative")) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLocationDropdown]);

  return (
    <HostLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý Homestay
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả homestay của bạn ({stats.total} homestay)
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Tổng homestay
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <HomeIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">
                  Đang hoạt động
                </p>
                <p className="text-2xl font-bold text-green-600">
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
                  Ngừng hoạt động
                </p>
                <p className="text-2xl font-bold text-gray-600">
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
                <p className="text-xl font-bold text-blue-600">
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
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm homestay theo tên hoặc địa điểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm"
              />
            </div>

            <div className="flex gap-3 flex-wrap lg:flex-nowrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>

              {/* Location Filter Dropdown */}
              <div className="relative w-48">
                <button
                  type="button"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between"
                >
                  <span className="truncate">{selectedLocationName}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showLocationDropdown ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showLocationDropdown && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                      <input
                        type="text"
                        placeholder="Tìm kiếm khu vực..."
                        value={locationSearchTerm}
                        onChange={(e) => setLocationSearchTerm(e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                        autoFocus
                      />
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto max-h-60">
                      <button
                        type="button"
                        onClick={() =>
                          handleLocationSelect("all", "Tất cả khu vực")
                        }
                        className={`w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors ${
                          locationFilter === "all"
                            ? "bg-blue-100 font-medium"
                            : ""
                        }`}
                      >
                        Tất cả khu vực
                      </button>

                      {filteredLocations.length === 0 ? (
                        <div className="px-3 py-4 text-sm text-gray-500 text-center">
                          Không tìm thấy khu vực
                        </div>
                      ) : (
                        filteredLocations.map((location) => (
                          <button
                            key={location.maKv}
                            type="button"
                            onClick={() =>
                              handleLocationSelect(
                                location.maKv,
                                location.tenKv
                              )
                            }
                            className={`w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors ${
                              locationFilter === location.maKv
                                ? "bg-blue-100 font-medium"
                                : ""
                            }`}
                          >
                            {location.tenKv}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <select
                value={sortFilter}
                onChange={(e) => setSortFilter(e.target.value)}
                className="w-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-center"
              >
                <option value="all">Sắp xếp</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
                <option value="rating-desc">Đánh giá cao nhất</option>
                <option value="reviews-desc">Nhiều đánh giá nhất</option>
                <option value="name-asc">Tên: A - Z</option>
                <option value="name-desc">Tên: Z - A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Homestays List */}
        <HomestaysList
          homestays={homestays}
          loading={loading}
          onView={handleViewHomestay}
          onEdit={handleEditHomestay}
          onDelete={handleDeleteHomestay}
          onViewRooms={handleViewRooms}
          onViewServices={handleViewServices}
        />

        {/* Pagination */}
        {total > 0 && (
          <Pagination
            currentPage={page}
            totalItems={total}
            itemsPerPage={size}
            onPageChange={handlePageChange}
            itemLabel="homestay"
          />
        )}
      </div>

      {/* Modals */}
      <ViewHomestayModal
        homestay={selectedHomestay}
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedHomestay(null);
        }}
      />

      <EditHomestayModal
        homestay={selectedHomestay}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedHomestay(null);
        }}
        updateHomestay={updateHomestay}
      />

      <DeleteHomestayModal
        homestay={selectedHomestay}
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedHomestay(null);
        }}
        deleteHomestay={deleteHomestay}
      />
    </HostLayout>
  );
};

export default Homestays;
