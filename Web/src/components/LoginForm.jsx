import React, { useState } from "react";

const LoginForm = ({ switchToRegister, small, setUserInfo, setShowAuth }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ.");
      setLoading(false);
      return;
    }
    const { loginAndGetUser } = await import("../api/auth");
    const { showToast } = await import("./Toast");
    const result = await loginAndGetUser(
      formData.email,
      formData.password,
      formData.rememberMe
    );
    if (result.success && result.user) {
      showToast("success", "Đăng nhập thành công!");
      setUserInfo(result.user.data);
      setShowAuth(false);
    } else {
      showToast("error", result.message);
    }
    setLoading(false);
  };

  return (
    <form
      className={`space-y-3 ${small ? "text-xs" : ""}`}
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
      </div>
      <div>
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
            placeholder="Nhập mật khẩu"
            required
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            className="h-3 w-3 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
          />
          Ghi nhớ
        </label>
        <button
          type="button"
          className="text-xs text-rose-600 hover:text-rose-700 font-medium"
        >
          Quên mật khẩu?
        </button>
      </div>
      {error && <div className="text-xs text-red-500 text-center">{error}</div>}
      <button
        type="submit"
        className="w-full py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg text-xs"
        disabled={loading}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
      <div className="text-center text-xs text-gray-600 mt-2">
        Chưa có tài khoản?{" "}
        <button
          type="button"
          className="text-rose-600 font-medium hover:text-rose-700 hover:underline transition-colors"
          onClick={switchToRegister}
        >
          Đăng ký ngay
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
