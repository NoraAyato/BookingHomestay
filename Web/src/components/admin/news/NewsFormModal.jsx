import React, { useState, useEffect } from "react";
import {
  X,
  Upload,
  FileText,
  Tag,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";

const NewsFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  initialData = null,
  mode = "create", // "create" hoặc "edit"
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft",
    categoryId: "",
    featured: false,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Load initial data when editing
  useEffect(() => {
    if (isOpen && initialData && mode === "edit") {
      // Find matching category from the categories list
      const matchingCategory = categories.find(
        (cat) =>
          cat.name === initialData.category || cat.id === initialData.categoryId
      );

      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
        status: initialData.status || "draft",
        // Use the matched category's ID or fallback to category field
        categoryId:
          matchingCategory?.id ||
          initialData.categoryId ||
          initialData.category ||
          "",
        featured: initialData.featured || false,
      });

      // Set existing image preview
      if (initialData.image) {
        setImagePreview(getImageUrl(initialData.image));
      }
    } else if (isOpen && mode === "create") {
      // Reset form for create mode
      setFormData({
        title: "",
        content: "",
        status: "draft",
        categoryId: "",
        featured: false,
      });
      setImagePreview("");
      setImageFile(null);
    }
  }, [isOpen, initialData, mode, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleToggleFeatured = () => {
    setFormData((prev) => ({
      ...prev,
      featured: !prev.featured,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
          image: "Kích thước file không được vượt quá 5MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(file);
        setErrors((prev) => ({ ...prev, image: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Nội dung là bắt buộc";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Danh mục là bắt buộc";
    }

    // Image chỉ bắt buộc khi tạo mới
    if (mode === "create" && !imageFile) {
      newErrors.image = "Hình ảnh là bắt buộc";
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
      await onSubmit({
        ...formData,
        image: imageFile,
      });
      handleClose();
    } catch (error) {
      console.error("Error submitting news:", error);
      setErrors({
        submit: error.message || "Đã xảy ra lỗi khi lưu tin tức",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      content: "",
      status: "draft",
      categoryId: "",
      featured: false,
    });
    setImagePreview("");
    setImageFile(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  {mode === "edit" ? "Cập nhật tin tức" : "Tạo tin tức mới"}
                </h3>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-white hover:text-gray-200 transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Error message */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errors.submit}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập tiêu đề tin tức"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                    errors.content ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nhập nội dung tin tức"
                  disabled={isSubmitting}
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                )}
              </div>

              {/* Category and Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.categoryId ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    >
                      <option value="">Chọn danh mục</option>
                      {categories
                        .filter((cat) => cat.id !== "all")
                        .map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.categoryId}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">Xuất bản</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh{" "}
                  {mode === "create" && <span className="text-red-500">*</span>}
                  {mode === "edit" && (
                    <span className="text-gray-500 text-xs">
                      (Để trống nếu không thay đổi)
                    </span>
                  )}
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-3 relative rounded-lg overflow-hidden h-48 bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    errors.image
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <input
                    type="file"
                    id="news-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="news-image"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click để chọn hình ảnh
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF tối đa 5MB
                    </span>
                  </label>
                </div>
                {errors.image && (
                  <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                )}
              </div>

              {/* Featured Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tin nổi bật
                </label>
                <button
                  type="button"
                  onClick={handleToggleFeatured}
                  disabled={isSubmitting}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg border-2 transition-all ${
                    formData.featured
                      ? "bg-yellow-50 border-yellow-500 text-yellow-700"
                      : "bg-gray-50 border-gray-300 text-gray-500"
                  }`}
                >
                  {formData.featured ? (
                    <ToggleRight className="w-6 h-6" />
                  ) : (
                    <ToggleLeft className="w-6 h-6" />
                  )}
                  <span className="font-medium">
                    {formData.featured ? "⭐ Nổi bật" : "Thường"}
                  </span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Đang xử lý...
                  </>
                ) : mode === "edit" ? (
                  "Cập nhật"
                ) : (
                  "Tạo tin tức"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsFormModal;
