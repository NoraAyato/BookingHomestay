import React, { useState, useEffect } from "react";
import {
  getAccessToken,
  setAccessToken,
  getUserInfo,
  setUserInfoLocal,
  setRefreshToken,
  removeToken,
  removeUserInfo,
} from "../utils/session";
import { getCurrentUser } from "../api/users";
import {
  login,
  register,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from "../api/auth";
import { showToast } from "../components/common/Toast";
import { AuthContext } from "./AuthContextObject";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAccessToken();
    const user = getUserInfo();
    if (token && user) {
      setToken(token);
      setUser(user);
    }
    setLoading(false);
  }, []);

  // Đăng nhập thường
  const loginUser = async (email, password, rememberMe) => {
    setLoading(true);
    setError("");
    try {
      const res = await login(email, password, rememberMe);
      console.log(res);
      if (res.success) {
        const accessToken = res.data?.data?.accessToken;
        const refreshToken = res.data?.data?.refreshToken;
        if (accessToken) setAccessToken(accessToken);
        if (refreshToken) setRefreshToken(refreshToken);
        const getUser = await getCurrentUser();
        if (getUser.success && getUser.data) {
          setUser(getUser.data);
          setUserInfoLocal(getUser.data);
        }
        showToast("success", res.data.message);
        return true;
      } else {
        setError(res.message || "Đăng nhập thất bại");
        showToast("error", res.message || "Đăng nhập thất bại");
        return false;
      }
    } catch {
      setError("Lỗi hệ thống");
      showToast("error", "Lỗi hệ thống");
      return false;
    } finally {
      setLoading(false);
    }
  };
  // Hàm xử lý chuyển hướng Google OAuth
  const handleGoogleLogin = () => {
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const scope = "openid email profile";
    const oauthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}`;
    window.location.href = oauthUrl;
  };
  // Đăng ký
  const registerUser = async (email, password, firstname, lastname) => {
    setLoading(true);
    setError("");
    try {
      const res = await register(email, password, firstname, lastname);
      console.log(res);
      if (res.success) {
        if (res.data?.data) {
          setAccessToken(res.data.data.accessToken);
        }
        showToast("success", res.data.message);
        return true;
      } else {
        setError(res.message || "Đăng ký thất bại");
        showToast("error", res.message || "Đăng ký thất bại");
        return false;
      }
    } catch {
      setError("Lỗi hệ thống");
      showToast("error", "Lỗi hệ thống");
      return false;
    } finally {
      setLoading(false);
    }
  };
  // Xử lý callback Google OAuth
  const handleGoogleCallback = async (navigate) => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    if (accessToken) {
      setAccessToken(accessToken);
      if (refreshToken) {
        setRefreshToken(refreshToken);
      }
      try {
        const res = await getCurrentUser();
        if (res.success && res.data) {
          setUser(res.data);
          setUserInfoLocal(res.data);
          showToast("success", "Đăng nhập Google thành công");
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        } else {
          showToast("error", res.message);
          navigate("/");
        }
      } catch {
        showToast("error", "Lỗi hệ thống");
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };
  // Gửi OTP
  const sendOtpEmail = async (email) => {
    setLoading(true);
    setError("");
    try {
      const res = await sendOtp(email);
      if (res.success) {
        showToast("success", res.data.message);
        return true;
      } else {
        setError(res.message);
        showToast("error", res.message || "Gửi OTP thất bại");
        return false;
      }
    } catch {
      setError("Lỗi hệ thống");
      showToast("error", "Lỗi hệ thống");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Xác thực OTP
  const verifyOtpEmail = async (email, otp) => {
    setLoading(true);
    setError("");
    try {
      const res = await verifyOtp(email, otp);
      if (res.success) {
        showToast("success", res.data.message);
        return true;
      } else {
        setError(res.message || "Xác thực OTP thất bại");
        showToast("error", res.message || "Xác thực OTP thất bại");
        return false;
      }
    } catch {
      setError("Lỗi hệ thống");
      showToast("error", "Lỗi hệ thống");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const forgotPasswordEmail = async (email) => {
    setLoading(true);
    setError("");
    try {
      const res = await forgotPassword(email);
      console.log(res);
      if (res.success) {
        showToast("success", res.data.message);
        return true;
      } else {
        setError(res.message || "Yêu cầu thất bại");
        showToast("error", res.message || "Yêu cầu thất bại");
        return false;
      }
    } catch {
      setError("Lỗi hệ thống");
      showToast("error", "Lỗi hệ thống");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const resetPasswordUser = async (token, newPassword) => {
    setLoading(true);
    setError("");
    try {
      const res = await resetPassword(token, newPassword);
      if (res.success) {
        showToast("success", res.data.message);
        return true;
      } else {
        setError(res.message || "Đặt lại mật khẩu thất bại");
        showToast("error", res.message || "Đặt lại mật khẩu thất bại");
        return false;
      }
    } catch {
      setError("Lỗi hệ thống");
      showToast("error", "Lỗi hệ thống");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    setToken(null);
    setUser(null);
    removeToken();
    removeUserInfo();
    showToast("success", "Đã đăng xuất");
  };

  const value = {
    user,
    token,
    loading,
    error,
    loginUser,
    registerUser,
    sendOtpEmail,
    verifyOtpEmail,
    logout,
    setError,
    handleGoogleLogin,
    handleGoogleCallback,
    forgotPasswordEmail,
    resetPasswordUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
