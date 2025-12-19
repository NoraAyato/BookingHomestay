import React, { useState, useEffect } from "react";
import { X, Upload, ImageIcon, DoorOpen } from "lucide-react";
import { useAmenities } from "../../../hooks/useAmenities";
import { getRoomTypes } from "../../../api/host/rooms";

const CreateRoomModal = ({
  isOpen,
  onClose,
  homestaysSelectList,
  onSubmit,
}) => {
  const { amenities, loading: amenitiesLoading } = useAmenities();
  const [roomTypes, setRoomTypes] = useState([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    roomTypeId: "",
    capacity: "",
    status: "Active",
    price: "",
    homestayId: "",
    amenitiesIds: [],
    images: [],
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Image previews
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch room types on mount
  useEffect(() => {
    const fetchRoomTypes = async () => {
      setLoadingRoomTypes(true);
      try {
        const response = await getRoomTypes();
        if (response?.success) {
          setRoomTypes(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching room types:", error);
      } finally {
        setLoadingRoomTypes(false);
      }
    };

    if (isOpen) {
      fetchRoomTypes();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        roomTypeId: "",
        capacity: "",
        status: "Active",
        price: "",
        homestayId: "",
        amenitiesIds: [],
        images: [],
      });
      setErrors({});
      setImagePreviews([]);
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

  const handleAmenityToggle = (amenityId) => {
    setFormData((prev) => ({
      ...prev,
      amenitiesIds: prev.amenitiesIds.includes(amenityId)
        ? prev.amenitiesIds.filter((id) => id !== amenityId)
        : [...prev.amenitiesIds, amenityId],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate max 3 images
    if (files.length + formData.images.length > 3) {
      setErrors((prev) => ({
        ...prev,
        images: "Tối đa 3 hình ảnh",
      }));
      return;
    }

    // Validate file types
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      setErrors((prev) => ({
        ...prev,
        images: "Chỉ chấp nhận file JPG, JPEG, PNG, WEBP",
      }));
      return;
    }

    // Add images
    const newImages = [...formData.images, ...files];
    setFormData((prev) => ({ ...prev, images: newImages }));

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Clear errors
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const handleRemoveImage = (index) => {
    // Revoke URL to prevent memory leak
    URL.revokeObjectURL(imagePreviews[index]);

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên phòng là bắt buộc";
    } else if (formData.name.length > 100) {
      newErrors.name = "Tên phòng không được quá 100 ký tự";
    }

    if (!formData.homestayId) {
      newErrors.homestayId = "Vui lòng chọn homestay";
    }

    if (!formData.roomTypeId) {
      newErrors.roomTypeId = "Vui lòng chọn loại phòng";
    }

    if (!formData.capacity) {
      newErrors.capacity = "Sức chứa là bắt buộc";
    } else if (formData.capacity < 1 || formData.capacity > 50) {
      newErrors.capacity = "Sức chứa phải từ 1 đến 50 người";
    }

    if (!formData.price) {
      newErrors.price = "Giá phòng là bắt buộc";
    } else if (formData.price < 0) {
      newErrors.price = "Giá phòng phải lớn hơn 0";
    }

    if (formData.images.length === 0) {
      newErrors.images = "Vui lòng chọn ít nhất 1 hình ảnh";
    }

    if (formData.amenitiesIds.length === 0) {
      newErrors.amenitiesIds = "Vui lòng chọn ít nhất 1 tiện nghi";
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

    // Tạo FormData theo chuẩn @RequestPart
    const submitData = new FormData();

    // Thêm part "room" dưới dạng JSON blob (không bao gồm images)
    const roomData = {
      name: formData.name.trim(),
      roomTypeId: formData.roomTypeId,
      capacity: parseInt(formData.capacity),
      status: formData.status,
      price: parseInt(formData.price),
      homestayId: formData.homestayId,
    };
    submitData.append(
      "room",
      new Blob([JSON.stringify(roomData)], { type: "application/json" })
    );

    // Thêm part "amenitiesIds" dưới dạng JSON blob
    submitData.append(
      "amenitiesIds",
      new Blob([JSON.stringify(formData.amenitiesIds)], {
        type: "application/json",
      })
    );

    // Thêm part "images" - các file riêng
    formData.images.forEach((image) => {
      submitData.append("images", image);
    });

    try {
      await onSubmit(submitData);
      // Clean up previews
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      onClose();
    } catch (error) {
      console.error("Error creating room:", error);
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
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <DoorOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Thêm phòng mới
                  </h3>
                  <p className="text-sm text-blue-100 mt-0.5">
                    Điền thông tin chi tiết phòng
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Homestay Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Homestay <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="homestayId"
                    value={formData.homestayId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.homestayId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">-- Chọn homestay --</option>
                    {homestaysSelectList.map((homestay) => (
                      <option key={homestay.id} value={homestay.id}>
                        {homestay.homestayName}
                      </option>
                    ))}
                  </select>
                  {errors.homestayId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.homestayId}
                    </p>
                  )}
                </div>

                {/* Room Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên phòng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="VD: Phòng Deluxe 101"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Room Type and Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Loại phòng <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="roomTypeId"
                      value={formData.roomTypeId}
                      onChange={handleInputChange}
                      disabled={loadingRoomTypes}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.roomTypeId ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">
                        {loadingRoomTypes ? "Đang tải..." : "-- Chọn loại --"}
                      </option>
                      {roomTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {errors.roomTypeId && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.roomTypeId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sức chứa <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      min="1"
                      max="50"
                      placeholder="VD: 2"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.capacity ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.capacity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.capacity}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Giá phòng (VND) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      placeholder="VD: 500000"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="Active">Đang hoạt động</option>
                      <option value="Inactive">Ngừng hoạt động</option>
                    </select>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tiện nghi
                  </label>
                  {amenitiesLoading ? (
                    <div className="text-sm text-gray-500">Đang tải...</div>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                      <div className="grid grid-cols-1 gap-3">
                        {amenities.map((amenity) => (
                          <label
                            key={amenity.id}
                            className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-all"
                          >
                            <input
                              type="checkbox"
                              checked={formData.amenitiesIds.includes(
                                amenity.id
                              )}
                              onChange={() => handleAmenityToggle(amenity.id)}
                              className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                            />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-700 block">
                                {amenity.name}
                              </span>
                              {amenity.description && (
                                <span className="text-xs text-gray-500 mt-1 block">
                                  {amenity.description}
                                </span>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Images Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hình ảnh (Tối đa 3) <span className="text-red-500">*</span>
                  </label>

                  {/* Image previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  {formData.images.length < 3 && (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold text-blue-600">
                            Click để tải ảnh
                          </span>{" "}
                          hoặc kéo thả
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, WEBP (Max 3 ảnh)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}

                  {errors.images && (
                    <p className="text-red-500 text-xs mt-2">{errors.images}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
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
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <DoorOpen className="h-5 w-5" />
                    Thêm phòng
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

export default CreateRoomModal;
