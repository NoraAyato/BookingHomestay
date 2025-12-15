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
  Home,
  Search,
  CheckSquare,
  Square,
} from "lucide-react";
import { getImageUrl } from "../../../utils/imageUrl";

const PromotionUpdateModal = ({
  promotion,
  isOpen,
  onClose,
  onUpdate,
  isLoading,
  homestays = [],
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
    applicableHomestays: [],
  });

  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [homestaySearch, setHomestaySearch] = useState("");

  // Initialize form data when promotion changes
  useEffect(() => {
    if (promotion) {
      // Map applicableHomestays array to IDs only
      const homestayIds = Array.isArray(promotion.homestays)
        ? promotion.homestays.map((h) =>
            typeof h === "object" && h.id ? h.id : h
          )
        : [];

      const initialData = {
        image: promotion.image || "",
        description: promotion.description || "",
        type: promotion.type === "Percentage" ? "percentage" : "fixed",
        value: promotion.value || 0,
        startDate: promotion.startDate || "",
        endDate: promotion.endDate || "",
        advanceBookingDays: promotion.bookedTimes || 0,
        minNights: promotion.minNights || 0,
        newCustomerOnly: promotion.forNewCustomer || false,
        usageLimit: promotion.usageLimit || 0,
        minBookingValue: promotion.minBookingAmount || 0,
        status: promotion.status === "Active" ? "active" : "inactive",
        applicableHomestays: homestayIds,
      };
    
   
      setFormData(initialData);
      setOriginalData(initialData);
      setImagePreview(promotion.image ? getImageUrl(promotion.image) : "");
      setImageFile(null);
      setHomestaySearch("");
      setHasChanges(false);
    }
  }, [promotion]);

  // Track changes
  useEffect(() => {
    if (!originalData) return;

    const changed =
      Object.keys(formData).some((key) => {
        if (key === "applicableHomestays") {
          return (
            JSON.stringify(formData[key]) !== JSON.stringify(originalData[key])
          );
        }
        return formData[key] !== originalData[key];
      }) || imageFile !== null;

    setHasChanges(changed);
  }, [formData, originalData, imageFile]);

  if (!isOpen || !promotion) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(promotion.image ? getImageUrl(promotion.image) : "");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Giá trị chiết khấu phải lớn hơn 0";
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

    // Check if homestay list has changed
    const homestaysChanged =
      JSON.stringify(formData.applicableHomestays.sort()) !==
      JSON.stringify(originalData.applicableHomestays.sort());

    // Map frontend form data to backend DTO structure
    const updateData = {
      description: formData.description || "",
      discountType: formData.type, // "percentage" or "fixed"
      discountValue: formData.value.toString(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      minBookedDays: formData.advanceBookingDays
        ? formData.advanceBookingDays.toString()
        : "0",
      minNights: formData.minNights ? formData.minNights.toString() : "0",
      minValue: formData.minBookingValue
        ? formData.minBookingValue.toString()
        : "0",
      quantity: formData.usageLimit ? formData.usageLimit.toString() : "0",
      status: formData.status, // "active" or "inactive"
      isForNewCustomer: formData.newCustomerOnly ? "true" : "false",
      imageFile: imageFile, // null if no new image
      // Only send homestayIds if changed
      homestayIds: homestaysChanged
        ? formData.applicableHomestays.length > 0
          ? formData.applicableHomestays
          : []
        : undefined, // undefined = don't send this field
    };

    await onUpdate(promotion.id, updateData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75 backdrop-blur-sm"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Save className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Cập nhật khuyến mãi
                  </h3>
                  <p className="text-green-100 text-sm">
                    Chỉnh sửa thông tin khuyến mãi
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                disabled={isLoading}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="px-8 py-6 max-h-[calc(100vh-300px)] overflow-y-auto">
              <div className="space-y-6">
                {/* Image Upload */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <ImageIcon className="h-4 w-4 mr-2 text-gray-500" />
                    Hình ảnh khuyến mãi
                  </label>
                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-56 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/800x400?text=No+Image";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-3">
                        {imageFile && (
                          <button
                            type="button"
                            onClick={removeImage}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Hủy ảnh mới</span>
                          </button>
                        )}
                        <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center space-x-2">
                          <Upload className="h-4 w-4" />
                          <span>Đổi ảnh</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                        <Upload className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 font-medium mb-1">
                          Nhấn để chọn ảnh
                        </p>
                        <p className="text-gray-400 text-sm">
                          PNG, JPG, GIF, WEBP (tối đa 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  {errors.image && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm mt-2">
                      <XCircle className="h-4 w-4" />
                      <span>{errors.image}</span>
                    </div>
                  )}
                </div>

                {/* Discount Type and Value */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Type */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Gift className="h-4 w-4 mr-2 text-gray-500" />
                      Loại chiết khấu *
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            type: "percentage",
                          }));
                          setErrors((prev) => ({ ...prev, value: "" }));
                        }}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                          formData.type === "percentage"
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <Percent className="h-5 w-5 mx-auto mb-1" />
                        <div className="text-sm font-medium">Phần trăm</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, type: "fixed" }));
                          setErrors((prev) => ({ ...prev, value: "" }));
                        }}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                          formData.type === "fixed"
                            ? "border-orange-500 bg-orange-50 text-orange-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <DollarSign className="h-5 w-5 mx-auto mb-1" />
                        <div className="text-sm font-medium">Cố định</div>
                      </button>
                    </div>
                  </div>

                  {/* Value */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      Giá trị chiết khấu *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        min="0"
                        max={formData.type === "percentage" ? "100" : undefined}
                        step={formData.type === "percentage" ? "1" : "1000"}
                        className={`w-full px-4 py-3 pr-16 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-semibold ${
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
                    Mô tả
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
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block font-medium">
                        Ngày bắt đầu *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
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

                    <div>
                      <label className="text-sm text-gray-700 mb-2 block font-medium">
                        Ngày kết thúc *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
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
                </div>

                {/* Additional Conditions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.advanceBookingDays
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="VD: 7 ngày"
                    />
                    {errors.advanceBookingDays && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.advanceBookingDays}
                      </p>
                    )}
                  </div>

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
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.minNights ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="VD: 2 đêm"
                    />
                    {errors.minNights && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.minNights}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Package className="h-4 w-4 mr-2 text-gray-500" />
                      Số lượng khuyến mãi
                    </label>
                    <input
                      type="number"
                      name="usageLimit"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.usageLimit ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="VD: 100"
                    />
                    {errors.usageLimit && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.usageLimit}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      Giá trị đơn tối thiểu (VNĐ)
                    </label>
                    <input
                      type="number"
                      name="minBookingValue"
                      value={formData.minBookingValue}
                      onChange={handleChange}
                      min="0"
                      step="1000"
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.minBookingValue
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="VD: 500000"
                    />
                    {errors.minBookingValue && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.minBookingValue}
                      </p>
                    )}
                  </div>
                </div>

                {/* New Customer Only & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="newCustomerOnly"
                        checked={formData.newCustomerOnly}
                        onChange={handleChange}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <div className="ml-3">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <UserPlus className="h-4 w-4 mr-2 text-purple-600" />
                          Chỉ dành cho khách hàng mới
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          Khuyến mãi chỉ áp dụng cho khách đặt phòng lần đầu
                        </p>
                      </div>
                    </label>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Đang hoạt động</option>
                      <option value="inactive">Tạm dừng</option>
                    </select>
                  </div>
                </div>

                {/* Applicable Homestays */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <Home className="h-4 w-4 mr-2 text-gray-500" />
                    Áp dụng cho homestay{" "}
                    <span className="text-red-500 ml-1">*</span>
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
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
                  <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto bg-white">
                    {filteredHomestays.length > 0 ? (
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
                      <p className="text-sm text-gray-500 text-center py-4">
                        Không tìm thấy homestay phù hợp
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        Chưa có homestay nào
                      </p>
                    )}
                  </div>
                  {errors.applicableHomestays && (
                    <p className="text-xs text-red-500 mt-2">
                      {errors.applicableHomestays}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
                disabled={isLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium transition-colors"
                disabled={isLoading || !hasChanges}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    <span>Đang cập nhật...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>{hasChanges ? "Cập nhật" : "Không có thay đổi"}</span>
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
