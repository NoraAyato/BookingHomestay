import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import { Search, Filter, Plus } from "lucide-react";
import HomestaysList from "../../components/admin/homestays/HomestaysList";
import HomestayDetailModal from "../../components/admin/homestays/HomestayDetailModal";
import HomestayUpdateModal from "../../components/admin/homestays/HomestayUpdateModal";
import HomestayAddModal from "../../components/admin/homestays/HomestayAddModal";
import HomestayDeleteModal from "../../components/admin/homestays/HomestayDeleteModal";
import { useHomestayManager } from "../../hooks/admin/useHomestayManager";
import { useLocationData } from "../../hooks/useLocation";
import { getImageUrl } from "../../utils/imageUrl";
import { showToast } from "../../components/common/Toast";

const Homestays = () => {
  const {
    homestays: apiHomestays,
    page,
    limit,
    total,
    loading,
    error,
    setPage,
    setSearch,
    setStatus,
    setMinPrice,
    setMinRoom,
    setLocationId,
    setRating,
    refresh,
    updateHomestay,
    addHomestay,
    deleteHomestay,
  } = useHomestayManager();

  const { allLocations } = useLocationData();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Advanced filters - frontend only (no backend support)
  const [revenueRange, setRevenueRange] = useState("all");
  const [bookingsRange, setBookingsRange] = useState("all");

  // Backend-supported filters
  const [priceRange, setPriceRange] = useState("all");
  const [roomsFilter, setRoomsFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // Location search state
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Modal states
  const [selectedHomestay, setSelectedHomestay] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      // Map frontend status to backend status (capitalize first letter)
      const backendStatus =
        statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
      setStatus(backendStatus);
    }
  }, [statusFilter, setStatus]);

  // Update price filter
  useEffect(() => {
    if (priceRange === "all") {
      setMinPrice(null);
    } else if (priceRange === "under500k") {
      setMinPrice(0);
    } else if (priceRange === "500k-1m") {
      setMinPrice(500000);
    } else if (priceRange === "1m-2m") {
      setMinPrice(1000000);
    } else if (priceRange === "over2m") {
      setMinPrice(2000000);
    }
  }, [priceRange, setMinPrice]);

  // Update rooms filter
  useEffect(() => {
    if (roomsFilter === "all") {
      setMinRoom(null);
    } else if (roomsFilter === "1-2") {
      setMinRoom(1);
    } else if (roomsFilter === "3-4") {
      setMinRoom(3);
    } else if (roomsFilter === "5+") {
      setMinRoom(5);
    }
  }, [roomsFilter, setMinRoom]);

  // Update rating filter
  useEffect(() => {
    if (ratingFilter === "all") {
      setRating(null);
    } else if (ratingFilter === "4.5+") {
      setRating(4.5);
    } else if (ratingFilter === "4.0-4.5") {
      setRating(4.0);
    } else if (ratingFilter === "under4.0") {
      setRating(0);
    }
  }, [ratingFilter, setRating]);

  // Update location filter
  useEffect(() => {
    if (locationFilter === "all") {
      setLocationId("");
    } else {
      setLocationId(locationFilter);
    }
  }, [locationFilter, setLocationId]);

  // Transform API data to match component expectations
  const homestays = apiHomestays.map((homestay) => ({
    id: homestay.id,
    name: homestay.name,
    location: homestay.location,
    host: homestay.host,
    status: homestay.status.toLowerCase(), // Normalize to lowercase
    rating: homestay.rating,
    reviews: homestay.reviews,
    rooms: homestay.rooms,
    description: homestay.description,
    hostEmail: homestay.hostEmail,
    pricePerNight: homestay.pricePerNight,
    totalBookings: homestay.totalBookings,
    revenue: homestay.revenue,
    image: getImageUrl(homestay.image),
  }));

  // Apply frontend-only filters (revenue, bookings)
  const filteredHomestays = homestays.filter((homestay) => {
    // Revenue range filter (frontend only)
    if (revenueRange !== "all") {
      if (revenueRange === "under20m" && homestay.revenue >= 20000000)
        return false;
      if (
        revenueRange === "20m-50m" &&
        (homestay.revenue < 20000000 || homestay.revenue > 50000000)
      )
        return false;
      if (
        revenueRange === "50m-100m" &&
        (homestay.revenue < 50000000 || homestay.revenue > 100000000)
      )
        return false;
      if (revenueRange === "over100m" && homestay.revenue <= 100000000)
        return false;
    }

    // Bookings range filter (frontend only)
    if (bookingsRange !== "all") {
      if (bookingsRange === "under20" && homestay.totalBookings >= 20)
        return false;
      if (
        bookingsRange === "20-50" &&
        (homestay.totalBookings < 20 || homestay.totalBookings > 50)
      )
        return false;
      if (
        bookingsRange === "50-100" &&
        (homestay.totalBookings < 50 || homestay.totalBookings > 100)
      )
        return false;
      if (bookingsRange === "over100" && homestay.totalBookings <= 100)
        return false;
    }

    return true;
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriceRange("all");
    setRoomsFilter("all");
    setRatingFilter("all");
    setRevenueRange("all");
    setBookingsRange("all");
    setLocationFilter("all");
    setLocationSearchTerm("");
  };

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
  const handleLocationSelect = (maKv, tenKv) => {
    setLocationFilter(maKv);
    setLocationSearchTerm("");
    setShowLocationDropdown(false);
  };

  const handleView = (homestay) => {
    setSelectedHomestay(homestay);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (homestay) => {
    setSelectedHomestay(homestay);
    setIsUpdateModalOpen(true);
  };

  const handleUpdate = async (homestayId, data) => {
    const success = await updateHomestay(homestayId, data);

    if (success) {
      setIsUpdateModalOpen(false);
      setSelectedHomestay(null);
    }
  };

  const handleAdd = async (data) => {
    const success = await addHomestay(data);

    if (success) {
      setIsAddModalOpen(false);
    }
  };

  const handleDelete = (homestay) => {
    setSelectedHomestay(homestay);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedHomestay) return;

    setIsDeleting(true);
    try {
      await deleteHomestay(selectedHomestay.id);
      setIsDeleteModalOpen(false);
      setSelectedHomestay(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      showToast("error", error);
    }
  }, [error]);

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
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý Homestay
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả homestay của hệ thống
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm Homestay</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm homestay..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-4 py-2 border rounded-lg flex items-center space-x-2 transition-colors ${
                  showAdvancedFilters
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Bộ lọc khác</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Location Filter */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khu vực
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowLocationDropdown(!showLocationDropdown)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left bg-white flex items-center justify-between"
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
                            onChange={(e) =>
                              setLocationSearchTerm(e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khoảng giá/đêm
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả mức giá</option>
                    <option value="under500k">Dưới 500,000đ</option>
                    <option value="500k-1m">500,000đ - 1,000,000đ</option>
                    <option value="1m-2m">1,000,000đ - 2,000,000đ</option>
                    <option value="over2m">Trên 2,000,000đ</option>
                  </select>
                </div>

                {/* Rooms Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số phòng
                  </label>
                  <select
                    value={roomsFilter}
                    onChange={(e) => setRoomsFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="1-2">1-2 phòng</option>
                    <option value="3-4">3-4 phòng</option>
                    <option value="5+">5+ phòng</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá
                  </label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="4.5+">4.5+ sao</option>
                    <option value="4.0-4.5">4.0 - 4.5 sao</option>
                    <option value="under4.0">Dưới 4.0 sao</option>
                  </select>
                </div>

                {/* Revenue Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doanh thu
                  </label>
                  <select
                    value={revenueRange}
                    onChange={(e) => setRevenueRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="under20m">Dưới 20 triệu</option>
                    <option value="20m-50m">20 - 50 triệu</option>
                    <option value="50m-100m">50 - 100 triệu</option>
                    <option value="over100m">Trên 100 triệu</option>
                  </select>
                </div>

                {/* Bookings Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượt đặt
                  </label>
                  <select
                    value={bookingsRange}
                    onChange={(e) => setBookingsRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả</option>
                    <option value="under20">Dưới 20 lượt</option>
                    <option value="20-50">20 - 50 lượt</option>
                    <option value="50-100">50 - 100 lượt</option>
                    <option value="over100">Trên 100 lượt</option>
                  </select>
                </div>
              </div>

              {/* Reset Filters Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetAllFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Homestays Grid */}
        <HomestaysList
          homestays={filteredHomestays}
          loading={loading}
          page={page}
          pageSize={limit}
          total={total}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Modals */}
        <HomestayDetailModal
          homestay={selectedHomestay}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedHomestay(null);
          }}
        />

        <HomestayUpdateModal
          homestay={selectedHomestay}
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedHomestay(null);
          }}
          onUpdate={handleUpdate}
        />

        <HomestayAddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAdd}
        />

        <HomestayDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedHomestay(null);
          }}
          onConfirm={handleConfirmDelete}
          homestay={selectedHomestay}
          isDeleting={isDeleting}
        />
      </div>
    </AdminLayout>
  );
};

export default Homestays;
