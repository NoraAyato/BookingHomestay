import React, { useState } from "react";
import { X, Upload, XCircle, Gift, Percent, Calendar } from "lucide-react";

const PromotionCreateModal = ({ isOpen, onClose, onAdd, isLoading }) => {
  const [formData, setFormData] = useState({
    description: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
    minBookedDays: 0,
    minNights: 0,
    minValue: 0,
    quantity: 0,
    status: "active",
    isForNewCustomer: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({
        description: "",
        discountType: "percentage",
        discountValue: "",
        startDate: "",
        endDate: "",
        minBookedDays: 0,
        minNights: 0,
        minValue: 0,
        quantity: 0,
        status: "active",
        isForNewCustomer: false,
      });
      setImageFile(null);
      setImagePreview("");
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)",
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

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setImageFile(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả";
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = "Giá trị chiết khấu phải lớn hơn 0";
    }

    if (
      formData.discountType === "percentage" &&
      formData.discountValue > 100
    ) {
      newErrors.discountValue = "Phần trăm chiết khấu không được vượt quá 100%";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
      }
    }

    if (formData.minBookedDays < 0) {
      newErrors.minBookedDays = "Số ngày đặt trước không được âm";
    }

    if (formData.minNights < 0) {
      newErrors.minNights = "Số đêm tối thiểu không được âm";
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = "Số lượng phải lớn hơn 0";
    }

    if (formData.minValue < 0) {
      newErrors.minValue = "Giá trị tối thiểu không được âm";
    }

    if (!imageFile) {
      newErrors.image = "Vui lòng chọn ảnh khuyến mãi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare data object for API
    const dataToSubmit = {
      description: formData.description,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      startDate: formData.startDate,
      endDate: formData.endDate,
      minBookedDays: Number(formData.minBookedDays),
      minNights: Number(formData.minNights),
      isForNewCustomer: formData.isForNewCustomer,
      quantity: Number(formData.quantity),
      minValue: Number(formData.minValue),
      status: formData.status,
      imageFile: imageFile,
    };

    await onAdd(dataToSubmit);
  };

  const formatValue = (type, value) => {
    if (type === "percentage") {
      return `${value}%`;
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          aria-hidden="true"
        ></div>

        {/* Center modal */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal panel */}
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Gift className="h-6 w-6 mr-2" />
                Tạo khuyến mãi mới
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                disabled={isLoading}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5 max-h-[calc(100vh-300px)] overflow-y-auto">
              <div className="space-y-5">
                {/* Image Upload */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <Upload className="h-4 w-4 mr-2 text-gray-500" />
                    Hình ảnh khuyến mãi{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </label>

                  {imagePreview ? (
                    <div className="space-y-3">
                      <div className="relative group">
                        <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                            <label className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="bg-white rounded-lg px-4 py-2 flex items-center space-x-2 shadow-lg hover:bg-gray-50 transition-colors">
                                <Upload className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">
                                  Thay đổi ảnh
                                </span>
                              </div>
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                          errors.image
                            ? "border-red-300 bg-red-50 hover:border-red-400"
                            : "border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50"
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center ${
                              errors.image ? "bg-red-100" : "bg-blue-100"
                            }`}
                          >
                            <Upload
                              className={`h-8 w-8 ${
                                errors.image ? "text-red-500" : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="text-base font-medium text-gray-700 mb-1">
                              Tải ảnh lên
                            </p>
                            <p className="text-sm text-gray-500">
                              Click hoặc kéo thả file vào đây
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span className="bg-white px-2 py-1 rounded border border-gray-200">
                              JPG
                            </span>
                            <span className="bg-white px-2 py-1 rounded border border-gray-200">
                              PNG
                            </span>
                            <span className="bg-white px-2 py-1 rounded border border-gray-200">
                              GIF
                            </span>
                            <span className="bg-white px-2 py-1 rounded border border-gray-200">
                              WEBP
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">
                            Kích thước tối đa: 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                    </label>
                  )}
                  {errors.image && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg mt-2">
                      <XCircle className="h-4 w-4" />
                      <span>{errors.image}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                      errors.description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="Nhập mô tả khuyến mãi..."
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại giảm giá <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">Phần trăm (%)</option>
                      <option value="fixed">Số tiền cố định (VNĐ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá trị <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="discountValue"
                        value={formData.discountValue}
                        onChange={handleChange}
                        min="0"
                        max={
                          formData.discountType === "percentage"
                            ? "100"
                            : undefined
                        }
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.discountValue
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        placeholder={
                          formData.discountType === "percentage"
                            ? "Nhập % (0-100)"
                            : "Nhập số tiền"
                        }
                      />
                      {formData.discountType === "percentage" ? (
                        <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      ) : (
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          đ
                        </span>
                      )}
                    </div>
                    {formData.discountValue > 0 && (
                      <p className="text-xs text-blue-600 mt-1">
                        Giảm:{" "}
                        {formatValue(
                          formData.discountType,
                          formData.discountValue
                        )}
                      </p>
                    )}
                    {errors.discountValue && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.discountValue}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Ngày bắt đầu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.startDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    {errors.startDate && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Ngày kết thúc <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={formData.startDate}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.endDate
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    {errors.endDate && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Advanced Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số ngày đặt trước tối thiểu
                    </label>
                    <input
                      type="number"
                      name="minBookedDays"
                      value={formData.minBookedDays}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.minBookedDays
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    {errors.minBookedDays && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.minBookedDays}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số đêm tối thiểu
                    </label>
                    <input
                      type="number"
                      name="minNights"
                      value={formData.minNights}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.minNights
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                    />
                    {errors.minNights && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.minNights}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.quantity
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Nhập số lượng"
                    />
                    {errors.quantity && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.quantity}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá trị đặt phòng tối thiểu (VNĐ)
                    </label>
                    <input
                      type="number"
                      name="minValue"
                      value={formData.minValue}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.minValue
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Nhập giá trị tối thiểu"
                    />
                    {errors.minValue && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.minValue}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status & New Customer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Tạm dừng</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-8">
                    <input
                      type="checkbox"
                      id="isForNewCustomer"
                      name="isForNewCustomer"
                      checked={formData.isForNewCustomer}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="isForNewCustomer"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      Chỉ dành cho khách hàng mới
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
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
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Gift className="h-4 w-4 mr-2" />
                    Tạo khuyến mãi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromotionCreateModal;
