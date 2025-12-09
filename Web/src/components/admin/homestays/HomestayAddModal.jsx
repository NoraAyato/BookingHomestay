import React, { useState, useEffect } from "react";
import { X, Upload, MapPin, User } from "lucide-react";
import { useLocationData } from "../../../hooks/useLocation";
import useAdminUsers from "../../../hooks/admin/useAdminUsers";
import SearchableDropdown from "../../common/SearchableDropdown";

const HomestayAddModal = ({ isOpen, onClose, onAdd }) => {
  const { allLocations, loadingAll } = useLocationData();
  const { allUsers, loadingAllUsers, fetchAllUsers } = useAdminUsers();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    locationId: "",
    hostId: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch all users when modal opens
  useEffect(() => {
    if (isOpen && allUsers.length === 0) {
      fetchAllUsers();
    }
  }, [isOpen, allUsers.length, fetchAllUsers]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        address: "",
        description: "",
        locationId: "",
        hostId: "",
        imageFile: null,
      });
      setImagePreview("");
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Prepare options for dropdowns
  const locationOptions = allLocations.map((location) => ({
    id: location.maKv,
    label: location.tenKv,
  }));

  const hostOptions = allUsers.map((user) => ({
    id: user.id,
    label: user.name,
    subtitle: user.email,
  }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          imageFile: "Kích thước ảnh không được vượt quá 5MB",
        }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          imageFile: "Vui lòng chọn file ảnh",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
        }));
        setErrors((prev) => ({ ...prev, imageFile: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData((prev) => ({
      ...prev,
      imageFile: null,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên homestay";
    }

    if (!formData.imageFile) {
      newErrors.imageFile = "Vui lòng chọn ảnh homestay";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onAdd(formData);
      onClose();
    } catch (error) {
      console.error("Error adding homestay:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Thêm Homestay Mới
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh Homestay <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex flex-col items-center">
                    {imagePreview ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Chọn ảnh homestay
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {errors.imageFile && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.imageFile}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF tối đa 5MB
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên Homestay <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập tên homestay"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập địa chỉ homestay"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mô tả
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Nhập mô tả về homestay..."
                  />
                </div>

                {/* Location & Host */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Location Selector */}
                  <SearchableDropdown
                    label="Khu vực"
                    placeholder="Chọn khu vực"
                    value={formData.locationId}
                    onChange={(locationId) =>
                      setFormData((prev) => ({ ...prev, locationId }))
                    }
                    options={locationOptions}
                    loading={loadingAll}
                    emptyLabel="Không chọn"
                    searchPlaceholder="Tìm kiếm khu vực..."
                    icon={<MapPin className="w-4 h-4 inline" />}
                    allowEmpty={true}
                    emptyOptionLabel="Không chọn"
                  />

                  {/* Host Selector */}
                  <SearchableDropdown
                    label="Chủ nhà"
                    placeholder="Chọn chủ nhà"
                    value={formData.hostId}
                    onChange={(hostId) =>
                      setFormData((prev) => ({ ...prev, hostId }))
                    }
                    options={hostOptions}
                    loading={loadingAllUsers}
                    emptyLabel="Chưa cập nhật"
                    searchPlaceholder="Tìm kiếm người dùng..."
                    icon={<User className="w-4 h-4 inline" />}
                    allowEmpty={true}
                    emptyOptionLabel="Chưa cập nhật"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang thêm..." : "Thêm Homestay"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomestayAddModal;
