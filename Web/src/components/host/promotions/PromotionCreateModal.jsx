import React, { useState } from "react";
import {
  X,
  Gift,
  Percent,
  Calendar,
  Moon,
  Clock,
  UserCheck,
  Upload,
  Search,
  CheckSquare,
  Square,
} from "lucide-react";

const PromotionCreateModal = ({
  isOpen,
  onClose,
  onAdd,
  isLoading,
  homestays = [],
  homestaysLoading = false,
}) => {
  const [formData, setFormData] = useState({
    description: "",
    type: "percentage",
    value: "",
    minBookingAmount: "",
    minNights: "",
    bookedTimes: "",
    forNewCustomer: false,
    startDate: "",
    endDate: "",
    usageLimit: "",
    status: "active",
    applicableHomestays: [],
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [homestaySearch, setHomestaySearch] = useState("");

  const [errors, setErrors] = useState({});

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({
        description: "",
        type: "percentage",
        value: "",
        minBookingAmount: "",
        minNights: "",
        bookedTimes: "",
        forNewCustomer: false,
        startDate: "",
        endDate: "",
        usageLimit: "",
        status: "active",
        applicableHomestays: [],
        image: null,
      });
      setImagePreview(null);
      setHomestaySearch("");
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
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Vui lòng chọn file hình ảnh",
        }));
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Kích thước ảnh không được vượt quá 5MB",
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleHomestayChange = (homestayId) => {
    setFormData((prev) => {
      const isSelected = prev.applicableHomestays.includes(homestayId);
      return {
        ...prev,
        applicableHomestays: isSelected
          ? prev.applicableHomestays.filter((id) => id !== homestayId)
          : [...prev.applicableHomestays, homestayId],
      };
    });
  };

  const handleSelectAll = () => {
    const filtered = homestays.filter((h) => {
      const name = h.homestayName || h.name || "";
      return name.toLowerCase().includes(homestaySearch.toLowerCase());
    });
    const filteredIds = filtered.map((h) => h.id);
    const allSelected = filteredIds.every((id) =>
      formData.applicableHomestays.includes(id)
    );

    if (allSelected) {
      // Deselect all filtered
      setFormData((prev) => ({
        ...prev,
        applicableHomestays: prev.applicableHomestays.filter(
          (id) => !filteredIds.includes(id)
        ),
      }));
    } else {
      // Select all filtered
      setFormData((prev) => ({
        ...prev,
        applicableHomestays: [
          ...new Set([...prev.applicableHomestays, ...filteredIds]),
        ],
      }));
    }
  };

  // Filter homestays by search
  const filteredHomestays = homestays.filter((h) => {
    const name = h.homestayName || h.name || "";
    return name.toLowerCase().includes(homestaySearch.toLowerCase());
  });

  const allFilteredSelected =
    filteredHomestays.length > 0 &&
    filteredHomestays.every((h) => formData.applicableHomestays.includes(h.id));

  const validateForm = () => {
    const newErrors = {};

    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Giá trị phải lớn hơn 0";
    }

    if (formData.type === "percentage" && formData.value > 100) {
      newErrors.value = "Phần trăm không được vượt quá 100%";
    }

    if (!formData.minBookingAmount || formData.minBookingAmount < 0) {
      newErrors.minBookingAmount = "Vui lòng nhập giá trị tối thiểu";
    }

    if (formData.minNights && formData.minNights < 0) {
      newErrors.minNights = "Số đêm tối thiểu phải lớn hơn hoặc bằng 0";
    }

    if (formData.bookedTimes && formData.bookedTimes < 0) {
      newErrors.bookedTimes = "Số ngày đặt trước phải lớn hơn hoặc bằng 0";
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

    if (!formData.usageLimit || formData.usageLimit <= 0) {
      newErrors.usageLimit = "Giới hạn sử dụng phải lớn hơn 0";
    }

    if (formData.applicableHomestays.length === 0) {
      newErrors.applicableHomestays = "Vui lòng chọn ít nhất một homestay";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Map frontend form data to backend DTO structure
    const promotionData = {
      description: formData.description || "",
      discountType: formData.type, // "percentage" or "fixed"
      discountValue: formData.value.toString(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      minBookedDays: formData.bookedTimes
        ? formData.bookedTimes.toString()
        : "0",
      minNights: formData.minNights ? formData.minNights.toString() : "0",
      minValue: formData.minBookingAmount
        ? formData.minBookingAmount.toString()
        : "0",
      quantity: formData.usageLimit ? formData.usageLimit.toString() : "0",
      status: formData.status, // "active" or "inactive"
      isForNewCustomer: formData.forNewCustomer ? "true" : "false",
      imageFile: formData.image,
      homestayIds:
        formData.applicableHomestays.length > 0
          ? formData.applicableHomestays
          : null,
    };

    await onAdd(promotionData);
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Upload className="h-4 w-4 inline mr-1" />
                    Hình ảnh khuyến mãi
                  </label>
                  <div className="flex items-start gap-4">
                    {imagePreview ? (
                      <div className="relative w-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="w-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Nhấn để chọn ảnh
                        </span>
                        <span className="text-xs text-gray-400 mt-1">
                          PNG, JPG (tối đa 5MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {errors.image && (
                    <p className="text-xs text-red-500 mt-1">{errors.image}</p>
                  )}
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
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                      errors.description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="Mô tả chi tiết về khuyến mãi..."
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
                      name="type"
                      value={formData.type}
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
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        min="0"
                        max={formData.type === "percentage" ? "100" : undefined}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.value
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        placeholder={
                          formData.type === "percentage"
                            ? "Nhập % (0-100)"
                            : "Nhập số tiền"
                        }
                      />
                      {formData.type === "percentage" ? (
                        <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      ) : (
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          đ
                        </span>
                      )}
                    </div>
                    {formData.value > 0 && (
                      <p className="text-xs text-blue-600 mt-1">
                        Giảm: {formatValue(formData.type, formData.value)}
                      </p>
                    )}
                    {errors.value && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.value}
                      </p>
                    )}
                  </div>
                </div>

                {/* Min Booking Amount & Min Nights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá trị đơn tối thiểu (VNĐ){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="minBookingAmount"
                      value={formData.minBookingAmount}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.minBookingAmount
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Nhập giá trị tối thiểu"
                    />
                    {errors.minBookingAmount && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.minBookingAmount}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Moon className="h-4 w-4 inline mr-1" />
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
                      placeholder="VD: 2"
                    />
                    {errors.minNights && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.minNights}
                      </p>
                    )}
                  </div>
                </div>

                {/* Booked Times & For New Customer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Số ngày đặt trước
                    </label>
                    <input
                      type="number"
                      name="bookedTimes"
                      value={formData.bookedTimes}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.bookedTimes
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="VD: 7"
                    />
                    {errors.bookedTimes && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.bookedTimes}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <UserCheck className="h-4 w-4 inline mr-1" />
                      Khách hàng mới
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded border border-gray-300">
                      <input
                        type="checkbox"
                        name="forNewCustomer"
                        checked={formData.forNewCustomer}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Chỉ áp dụng cho khách hàng mới
                      </span>
                    </label>
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

                {/* Usage Limit & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới hạn sử dụng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.usageLimit
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      placeholder="Nhập số lượng"
                    />
                    {errors.usageLimit && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.usageLimit}
                      </p>
                    )}
                  </div>

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
                </div>

                {/* Applicable Homestays */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Áp dụng cho homestay <span className="text-red-500">*</span>
                  </label>

                  {/* Counter and Select All */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-sm text-gray-600 font-medium">
                      Đã chọn:{" "}
                      <span className="text-blue-600 font-bold">
                        {formData.applicableHomestays.length}
                      </span>
                      /{homestays.length}
                    </span>
                    {homestays.length > 0 && (
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
                      >
                        {allFilteredSelected ? (
                          <>
                            <Square className="h-4 w-4" />
                            <span>
                              Bỏ chọn {homestaySearch ? "kết quả" : "tất cả"}
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckSquare className="h-4 w-4" />
                            <span>
                              Chọn {homestaySearch ? "kết quả" : "tất cả"}
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Search Box */}
                  {homestays.length > 3 && (
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm homestay..."
                        value={homestaySearch}
                        onChange={(e) => setHomestaySearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {homestaySearch && (
                        <button
                          type="button"
                          onClick={() => setHomestaySearch("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Homestay List */}
                  <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                    {homestaysLoading ? (
                      <p className="text-sm text-gray-500">
                        Đang tải danh sách homestay...
                      </p>
                    ) : filteredHomestays.length > 0 ? (
                      <div className="space-y-2">
                        {filteredHomestays.map((homestay) => (
                          <label
                            key={homestay.id}
                            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.applicableHomestays.includes(
                                homestay.id
                              )}
                              onChange={() => handleHomestayChange(homestay.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">
                              {homestay.homestayName || homestay.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : homestaySearch ? (
                      <p className="text-sm text-gray-500 text-center py-2">
                        Không tìm thấy homestay phù hợp
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Chưa có homestay nào
                      </p>
                    )}
                  </div>
                  {errors.applicableHomestays && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.applicableHomestays}
                    </p>
                  )}
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
