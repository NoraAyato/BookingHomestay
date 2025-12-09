import React, { useState, useEffect } from "react";
import { X, Tag, FileText, ToggleLeft, ToggleRight } from "lucide-react";

const TopicFormModal = ({ isOpen, onClose, onSubmit, topic = null }) => {
  const isEditMode = !!topic;

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    status: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Load topic data when in edit mode
  useEffect(() => {
    if (isEditMode && topic) {
      setFormData({
        name: topic.name || "",
        title: topic.name || "",
        description: topic.description || "",
        status: topic.isActive !== undefined ? topic.isActive : true,
      });
    } else {
      setFormData({
        name: "",
        title: "",
        description: "",
        status: true,
      });
    }
  }, [isEditMode, topic]);

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

  const handleToggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: !prev.status,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (isEditMode) {
      // Edit mode: require title
      if (!formData.title.trim()) {
        newErrors.title = "Tiêu đề chủ đề là bắt buộc";
      }
    } else {
      // Create mode: require name
      if (!formData.name.trim()) {
        newErrors.name = "Tên chủ đề là bắt buộc";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
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
      // Prepare data based on mode
      const submitData = isEditMode
        ? {
            title: formData.title,
            description: formData.description,
            status: formData.status,
          }
        : {
            name: formData.name,
            description: formData.description,
          };

      await onSubmit(submitData);
      handleClose();
    } catch (error) {
      console.error("Error submitting topic:", error);
      setErrors({
        submit: error.message || "Đã xảy ra lỗi khi lưu chủ đề",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      title: "",
      description: "",
      status: true,
    });
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
                  <Tag className="w-5 h-5 mr-2" />
                  {isEditMode ? "Cập nhật chủ đề" : "Thêm chủ đề mới"}
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
            <div className="px-6 py-5 space-y-5">
              {/* Error message */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errors.submit}
                </div>
              )}

              {/* Name field (create mode only) */}
              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên chủ đề <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nhập tên chủ đề"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Title field (edit mode only) */}
              {isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề chủ đề <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nhập tiêu đề chủ đề"
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập mô tả cho chủ đề"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Status toggle (edit mode only) */}
              {isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trạng thái
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    disabled={isSubmitting}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg border-2 transition-all ${
                      formData.status
                        ? "bg-green-50 border-green-500 text-green-700"
                        : "bg-gray-50 border-gray-300 text-gray-500"
                    }`}
                  >
                    {formData.status ? (
                      <ToggleRight className="w-6 h-6" />
                    ) : (
                      <ToggleLeft className="w-6 h-6" />
                    )}
                    <span className="font-medium">
                      {formData.status ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </button>
                </div>
              )}
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
                ) : isEditMode ? (
                  "Cập nhật"
                ) : (
                  "Thêm chủ đề"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TopicFormModal;
