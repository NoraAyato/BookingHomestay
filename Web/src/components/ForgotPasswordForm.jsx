import React, { useState } from "react";
import { useAuth } from "../contexts/useAuth";

const ForgotPasswordForm = ({ switchToLogin }) => {
  const { forgotPasswordEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ.");
      return;
    }
    setLoading(true);
    await forgotPasswordEmail(email);

    setLoading(false);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full pr-2 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors text-xs"
          placeholder="Nhập email để lấy lại mật khẩu"
          required
        />
      </div>
      {error && <div className="text-xs text-red-500 text-center">{error}</div>}
      {success && (
        <div className="text-xs text-green-500 text-center">{success}</div>
      )}
      <button
        type="submit"
        className="w-full py-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-medium rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all shadow-md hover:shadow-lg text-xs"
        disabled={loading}
      >
        {loading ? "Đang gửi..." : "Gửi email quên mật khẩu"}
      </button>
      <div className="text-center text-xs text-gray-600 mt-2">
        <button
          type="button"
          className="text-rose-600 font-medium hover:text-rose-700 hover:underline transition-colors"
          onClick={switchToLogin}
        >
          Quay lại đăng nhập
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
