import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HostLayout from "../../components/host/common/HostLayout";
import Pagination from "../../components/host/common/Pagination";
import RoomsList from "../../components/host/rooms/RoomsList";
import CreateRoomModal from "../../components/host/rooms/CreateRoomModal";
import UpdateRoomModal from "../../components/host/rooms/UpdateRoomModal";
import { useHostHomestays } from "../../hooks/host/useHostHomestays";
import { useHostRooms } from "../../hooks/host/useHostRooms";
import { getImageUrl } from "../../utils/imageUrl";
import SearchableDropdown from "../../components/common/SearchableDropdown";
import { getRoomTypes } from "../../api/host/rooms";
import {
  Search,
  Plus,
  DoorOpen,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const Rooms = () => {
  const location = useLocation();
  const { homestaysSelectList, selectListLoading } = useHostHomestays();
  const {
    rooms,
    page,
    total,
    loading,
    setPage,
    setSearch,
    setStatus,
    setHomestayId,
    setRoomTypeId,
    createRoom,
    updateRoom,
    deleteRoom,
  } = useHostRooms();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);

  // Homestay filter states
  const [homestayFilter, setHomestayFilter] = useState("all");
  const [homestaySearchTerm, setHomestaySearchTerm] = useState("");
  const [showHomestayDropdown, setShowHomestayDropdown] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Set homestay filter from navigation state
  useEffect(() => {
    if (location.state?.homestayId) {
      console.log(
        "Setting homestay filter from navigation:",
        location.state.homestayId
      );
      setHomestayFilter(location.state.homestayId);
      setPage(1); // Reset to first page
    }
  }, [location.state, setPage]);

  // Fetch room types on mount
  useEffect(() => {
    const fetchRoomTypes = async () => {
      setLoadingRoomTypes(true);
      try {
        const response = await getRoomTypes();
        if (response?.success) {
          setRoomTypes(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching room types:", error);
      } finally {
        setLoadingRoomTypes(false);
      }
    };
    fetchRoomTypes();
  }, []);

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

  // Update homestay filter
  useEffect(() => {
    console.log("Homestay filter changed:", homestayFilter);
    if (homestayFilter === "all") {
      setHomestayId("");
    } else {
      setHomestayId(homestayFilter);
    }
  }, [homestayFilter, setHomestayId]);

  // Update room type filter
  useEffect(() => {
    setRoomTypeId(roomTypeFilter);
  }, [roomTypeFilter, setRoomTypeId]);

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

  // Close homestay dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHomestayDropdown && !event.target.closest(".homestay-filter")) {
        setShowHomestayDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHomestayDropdown]);

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setCurrentImageIndex(0);
    setDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setSelectedRoom(null);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    if (selectedRoom && selectedRoom.images) {
      setCurrentImageIndex((prev) =>
        prev === selectedRoom.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedRoom && selectedRoom.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedRoom.images.length - 1 : prev - 1
      );
    }
  };

  const handleDeleteRoom = (room) => {
    setSelectedRoom(room);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRoom) return;

    setIsDeleting(true);
    const success = await deleteRoom(selectedRoom.id);
    setIsDeleting(false);

    if (success) {
      setDeleteModalOpen(false);
      setSelectedRoom(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setSelectedRoom(null);
  };

  const handleCreateRoom = async (formData) => {
    const success = await createRoom(formData);
    if (success) {
      setCreateModalOpen(false);
    }
  };

  const handleUpdateRoom = async (roomId, formData) => {
    const success = await updateRoom(roomId, formData);
    if (success) {
      setUpdateModalOpen(false);
      setSelectedRoom(null);
    }
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toLowerCase();
    const statusConfig = {
      active: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Đang hoạt động",
        icon: CheckCircle,
      },
      inactive: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "Ngừng hoạt động",
        icon: XCircle,
      },
    };

    const config = statusConfig[normalizedStatus] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  return (
    <HostLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <DoorOpen className="h-7 w-7 text-blue-600" />
              Quản lý Phòng
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý tất cả các phòng trong homestay của bạn
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Thêm phòng mới
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên phòng hoặc homestay..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              {/* Room Type Filter */}
              <div className="w-64">
                <SearchableDropdown
                  placeholder="Lọc theo loại phòng"
                  value={roomTypeFilter}
                  onChange={setRoomTypeFilter}
                  options={roomTypes.map((type) => ({
                    id: type.id,
                    label: type.name,
                    subtitle: type.description,
                  }))}
                  loading={loadingRoomTypes}
                  emptyLabel="Tất cả loại phòng"
                  searchPlaceholder="Tìm loại phòng..."
                  allowEmpty={true}
                  emptyOptionLabel="Tất cả loại phòng"
                />
              </div>

              {/* Homestay Filter */}
              <div className="relative homestay-filter">
                <button
                  onClick={() => setShowHomestayDropdown(!showHomestayDropdown)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors flex items-center gap-2 min-w-[200px] justify-between"
                >
                  <span className="truncate">{selectedHomestayName}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
                </button>

                {showHomestayDropdown && (
                  <div className="absolute z-10 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
                    {/* Search within dropdown */}
                    <div className="p-3 border-b sticky top-0 bg-white">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Tìm homestay..."
                          value={homestaySearchTerm}
                          onChange={(e) =>
                            setHomestaySearchTerm(e.target.value)
                          }
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {/* All option */}
                      <button
                        onClick={() => handleHomestaySelect("all")}
                        className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors ${
                          homestayFilter === "all"
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Tất cả homestay</span>
                          {homestayFilter === "all" && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          )}
                        </div>
                      </button>

                      {/* Homestay options */}
                      {selectListLoading ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          Đang tải...
                        </div>
                      ) : filteredHomestays.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          Không tìm thấy homestay
                        </div>
                      ) : (
                        filteredHomestays.map((homestay) => (
                          <button
                            key={homestay.id}
                            onClick={() => handleHomestaySelect(homestay.id)}
                            className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors ${
                              homestayFilter === homestay.id
                                ? "bg-blue-50 text-blue-700 font-semibold"
                                : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">
                                {homestay.homestayName}
                              </span>
                              {homestayFilter === homestay.id && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Active">Đang hoạt động</option>
                <option value="Inactive">Ngừng hoạt động</option>
              </select>
            </div>
          </div>
        </div>

        {/* Rooms List Component */}
        <RoomsList
          rooms={rooms}
          loading={loading}
          onView={handleViewDetails}
          onEdit={(room) => {
            setSelectedRoom(room);
            setUpdateModalOpen(true);
          }}
          onDelete={handleDeleteRoom}
        />

        {/* Pagination */}
        {total > 0 && (
          <Pagination
            currentPage={page}
            totalItems={total}
            itemsPerPage={6}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            itemLabel="phòng"
          />
        )}

        {/* Detail Modal */}
        {detailModalOpen && selectedRoom && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={handleCloseModal}
              ></div>

              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                {/* Header */}
                <div className="bg-white px-6 py-4 border-b flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedRoom.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedRoom.homestayName}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Body */}
                <div className="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
                  {/* Image Gallery */}
                  {selectedRoom.images && selectedRoom.images.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Hình ảnh phòng
                      </h4>
                      <div className="relative">
                        {/* Main Image */}
                        <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={getImageUrl(
                              selectedRoom.images[currentImageIndex]
                            )}
                            alt={`${selectedRoom.name} - ${
                              currentImageIndex + 1
                            }`}
                            className="w-full h-full object-cover"
                          />

                          {/* Navigation Arrows */}
                          {selectedRoom.images.length > 1 && (
                            <>
                              <button
                                onClick={handlePrevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                              >
                                <ChevronLeft className="h-6 w-6" />
                              </button>
                              <button
                                onClick={handleNextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                              >
                                <ChevronRight className="h-6 w-6" />
                              </button>
                            </>
                          )}

                          {/* Image Counter */}
                          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} /{" "}
                            {selectedRoom.images.length}
                          </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {selectedRoom.images.length > 1 && (
                          <div className="grid grid-cols-6 gap-2 mt-3">
                            {selectedRoom.images.map((image, index) => (
                              <div
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                                  currentImageIndex === index
                                    ? "border-blue-600 ring-2 ring-blue-300"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                              >
                                <img
                                  src={getImageUrl(image)}
                                  alt={`Thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Room Details */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Thông tin cơ bản
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <span className="text-sm text-gray-500 w-32">
                            ID:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedRoom.id}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm text-gray-500 w-32">
                            Loại phòng:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedRoom.roomType}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm text-gray-500 w-32">
                            Sức chứa:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {selectedRoom.capacity} người
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm text-gray-500 w-32">
                            Trạng thái:
                          </span>
                          <div>{getStatusBadge(selectedRoom.status)}</div>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm text-gray-500 w-32">
                            Đơn giá:
                          </span>
                          <span className="text-lg font-bold text-blue-600">
                            {selectedRoom.price?.toLocaleString("vi-VN")}{" "}
                            VND/đêm
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Tiện nghi
                      </h4>
                      {selectedRoom.amenities &&
                      selectedRoom.amenities.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                          {selectedRoom.amenities.map((amenity) => (
                            <div
                              key={amenity.id}
                              className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg"
                            >
                              <Sparkles className="h-4 w-4 text-blue-600" />
                              <span>{amenity.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Chưa có tiện nghi
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Đóng
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <DoorOpen className="h-4 w-4" />
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && selectedRoom && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div
                className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                onClick={handleCancelDelete}
              ></div>

              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                {/* Header */}
                <div className="bg-white px-6 py-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Xác nhận xóa phòng
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Hành động này không thể hoàn tác
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="bg-white px-6 py-4">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Bạn có chắc chắn muốn xóa phòng này?
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        {selectedRoom.images &&
                        selectedRoom.images.length > 0 ? (
                          <img
                            src={getImageUrl(selectedRoom.images[0])}
                            alt={selectedRoom.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <DoorOpen className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {selectedRoom.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {selectedRoom.homestayName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600">
                              {selectedRoom.roomType}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-600">
                              {selectedRoom.capacity} người
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-800">
                        <strong>Lưu ý:</strong> Phòng sẽ bị xóa vĩnh viễn khỏi
                        hệ thống và không thể khôi phục.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                  <button
                    onClick={handleCancelDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang xóa...
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4" />
                        Xác nhận xóa
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Room Modal */}
        <CreateRoomModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          homestaysSelectList={homestaysSelectList}
          onSubmit={handleCreateRoom}
        />

        {/* Update Room Modal */}
        <UpdateRoomModal
          isOpen={updateModalOpen}
          onClose={() => {
            setUpdateModalOpen(false);
            setSelectedRoom(null);
          }}
          homestaysSelectList={homestaysSelectList}
          onSubmit={handleUpdateRoom}
          room={selectedRoom}
        />
      </div>
    </HostLayout>
  );
};

export default Rooms;
