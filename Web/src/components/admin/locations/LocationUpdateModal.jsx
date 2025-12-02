import React, { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";

const LocationUpdateModal = ({ location, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    image: "",
  });
  const [originalData, setOriginalData] = useState({
    name: "",
    description: "",
    status: "active",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location) {
      const initialData = {
        name: location.name || "",
        description: location.description || "",
        status: location.status || "active",
        image: location.image || "",
      };
      setFormData(initialData);
      setOriginalData(initialData);
      setImagePreview(location.image || "");
    }
  }, [location]);

  // Check if form has changes
  const hasChanges = () => {
    return (
      formData.name !== originalData.name ||
      formData.description !== originalData.description ||
      formData.status !== originalData.status ||
      formData.imageFile !== undefined // New image selected
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onUpdate(location.id, formData);
      onClose();
    } catch (error) {
      console.error("Error updating location:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !location) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Chỉnh sửa khu vực
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
            <div className="px-6 py-5 space-y-5">
              {/* Location ID (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã khu vực
                </label>
                <input
                  type="text"
                  value={location.id}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 font-mono"
                />
              </div>

              {/* Location Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên khu vực <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Nhập tên khu vực..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder="Nhập mô tả khu vực..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Ngừng hoạt động</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-3 relative rounded-lg overflow-hidden h-48 bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Upload Button */}
                <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Chọn hình ảnh mới
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Statistics (readonly) */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="text-sm font-medium text-blue-900 mb-1">
                    Số lượng Homestay
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {location.homestaysCount}
                  </p>
                </div>

                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                  <div className="text-sm font-medium text-emerald-900 mb-1">
                    Tổng đặt chỗ
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {location.totalBookings}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !hasChanges()}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationUpdateModal;
