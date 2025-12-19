import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HostLayout from "../../components/host/common/HostLayout";
import Pagination from "../../components/host/common/Pagination";
import ServiceList from "../../components/host/services/ServiceList";
import CreateServiceModal from "../../components/host/services/CreateServiceModal";
import UpdateServiceModal from "../../components/host/services/UpdateServiceModal";
import DeleteServiceModal from "../../components/host/services/DeleteServiceModal";
import { useHostHomestays } from "../../hooks/host/useHostHomestays";
import { useHostServices } from "../../hooks/host/useHostServices";
import { Search, Plus, Briefcase, Filter, Home } from "lucide-react";

const Services = () => {
  const location = useLocation();
  const { homestaysSelectList, selectListLoading } = useHostHomestays();
  const {
    services,
    page,
    total,
    loading,
    setPage,
    setSearch,
    setHomestayId,
    createService,
    updateService,
    deleteService,
  } = useHostServices();

  const [searchTerm, setSearchTerm] = useState("");

  // Homestay filter states
  const [homestayFilter, setHomestayFilter] = useState("all");
  const [homestaySearchTerm, setHomestaySearchTerm] = useState("");
  const [showHomestayDropdown, setShowHomestayDropdown] = useState(false);

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Set homestay filter from navigation state
  useEffect(() => {
    if (location.state?.homestayId) {
      setHomestayFilter(location.state.homestayId);
      setPage(1); // Reset to first page
    }
  }, [location.state, setPage]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, setSearch]);

  // Update homestay filter
  useEffect(() => {
    if (homestayFilter === "all") {
      setHomestayId("");
    } else {
      setHomestayId(homestayFilter);
    }
  }, [homestayFilter, setHomestayId]);

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

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setUpdateModalOpen(true);
  };

  const handleDelete = (service) => {
    setSelectedService(service);
    setDeleteModalOpen(true);
  };

  return (
    <HostLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-blue-600" />
              Quản lý Dịch vụ
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý các dịch vụ bổ sung cho homestay của bạn
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Thêm dịch vụ
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Homestay Filter */}
            <div className="w-full md:w-64 relative homestay-filter">
              <button
                onClick={() => setShowHomestayDropdown(!showHomestayDropdown)}
                disabled={selectListLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Home className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700 truncate">
                    {selectListLoading ? "Đang tải..." : selectedHomestayName}
                  </span>
                </div>
                <Filter className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
              </button>

              {showHomestayDropdown && !selectListLoading && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                  {/* Search box in dropdown */}
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Tìm homestay..."
                        value={homestaySearchTerm}
                        onChange={(e) => setHomestaySearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* Options list */}
                  <div className="max-h-48 overflow-y-auto">
                    <button
                      onClick={() => handleHomestaySelect("all")}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                        homestayFilter === "all"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      Tất cả homestay
                    </button>
                    {filteredHomestays.map((homestay) => (
                      <button
                        key={homestay.id}
                        onClick={() => handleHomestaySelect(homestay.id)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 ${
                          homestayFilter === homestay.id
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        {homestay.homestayName}
                      </button>
                    ))}
                    {filteredHomestays.length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Không tìm thấy homestay
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
            <Filter className="h-4 w-4" />
            <span>
              Hiển thị {services.length} / {total} dịch vụ
            </span>
          </div>
        </div>

        {/* Services Grid */}
        <ServiceList
          services={services}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
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
            itemLabel="dịch vụ"
          />
        )}
      </div>

      {/* Modals */}
      <CreateServiceModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        homestaysSelectList={homestaysSelectList}
        onSubmit={createService}
      />

      <UpdateServiceModal
        isOpen={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
          setSelectedService(null);
        }}
        homestaysSelectList={homestaysSelectList}
        onSubmit={updateService}
        service={selectedService}
      />

      <DeleteServiceModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedService(null);
        }}
        onDelete={deleteService}
        service={selectedService}
      />
    </HostLayout>
  );
};

export default Services;
