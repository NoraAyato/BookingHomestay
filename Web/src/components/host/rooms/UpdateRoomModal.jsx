import React, { useState, useEffect } from "react";
import { X, Upload, ImageIcon, DoorOpen } from "lucide-react";
import { useAmenities } from "../../../hooks/useAmenities";
import { getRoomTypes } from "../../../api/host/rooms";
import { getImageUrl } from "../../../utils/imageUrl";
import SearchableDropdown from "../../common/SearchableDropdown";
const UpdateRoomModal = ({
  isOpen,
  onClose,
  homestaysSelectList,
  onSubmit,
  room,
}) => {
  const { amenities, loading: amenitiesLoading } = useAmenities();
  const [roomTypes, setRoomTypes] = useState([]);
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    roomName: "",
    status: "",
    RoomTypeId: "",
    capacity: "",
    pricePerNight: "",
    homestayId: "",
    amenitiesIds: [],
    images: [],
    existingImages: [],
  });

  // Track initial data for comparison
  const [initialData, setInitialData] = useState(null);

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

  // Load room data when modal opens
  useEffect(() => {
    if (isOpen && room) {
      const homestayId = room.homestayId || room.homestay?.id || "";
      const roomData = {
        roomName: room.name || "",
        status: room.status || "AVAILABLE",
        RoomTypeId: room.roomType?.id || room.roomTypeId || "",
        capacity: room.capacity || "",
        pricePerNight: room.price || "",
        homestayId: homestayId,
        amenitiesIds: room.amenities?.map((a) => a.id) || [],
        images: [],
        existingImages: room.images || [],
      };
      setFormData(roomData);
      // Save initial data for comparison
      setInitialData({
        roomName: roomData.roomName,
        status: roomData.status,
        RoomTypeId: roomData.RoomTypeId,
        capacity: roomData.capacity,
        pricePerNight: roomData.pricePerNight,
        amenitiesIds: [...roomData.amenitiesIds],
        existingImages: [...roomData.existingImages],
      });
      setImagePreviews([]);
      setErrors({});
    }
  }, [isOpen, room]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        roomName: "",
        status: "",
        RoomTypeId: "",
        capacity: "",
        pricePerNight: "",
        homestayId: "",
        amenitiesIds: [],
        images: [],
        existingImages: [],
      });
      setInitialData(null);
      setImagePreviews([]);
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Validate max 3 images total (existing + new)
    const totalImages =
      formData.existingImages.length + formData.images.length + files.length;
    if (totalImages > 3) {
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

    // Create previews for new images
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const handleRemoveNewImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  };

  // Check if form has changes
  const hasChanges = () => {
    if (!initialData) return false;

    // Check basic fields
    if (
      formData.roomName !== initialData.roomName ||
      formData.status !== initialData.status ||
      formData.RoomTypeId !== initialData.RoomTypeId ||
      formData.capacity !== initialData.capacity ||
      formData.pricePerNight !== initialData.pricePerNight
    ) {
      return true;
    }

    // Check amenities
    if (formData.amenitiesIds.length !== initialData.amenitiesIds.length) {
      return true;
    }
    const sortedCurrent = [...formData.amenitiesIds].sort();
    const sortedInitial = [...initialData.amenitiesIds].sort();
    if (sortedCurrent.some((id, idx) => id !== sortedInitial[idx])) {
      return true;
    }

    // Check images
    if (formData.images.length > 0) {
      return true;
    }
    if (formData.existingImages.length !== initialData.existingImages.length) {
      return true;
    }
    if (
      formData.existingImages.some(
        (img, idx) => img !== initialData.existingImages[idx]
      )
    ) {
      return true;
    }

    return false;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.roomName.trim()) {
      newErrors.roomName = "Tên phòng là bắt buộc";
    } else if (formData.roomName.length > 100) {
      newErrors.roomName = "Tên phòng không được quá 100 ký tự";
    }

    if (!formData.RoomTypeId) {
      newErrors.RoomTypeId = "Vui lòng chọn loại phòng";
    }

    if (!formData.capacity) {
      newErrors.capacity = "Sức chứa là bắt buộc";
    } else if (formData.capacity < 1 || formData.capacity > 50) {
      newErrors.capacity = "Sức chứa phải từ 1 đến 50 người";
    }

    if (!formData.pricePerNight) {
      newErrors.pricePerNight = "Giá phòng là bắt buộc";
    } else if (formData.pricePerNight < 0) {
      newErrors.pricePerNight = "Giá phòng phải lớn hơn 0";
    }

    if (!formData.status) {
      newErrors.status = "Trạng thái là bắt buộc";
    }

    const totalImages = formData.existingImages.length + formData.images.length;
    if (totalImages === 0) {
      newErrors.images = "Vui lòng chọn ít nhất 1 hình ảnh";
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

    // Thêm part "room" dưới dạng JSON blob
    const roomData = {
      roomName: formData.roomName.trim(),
      status: formData.status,
      pricePerNight: parseInt(formData.pricePerNight),
      capacity: parseInt(formData.capacity),
      RoomTypeId: formData.RoomTypeId,
      homestayId: formData.homestayId,
    };
    submitData.append(
      "room",
      new Blob([JSON.stringify(roomData)], { type: "application/json" })
    );

    // Thêm part "amenitiesIds" dưới dạng JSON blob (nếu có)
    if (formData.amenitiesIds.length > 0) {
      submitData.append(
        "amenitiesIds",
        new Blob([JSON.stringify(formData.amenitiesIds)], {
          type: "application/json",
        })
      );
    }

    // Thêm part "images" - các file mới (nếu có)
    if (formData.images.length > 0) {
      formData.images.forEach((image) => {
        submitData.append("images", image);
      });
    }

    try {
      await onSubmit(room.id, submitData);
      // Clean up previews
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
      onClose();
    } catch (error) {
      console.error("Error updating room:", error);
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
                    Cập Nhật Phòng
                  </h3>
                  <p className="text-sm text-blue-100 mt-0.5">
                    Chỉnh sửa thông tin phòng
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-5 max-h-[calc(100vh-240px)] overflow-y-auto">
              <div className="space-y-5">
                {/* Homestay - Read Only */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Homestay
                  </label>
                  <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                    {room?.homestay?.name ||
                      room?.homestayName ||
                      "Chưa xác định"}
                  </div>
                </div>

                {/* Room Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên Phòng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="roomName"
                    value={formData.roomName}
                    onChange={handleInputChange}
                    placeholder="VD: Phòng Deluxe 2 người"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.roomName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.roomName && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.roomName}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Trạng Thái <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.status ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="Active">Sẵn sàng</option>
                    <option value="Inactive">Bảo trì</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-xs mt-2">{errors.status}</p>
                  )}
                </div>

                {/* Room Type & Capacity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Loại Phòng <span className="text-red-500">*</span>
                    </label>
                    <SearchableDropdown
                      placeholder="Chọn loại phòng"
                      value={formData.RoomTypeId}
                      onChange={(value) =>
                        handleInputChange({
                          target: { name: "RoomTypeId", value },
                        })
                      }
                      options={roomTypes.map((type) => ({
                        id: type.id,
                        label: type.name,
                        subtitle: type.description,
                      }))}
                      loading={loadingRoomTypes}
                      emptyLabel="Chưa chọn loại phòng"
                      searchPlaceholder="Tìm loại phòng..."
                      allowEmpty={false}
                    />
                    {errors.RoomTypeId && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.RoomTypeId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sức Chứa (Người) <span className="text-red-500">*</span>
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
                      <p className="text-red-500 text-xs mt-2">
                        {errors.capacity}
                      </p>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Giá Phòng (VNĐ/đêm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    placeholder="VD: 500000"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.pricePerNight
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.pricePerNight && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.pricePerNight}
                    </p>
                  )}
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Tiện Nghi
                  </label>
                  <div className="border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-3">
                      {amenitiesLoading ? (
                        <p className="text-gray-500 text-sm">
                          Đang tải tiện nghi...
                        </p>
                      ) : (
                        amenities.map((amenity) => (
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
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Images Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Hình Ảnh Phòng <span className="text-red-500">*</span>
                    <span className="text-gray-500 font-normal text-xs ml-2">
                      (Tối đa 3 ảnh)
                    </span>
                  </label>

                  {/* Existing Images */}
                  {formData.existingImages.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 mb-2">
                        Ảnh hiện tại:
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {formData.existingImages.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={getImageUrl(imageUrl)}
                              alt={`Existing ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExistingImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images Preview */}
                  {imagePreviews.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 mb-2">Ảnh mới:</p>
                      <div className="grid grid-cols-3 gap-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-blue-300"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveNewImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  {formData.existingImages.length + formData.images.length <
                    3 && (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold text-blue-600">
                            Click để tải ảnh
                          </span>{" "}
                          hoặc kéo thả
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, WEBP (Tối đa 3 ảnh)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
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
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !hasChanges()}
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang cập nhật...</span>
                  </>
                ) : (
                  <>
                    <DoorOpen className="h-4 w-4" />
                    <span>Cập Nhật Phòng</span>
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

export default UpdateRoomModal;
