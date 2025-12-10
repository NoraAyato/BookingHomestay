import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  MapPin,
  Home,
  FileText,
  Tag,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import SearchableDropdown from "../common/SearchableDropdown";
import locationsData from "../../data/locationsData.json";

const EditHomestayModal = ({ homestay, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    locationId: "",
    location: "",
    address: "",
    description: "",
    status: "active",
    amenities: [],
  });

  useEffect(() => {
    if (homestay) {
      setFormData({
        name: homestay.name || "",
        locationId: homestay.locationId || "",
        location: homestay.location || "",
        address: homestay.address || "",
        description: homestay.description || "",
        status: homestay.status || "active",
        amenities: homestay.amenities || [],
      });
    }
  }, [homestay]);

  if (!isOpen || !homestay) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (locationId) => {
    const selectedLocation = locationsData.locations.find(
      (loc) => loc.id === locationId
    );
    setFormData((prev) => ({
      ...prev,
      locationId: locationId,
      location: selectedLocation ? selectedLocation.name : "",
    }));
  };

  const locationOptions = locationsData.locations.map((loc) => ({
    id: loc.id,
    label: loc.name,
    subtitle: loc.province,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...homestay, ...formData });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between shadow-md z-10">
          <div>
            <h2 className="text-2xl font-bold">Chỉnh sửa Homestay</h2>
            <p className="text-green-100 text-sm mt-0.5">
              Cập nhật thông tin homestay của bạn
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto max-h-[calc(90vh-160px)]"
        >
          <div className="p-6 space-y-6">
            {/* Images Upload */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-blue-600" />
                Hình ảnh homestay <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={homestay.image}
                    alt={homestay.name}
                    className="w-full object-cover"
                  />
                </div>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // TODO: Upload logic here
                        console.log("File selected:", file);
                      }
                    }}
                  />
                  <span className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer inline-block text-center">
                    Tải lên hình ảnh mới
                  </span>
                </label>
                <p className="text-xs text-gray-500 text-center">
                  Hỗ trợ: JPG, PNG, WEBP. Tối đa 5MB
                </p>
              </div>
            </div>

            {/* Homestay Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Home className="h-4 w-4 text-blue-600" />
                Tên homestay <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nhập tên homestay"
              />
            </div>

            {/* Location & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SearchableDropdown
                label={
                  <>
                    <MapPin className="h-4 w-4 text-blue-600 inline-block mr-1" />
                    Khu vực <span className="text-red-500">*</span>
                  </>
                }
                placeholder="Chọn khu vực..."
                value={formData.locationId}
                onChange={handleLocationChange}
                options={locationOptions}
                searchPlaceholder="Tìm khu vực..."
                emptyLabel="Chưa chọn khu vực"
                allowEmpty={false}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Địa chỉ chi tiết"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Mô tả về homestay của bạn..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/500 ký tự
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4 text-blue-600" />
                Trạng thái <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-md flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHomestayModal;
