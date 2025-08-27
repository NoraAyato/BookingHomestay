import React, { useState } from "react";
import EmailOtpForm from "./EmailOtpForm";
import { useAuth } from "../../hooks/useAuth";
const RegisterForm = ({ switchToLogin, small }) => {
  const [formData, setFormData] = useState({
    email: "",
    lastName: "",
    firstName: "",
    password: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const newErrors = {};
    if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập họ";
    else if (formData.lastName.length > 10)
      newErrors.lastName = "Họ không quá 10 ký tự";
    else if (/[^a-zA-ZÀ-ỹ\s]/.test(formData.lastName))
      newErrors.lastName = "Họ không được chứa số hoặc ký tự đặc biệt";
    if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập tên";
    else if (formData.firstName.length > 10)
      newErrors.firstName = "Tên không quá 10 ký tự";
    else if (/[^a-zA-ZÀ-ỹ\s]/.test(formData.firstName))
      newErrors.firstName = "Tên không được chứa số hoặc ký tự đặc biệt";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    else if (formData.password.length < 6)
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    else if (formData.password.length > 10)
      newErrors.password = "Mật khẩu không quá 10 ký tự";
    if (!formData.agreeToTerms)
      newErrors.agreeToTerms = "Bạn phải đồng ý với điều khoản & chính sách";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: undefined });
  }

  const { registerUser, sendOtpEmail } = useAuth();
  async function handleSubmit(e) {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      const success = await sendOtpEmail(formData.email);
      if (success) {
        setShowOtp(true);
      }
      setLoading(false);
    }
  }

  if (showOtp) {
    return (
      <EmailOtpForm
        email={formData.email}
        onVerified={async () => {
          const success = await registerUser(
            formData.email,
            formData.password,
            formData.firstName,
            formData.lastName
          );
          if (success) {
            if (window.closeAuthPopup) window.closeAuthPopup();
          }
        }}
        onBack={() => setShowOtp(false)}
      />
    );
  }
  return (
    <form
      className={`space-y-2 ${small ? "text-xs" : ""}`}
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <i className="fas fa-envelope text-gray-400 text-xs"></i>
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-xs"
            placeholder="Nhập email"
            required
          />
        </div>
        {errors.email && (
          <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
        )}
      </div>
      <div className="mb-2 flex gap-4">
        <div className="flex-1">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Họ
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <i className="fas fa-user text-gray-400 text-xs"></i>
            </span>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Nhập họ"
              value={formData.lastName}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 pl-8 px-3 py-1.5 text-gray-900 focus:border-rose-500 focus:ring-rose-500 text-xs bg-white shadow-sm"
              required
            />
          </div>
          {errors.lastName && (
            <p className="text-xs text-rose-500 mt-1">{errors.lastName}</p>
          )}
        </div>
        <div className="flex-1">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tên
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <i className="fas fa-user-tag text-gray-400 text-xs"></i>
            </span>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Nhập tên"
              value={formData.firstName}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 pl-8 px-3 py-1.5 text-gray-900 focus:border-rose-500 focus:ring-rose-500 text-xs bg-white shadow-sm"
              required
            />
          </div>
          {errors.firstName && (
            <p className="text-xs text-rose-500 mt-1">{errors.firstName}</p>
          )}
        </div>
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Mật khẩu
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
            <i className="fas fa-lock text-gray-400 text-xs"></i>
          </div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-xs"
            placeholder="Tạo mật khẩu"
            required
          />
        </div>
        {errors.password && (
          <p className="text-xs text-rose-500 mt-1">{errors.password}</p>
        )}
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleChange}
          className="h-3 w-3 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-xs text-gray-700">
          Tôi đồng ý với{" "}
          <button type="button" className="text-rose-600 hover:underline mr-1">
            Điều khoản
          </button>
          &amp;
          <button type="button" className="text-rose-600 hover:underline ml-1">
            Chính sách
          </button>
        </label>
        {errors.agreeToTerms && (
          <p className="text-xs text-rose-500 ml-2 mt-1">
            {errors.agreeToTerms}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="w-full py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg text-xs"
        disabled={loading}
      >
        {loading ? "Đang gửi OTP..." : "Tạo tài khoản"}
      </button>
      <div className="text-center text-xs text-gray-600 mt-2">
        Đã có tài khoản?{" "}
        <button
          type="button"
          className="text-rose-600 font-medium hover:text-rose-700 hover:underline transition-colors"
          onClick={switchToLogin}
        >
          Đăng nhập
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
