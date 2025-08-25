import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPasswordUser } = useAuth();
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const resetToken = searchParams.get("resetToken") || "none";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.password || !form.confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);
    const result = await resetPasswordUser(resetToken, form.password);
    if (result) {
      setSuccess(
        "Đặt lại mật khẩu thành công! Bạn sẽ được chuyển về trang đăng nhập."
      );
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    } else {
      setError("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold mb-4 text-center">
          Đặt lại mật khẩu
        </h2>
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Mật khẩu mới
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-xs"
            placeholder="Nhập mật khẩu mới"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Nhập lại mật khẩu
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-xs"
            placeholder="Nhập lại mật khẩu"
            required
          />
        </div>
        {error && (
          <div className="text-xs text-red-500 text-center mb-2">{error}</div>
        )}
        {success && (
          <div className="text-xs text-green-500 text-center mb-2">
            {success}
          </div>
        )}
        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg text-xs"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
