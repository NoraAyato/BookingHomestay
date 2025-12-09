import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  Image as ImageIcon,
  FileText,
  Calendar,
  Moon,
  UserPlus,
  Package,
  DollarSign,
  Upload,
  XCircle,
  Percent,
  Gift,
} from "lucide-react";

const PromotionUpdateModal = ({
  promotion,
  isOpen,
  onClose,
  onUpdate,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    image: "",
    description: "",
    type: "percentage",
    value: 0,
    startDate: "",
    endDate: "",
    advanceBookingDays: 0,
    minNights: 0,
    newCustomerOnly: false,
    usageLimit: 0,
    minBookingValue: 0,
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Initialize form data when promotion changes
  useEffect(() => {
    if (promotion) {
      setFormData({
        image: promotion.image || "",
        description: promotion.description || "",
        // Backend trả về: type, value, usageLimit, minBookingValue, bookedTimes
        type: promotion.type || promotion.discountType || "percentage",
        value: promotion.value || promotion.discountValue || 0,
        startDate: promotion.startDate || "",
        endDate: promotion.endDate || "",
        advanceBookingDays:
          promotion.bookedTimes || promotion.minBookedDays || 0,
        minNights: promotion.minNights || 0,
        newCustomerOnly: promotion.isForNewCustomer || false,
        usageLimit: promotion.usageLimit || promotion.quantity || 0,
        minBookingValue: promotion.minBookingValue || promotion.minValue || 0,
        status: promotion.status || "active",
      });
      setImagePreview(promotion.image || "");
    }
  }, [promotion]);

  if (!isOpen || !promotion) return null;

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả";
    }

    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Giá trị chiết khấu phải lớn hơn 0";
    }

    if (formData.value < 0) {
      newErrors.value = "Giá trị chiết khấu không được âm";
    }

    if (formData.type === "percentage" && formData.value > 100) {
      newErrors.value = "Phần trăm chiết khấu không được vượt quá 100%";
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

    if (formData.advanceBookingDays < 0) {
      newErrors.advanceBookingDays = "Số ngày đặt trước không được âm";
    }

    if (formData.minNights < 0) {
      newErrors.minNights = "Số đêm tối thiểu không được âm";
    }

    if (formData.usageLimit < 0) {
      newErrors.usageLimit = "Số lượng không được âm";
    }

    if (formData.minBookingValue < 0) {
      newErrors.minBookingValue = "Giá trị tối thiểu không được âm";
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
      discountType: formData.type,
      discountValue: Number(formData.value),
      startDate: formData.startDate,
      endDate: formData.endDate,
      minBookedDays: Number(formData.advanceBookingDays),
      minNights: Number(formData.minNights),
      isForNewCustomer: formData.newCustomerOnly,
      quantity: Number(formData.usageLimit),
      minValue: Number(formData.minBookingValue),
      status: formData.status,
      imageFile: imageFile, // Pass file directly
    };

    await onUpdate(promotion.id, dataToSubmit);
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
              <h3 className="text-xl font-bold text-white">
                Cập nhật khuyến mãi
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                disabled={isLoading}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-blue-100 text-sm mt-1">
              {promotion.name} - {promotion.code}
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5 max-h-[calc(100vh-300px)] overflow-y-auto">
              <div className="space-y-5">
                {/* Image Upload */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
                    Hình ảnh khuyến mãi
                  </label>

                  {/* Current Image Display */}
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
                          {imageFile && (
                            <div className="absolute top-3 right-3">
                              <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <span>Ảnh mới</span>
                              </span>
                            </div>
                          )}
                        </div>
                        {imageFile && (
                          <div className="flex items-center justify-between text-xs text-gray-600 mt-2 px-2">
                            <span className="flex items-center space-x-1">
                              <ImageIcon className="h-3 w-3" />
                              <span className="font-medium">
                                {imageFile.name}
                              </span>
                            </span>
                            <span className="text-gray-500">
                              {(imageFile.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        )}
                      </div>
                      {errors.image && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                          <XCircle className="h-4 w-4" />
                          <span>{errors.image}</span>
                        </div>
                      )}
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
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  {errors.image && !imagePreview && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg mt-2">
                      <XCircle className="h-4 w-4" />
                      <span>{errors.image}</span>
                    </div>
                  )}
                </div>

                {/* Discount Type and Value */}
                <div className="space-y-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-5">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <Gift className="h-4 w-4 mr-2 text-purple-600" />
                    Loại & Giá trị chiết khấu
                  </label>

                  {/* Type Toggle */}
                  <div className="flex space-x-3 mb-4">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          type: "percentage",
                          value: prev.type === "fixed" ? 0 : prev.value,
                        }));
                      }}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.type === "percentage"
                          ? "border-purple-500 bg-purple-100 text-purple-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Percent className="h-5 w-5" />
                        <span className="font-medium">Phần trăm</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          type: "fixed",
                          value: prev.type === "percentage" ? 0 : prev.value,
                        }));
                      }}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.type === "fixed"
                          ? "border-orange-500 bg-orange-100 text-orange-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <DollarSign className="h-5 w-5" />
                        <span className="font-medium">Cố định</span>
                      </div>
                    </button>
                  </div>

                  {/* Value Input */}
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block">
                      {formData.type === "percentage"
                        ? "Phần trăm giảm giá"
                        : "Số tiền giảm (VNĐ)"}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="value"
                        value={formData.value}
                        onChange={(e) => {
                          const val =
                            e.target.value === "" ? "" : Number(e.target.value);
                          if (val === "" || val >= 0) {
                            setFormData((prev) => ({ ...prev, value: val }));
                            if (errors.value) {
                              setErrors((prev) => ({ ...prev, value: "" }));
                            }
                          }
                        }}
                        min="0"
                        max={formData.type === "percentage" ? "100" : undefined}
                        step={formData.type === "percentage" ? "1" : "1000"}
                        className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg font-semibold ${
                          errors.value ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder={
                          formData.type === "percentage" ? "0-100" : "0"
                        }
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <span
                          className={`text-lg font-bold ${
                            formData.type === "percentage"
                              ? "text-purple-600"
                              : "text-orange-600"
                          }`}
                        >
                          {formData.type === "percentage" ? "%" : "VNĐ"}
                        </span>
                      </div>
                    </div>
                    {errors.value && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm mt-2">
                        <XCircle className="h-4 w-4" />
                        <span>{errors.value}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-600 mt-2">
                      {formData.type === "percentage"
                        ? "Nhập giá trị từ 0-100%"
                        : "Số tiền sẽ được trừ trực tiếp vào tổng giá trị đơn hàng"}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    Mô tả *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Nhập mô tả chi tiết về khuyến mãi..."
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Date Range */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    Thời gian áp dụng khuyến mãi
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block font-medium">
                        Ngày bắt đầu *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }));
                          if (errors.startDate) {
                            setErrors((prev) => ({ ...prev, startDate: "" }));
                          }
                        }}
                        className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.startDate
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.startDate && (
                        <div className="flex items-center space-x-2 text-red-600 text-xs mt-1">
                          <XCircle className="h-3 w-3" />
                          <span>{errors.startDate}</span>
                        </div>
                      )}
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block font-medium">
                        Ngày kết thúc *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }));
                          if (errors.endDate) {
                            setErrors((prev) => ({ ...prev, endDate: "" }));
                          }
                        }}
                        min={formData.startDate}
                        className={`w-full px-4 py-2.5 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.endDate ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.endDate && (
                        <div className="flex items-center space-x-2 text-red-600 text-xs mt-1">
                          <XCircle className="h-3 w-3" />
                          <span>{errors.endDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    Khuyến mãi chỉ có hiệu lực trong khoảng thời gian này
                  </p>
                </div>

                {/* Grid for numeric fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Advance Booking Days */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      Số ngày đặt trước
                    </label>
                    <input
                      type="number"
                      name="advanceBookingDays"
                      value={formData.advanceBookingDays}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.advanceBookingDays
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.advanceBookingDays && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.advanceBookingDays}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Số ngày khách phải đặt trước để áp dụng
                    </p>
                  </div>

                  {/* Minimum Nights */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Moon className="h-4 w-4 mr-2 text-gray-500" />
                      Số đêm tối thiểu
                    </label>
                    <input
                      type="number"
                      name="minNights"
                      value={formData.minNights}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.minNights ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.minNights && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.minNights}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Số đêm tối thiểu để áp dụng khuyến mãi
                    </p>
                  </div>

                  {/* Usage Limit */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Package className="h-4 w-4 mr-2 text-gray-500" />
                      Số lượng
                    </label>
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.usageLimit ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.usageLimit && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.usageLimit}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Giới hạn số lần sử dụng (0 = không giới hạn)
                    </p>
                  </div>

                  {/* Minimum Booking Value */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      Giá trị tối thiểu (VNĐ)
                    </label>
                    <input
                      type="number"
                      name="minBookingValue"
                      value={formData.minBookingValue}
                      onChange={handleChange}
                      min="0"
                      step="1000"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.minBookingValue
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.minBookingValue && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.minBookingValue}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Giá trị đơn hàng tối thiểu để áp dụng
                    </p>
                  </div>
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <Package className="h-4 w-4 mr-2 text-gray-500" />
                    Trạng thái khuyến mãi
                  </label>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, status: "active" }))
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.status === "active"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            formData.status === "active"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span className="font-medium">Đang hoạt động</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, status: "inactive" }))
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.status === "inactive"
                          ? "border-gray-500 bg-gray-50 text-gray-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            formData.status === "inactive"
                              ? "bg-gray-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <span className="font-medium">Tạm dừng</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* New Customer Only Checkbox */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="newCustomerOnly"
                      checked={formData.newCustomerOnly}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="flex items-center text-sm font-medium text-gray-900">
                        <UserPlus className="h-4 w-4 mr-2 text-blue-600" />
                        Chỉ áp dụng cho khách hàng mới
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Khuyến mãi chỉ dành cho khách hàng đặt lần đầu tiên
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Lưu thay đổi</span>
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

export default PromotionUpdateModal;
