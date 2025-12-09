import React, { useState, useEffect } from "react";
import { X, Upload, MapPin, User } from "lucide-react";
import { useLocationData } from "../../../hooks/useLocation";
import useAdminUsers from "../../../hooks/admin/useAdminUsers";
import SearchableDropdown from "../../common/SearchableDropdown";

const HomestayUpdateModal = ({ homestay, isOpen, onClose, onUpdate }) => {
  const { allLocations, loadingAll } = useLocationData();
  const { allUsers, loadingAllUsers, fetchAllUsers } = useAdminUsers();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    locationId: "",
    hostId: "",
    status: "active",
  });
  const [originalData, setOriginalData] = useState({
    name: "",
    address: "",
    description: "",
    locationId: "",
    hostId: "",
    status: "active",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all users when modal opens
  useEffect(() => {
    if (isOpen && allUsers.length === 0) {
      fetchAllUsers();
    }
  }, [isOpen, allUsers.length, fetchAllUsers]);

  useEffect(() => {
    if (homestay) {
      // Extract address from location string (before comma)
      let detectedAddress = homestay.address || "";
      if (!detectedAddress && homestay.location) {
        const locationParts = homestay.location.split(",");
        if (locationParts.length > 0) {
          detectedAddress = locationParts[0].trim();
        }
      }

      // Extract region from location string (after comma)
      let detectedLocationId = homestay.locationId || "";
      if (!detectedLocationId && homestay.location) {
        const locationParts = homestay.location.split(",");
        if (locationParts.length > 1) {
          const regionName = locationParts[locationParts.length - 1].trim();
          const matchedLocation = allLocations.find(
            (loc) => loc.tenKv.toLowerCase() === regionName.toLowerCase()
          );
          if (matchedLocation) {
            detectedLocationId = matchedLocation.maKv;
          }
        }
      }

      // Detect hostId from hostEmail ONLY
      let detectedHostId = "";
      if (homestay.hostEmail && allUsers.length > 0) {
        const matchedUser = allUsers.find((user) => {
          const match =
            user.email.toLowerCase() === homestay.hostEmail.toLowerCase();
          return match;
        });
        if (matchedUser) {
          detectedHostId = matchedUser.id;
        }
      }

      const initialData = {
        name: homestay.name || "",
        address: detectedAddress,
        description: homestay.description || "",
        locationId: detectedLocationId,
        hostId: detectedHostId,
        status: homestay.status || "active",
      };
      console.log("📝 Initial form data:", initialData);
      setFormData(initialData);
      setOriginalData(initialData);
      setImagePreview(homestay.image || "");
    }
  }, [homestay, allLocations, allUsers]);

  // Check if form has changes
  const hasChanges = () => {
    return (
      formData.name !== originalData.name ||
      formData.address !== originalData.address ||
      formData.description !== originalData.description ||
      formData.locationId !== originalData.locationId ||
      formData.hostId !== originalData.hostId ||
      formData.status !== originalData.status ||
      formData.imageFile !== undefined // New image selected
    );
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Prepare options for dropdowns
  const locationOptions = allLocations.map((location) => ({
    id: location.maKv,
    label: location.tenKv,
  }));

  const hostOptions = allUsers.map((user) => ({
    id: user.id,
    label: user.name,
    subtitle: user.email,
  }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh");
        return;
      }

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

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData((prev) => {
      const newData = { ...prev };
      delete newData.imageFile;
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên homestay");
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdate(homestay.id, formData);
      onClose();
    } catch (error) {
      console.error("Error updating homestay:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !homestay) return null;

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
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  Chỉnh sửa Homestay
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
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ảnh Homestay
                  </label>
                  <div className="mt-1 flex flex-col items-center">
                    {imagePreview ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-300">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          Chọn ảnh mới (tùy chọn)
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF tối đa 5MB
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên Homestay <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nhập tên homestay"
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nhập địa chỉ homestay"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mô tả
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    placeholder="Nhập mô tả về homestay..."
                  />
                </div>

                {/* Location & Host */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Location Selector */}
                  <SearchableDropdown
                    label="Khu vực"
                    placeholder="Chọn khu vực"
                    value={formData.locationId}
                    onChange={(locationId) =>
                      setFormData((prev) => ({ ...prev, locationId }))
                    }
                    options={locationOptions}
                    loading={loadingAll}
                    emptyLabel="Không chọn"
                    searchPlaceholder="Tìm kiếm khu vực..."
                    icon={<MapPin className="w-4 h-4 inline" />}
                    allowEmpty={true}
                    emptyOptionLabel="Không chọn"
                  />

                  {/* Host Selector */}
                  <SearchableDropdown
                    label="Chủ nhà"
                    placeholder="Chọn chủ nhà"
                    value={formData.hostId}
                    onChange={(hostId) =>
                      setFormData((prev) => ({ ...prev, hostId }))
                    }
                    options={hostOptions}
                    loading={loadingAllUsers}
                    emptyLabel="Chưa cập nhật"
                    searchPlaceholder="Tìm kiếm người dùng..."
                    icon={<User className="w-4 h-4 inline" />}
                    allowEmpty={true}
                    emptyOptionLabel="Chưa cập nhật"
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Trạng thái
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!hasChanges() || isSubmitting}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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

export default HomestayUpdateModal;
