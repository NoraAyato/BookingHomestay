import React, { useState, useEffect } from "react";
import { X, Upload, Briefcase } from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";

const UpdateServiceModal = ({
  isOpen,
  onClose,
  homestaysSelectList,
  onSubmit,
  service,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    homestayId: "",
    image: null,
    existingImage: "",
  });

  // Track initial data for comparison
  const [initialData, setInitialData] = useState(null);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Image preview
  const [imagePreview, setImagePreview] = useState(null);

  // Load service data when modal opens
  useEffect(() => {
    if (isOpen && service) {
      const serviceData = {
        name: service.name || "",
        description: service.description || "",
        price: service.price || "",
        homestayId: service.homestayId || "",
        image: null,
        existingImage: service.image || "",
      };
      setFormData(serviceData);
      setInitialData({
        name: serviceData.name,
        description: serviceData.description,
        price: serviceData.price,
        homestayId: serviceData.homestayId,
      });
      setImagePreview(null);
      setErrors({});
    }
  }, [isOpen, service]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        description: "",
        price: "",
        homestayId: "",
        image: null,
        existingImage: "",
      });
      setErrors({});
      setImagePreview(null);
      setInitialData(null);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        image: "Vui lòng chọn file hình ảnh",
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Kích thước ảnh không được vượt quá 5MB",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    setErrors((prev) => ({ ...prev, image: "" }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeNewImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập tên dịch vụ";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Vui lòng nhập giá hợp lệ";
    }

    if (!formData.homestayId) {
      newErrors.homestayId = "Vui lòng chọn homestay";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if any data has changed
  const hasChanges = () => {
    if (!initialData) return false;

    return (
      formData.name !== initialData.name ||
      formData.description !== initialData.description ||
      formData.price !== initialData.price ||
      formData.homestayId !== initialData.homestayId ||
      formData.image !== null
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!hasChanges()) {
      setErrors({ general: "Không có thay đổi nào để cập nhật" });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("homestayId", formData.homestayId);

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const isSuccess = await onSubmit(service.id, submitData);
      if (isSuccess) {
        onClose();
      }
    } catch (error) {
    //   console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !service) return null;

  // Get current image to display (new preview or existing)
  const currentImage =
    imagePreview ||
    (formData.existingImage ? getImageUrl(formData.existingImage) : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Cập nhật Dịch vụ</h2>
              <p className="text-blue-100 text-sm">
                Chỉnh sửa thông tin dịch vụ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* General Error */}
          {errors.general && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Homestay Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Homestay <span className="text-red-500">*</span>
            </label>
            <select
              name="homestayId"
              value={formData.homestayId}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.homestayId ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Chọn homestay</option>
              {homestaysSelectList.map((homestay) => (
                <option key={homestay.id} value={homestay.id}>
                  {homestay.homestayName}
                </option>
              ))}
            </select>
            {errors.homestayId && (
              <p className="text-red-500 text-sm mt-1">{errors.homestayId}</p>
            )}
          </div>

          {/* Service Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên dịch vụ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ví dụ: Thuê xe máy, Giặt ủi, Ăn sáng..."
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Giá dịch vụ (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="50000"
              min="0"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Nhập mô tả chi tiết về dịch vụ..."
              rows="4"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hình ảnh
            </label>

            {currentImage ? (
              <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={currentImage}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeNewImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {!imagePreview && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center">
                    <label
                      htmlFor="update-service-image"
                      className="cursor-pointer text-sm"
                    >
                      <Upload className="h-4 w-4 inline mr-1" />
                      Thay đổi ảnh
                    </label>
                    <input
                      type="file"
                      id="update-service-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="update-service-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="update-service-image"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Nhấn để tải ảnh lên
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG hoặc WEBP (tối đa 5MB)
                  </p>
                </label>
              </div>
            )}

            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !hasChanges()}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateServiceModal;
