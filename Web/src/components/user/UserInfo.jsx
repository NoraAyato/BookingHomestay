import React, { useState, useEffect } from "react";
import { getImageUrl } from "../../utils/imageUrl";
import useUser from "../../hooks/useUser";
import { formatDateDisplay } from "../../utils/date";
import LoadingSpinner from "../common/LoadingSpinner";

const UserInfo = () => {
  const { uploadAvatar, currentUser, updateUserProfile } = useUser();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const user = currentUser;
  const [editUser, setEditUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: 0,
    dob: "",
    email: "",
  });
  useEffect(() => {
    if (user) {
      setEditUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phoneNumber || "",
        gender: user.gender ? 1 : 0,
        dob: user.dob || "",
        email: user.email || "",
      });
    }
  }, [user]);
  const [isChanged, setIsChanged] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    const newErrors = {};
    if (!editUser.firstName.trim()) {
      newErrors.firstName = "Họ không được để trống";
    }
    if (!editUser.lastName.trim()) {
      newErrors.lastName = "Tên không được để trống";
    } else if (editUser.lastName.length > 6) {
      newErrors.lastName = "Tên không được quá 6 ký tự";
    }

    // Validate first name độ dài
    if (editUser.firstName && editUser.firstName.length > 6) {
      newErrors.firstName = "Họ không được quá 6 ký tự";
    }

    // Validate phone number
    const phoneRegex = /^0[0-9]{9}$/;
    if (!editUser.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(editUser.phone)) {
      newErrors.phone = "Số điện thoại phải bắt đầu bằng 0 và đủ 10 số";
    }
    // Validate date of birth
    if (!editUser.dob) {
      newErrors.dob = "Ngày sinh không được để trống";
    } else {
      const dobDate = new Date(editUser.dob);
      const today = new Date();
      if (dobDate >= today) {
        newErrors.dob = "Ngày sinh phải trước ngày hiện tại";
      } else {
        const age = today.getFullYear() - dobDate.getFullYear();
        if (age < 18) {
          newErrors.dob = "Bạn phải đủ 18 tuổi";
        }
      }
    }

    setErrors(newErrors);
  }, [editUser]);

  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return {
          bg: "bg-red-100 group-hover:bg-red-200",
          text: "text-red-800",
          icon: (
            <svg
              className="w-3 h-3 mr-1 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
                clipRule="evenodd"
              />
            </svg>
          ),
          label: "Quản trị viên",
        };
      case "host":
        return {
          bg: "bg-amber-100 group-hover:bg-amber-200",
          text: "text-amber-800",
          icon: (
            <svg
              className="w-3 h-3 mr-1 text-amber-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          ),
          label: "Chủ nhà",
        };
      default:
        return {
          bg: "bg-blue-100 group-hover:bg-blue-200",
          text: "text-blue-800",
          icon: (
            <svg
              className="w-3 h-3 mr-1 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          ),
          label: "Người dùng",
        };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0 || !isChanged) return;

    updateUserProfile(editUser);

    setIsEditing(false);
  };
  if (!user) return <LoadingSpinner />;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 w-full border border-gray-100 transition-all duration-300 hover:shadow-xl">
      {!isEditing ? (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar section */}
          <div className="relative flex flex-col items-center group">
            <div className="relative">
              <img
                src={getImageUrl(user.picture)}
                alt={user.userName}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg transition-all duration-300 group-hover:scale-105"
              />
              <span className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></span>
              <input
                type="file"
                accept="image/*"
                id="avatar-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    // Handle avatar upload logic here
                    uploadAvatar(file);
                  }
                }}
              />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                title="Cập nhật ảnh đại diện"
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </label>
            </div>
            {(() => {
              const badge = getRoleBadgeStyle(user.role);
              return (
                <div
                  className={`mt-4 flex items-center justify-center rounded-full px-4 py-1 text-sm font-semibold transition-colors duration-300 ${badge.bg} ${badge.text}`}
                >
                  {badge.icon}
                  {badge.label}
                </div>
              );
            })()}
          </div>
          {/* User info section */}
          <div className="flex-1 text-left">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {user.userName}
              </h2>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-gray-700 mb-4">
              <div className="flex items-center">
                <span className="font-semibold mr-2">Email:</span>
                <span className="text-gray-500">{user.email}</span>
              </div>
              <div className="hidden md:block text-gray-300">•</div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">SĐT:</span>
                <span>{user.phoneNumber}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <span className="font-semibold mr-2">Thành viên từ:</span>
                <span>{formatDateDisplay(user.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">Giới tính:</span>
                <span>{user.gender === 0 ? "Nam" : "Nữ"}</span>
              </div>
            </div>
          </div>
          {/* Actions section */}
          <div className="flex flex-col gap-3 md:ml-auto w-full md:w-auto mt-14 md:mt-0 md:self-end">
            <button
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg font-semibold hover:from-rose-600 hover:to-rose-700 transition-all duration-300 shadow hover:shadow-lg flex items-center justify-center transform hover:-translate-y-0.5"
              onClick={() => {
                setEditUser({
                  firstName: user.firstName || "",
                  lastName: user.lastName || "",
                  phone: user.phoneNumber || "",
                  gender: user.gender ? 1 : 0,
                  dob: user.birthDay || "",
                  email: user.email || "",
                });
                setIsEditing(true);
                setIsChanged(false);
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <svg
                className={`w-5 h-5 mr-2 transition-transform duration-300 `}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Chỉnh sửa thông tin
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar section */}
          <div className="relative flex flex-col items-center group">
            <div className="relative">
              <img
                src={getImageUrl(user.picture)}
                alt={user.firstName + " " + user.lastName}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <span className="text-white text-sm font-medium">Thay đổi</span>
              </div>
            </div>
            {(() => {
              const badge = getRoleBadgeStyle(user.role);
              return (
                <div
                  className={`mt-4 flex items-center justify-center rounded-full px-4 py-1 text-sm font-semibold transition-colors duration-300 ${badge.bg} ${badge.text}`}
                >
                  {badge.icon}
                  {badge.label}
                </div>
              );
            })()}
          </div>

          {/* Edit form section */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              Chỉnh sửa thông tin cá nhân
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Họ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.firstName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                    } focus:ring-2 focus:ring-opacity-20 transition-colors duration-200 outline-none`}
                    value={editUser.firstName}
                    onChange={(e) => {
                      setEditUser({ ...editUser, firstName: e.target.value });
                      setIsChanged(true);
                    }}
                    placeholder="Nhập họ của bạn"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.lastName
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                    } focus:ring-2 focus:ring-opacity-20 transition-colors duration-200 outline-none`}
                    value={editUser.lastName}
                    onChange={(e) => {
                      setEditUser({ ...editUser, lastName: e.target.value });
                      setIsChanged(true);
                    }}
                    placeholder="Nhập tên của bạn"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">+84</span>
                    </div>
                    <input
                      type="tel"
                      className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                        errors.phone
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                      } focus:ring-2 focus:ring-opacity-20 transition-colors duration-200 outline-none`}
                      value={editUser.phone}
                      onChange={(e) => {
                        setEditUser({ ...editUser, phone: e.target.value });
                        setIsChanged(true);
                      }}
                      placeholder="912345678"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày sinh <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.dob
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:border-rose-500 focus:ring-rose-500"
                      } focus:ring-2 focus:ring-opacity-20 transition-colors duration-200 outline-none`}
                      value={editUser.dob}
                      onChange={(e) => {
                        setEditUser({ ...editUser, dob: e.target.value });
                        setIsChanged(true);
                      }}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  {errors.dob && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.dob}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Giới tính <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="text-rose-500 focus:ring-rose-500"
                        name="gender"
                        value={0}
                        checked={editUser.gender === 0}
                        onChange={(e) => {
                          setEditUser({
                            ...editUser,
                            gender: Number(e.target.value),
                          });
                          setIsChanged(true);
                        }}
                      />
                      <span className="ml-2">Nam</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="text-rose-500 focus:ring-rose-500"
                        name="gender"
                        value={1}
                        checked={editUser.gender === 1}
                        onChange={(e) => {
                          setEditUser({
                            ...editUser,
                            gender: Number(e.target.value),
                          });
                          setIsChanged(true);
                        }}
                      />
                      <span className="ml-2">Nữ</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                    value={editUser.email}
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email không thể thay đổi
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={Object.keys(errors).length > 0 || !isChanged}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center transition-all duration-200 ${
                    Object.keys(errors).length > 0 || !isChanged
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Lưu thay đổi
                </button>

                <button
                  type="button"
                  className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={() => setIsEditing(false)}
                >
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
