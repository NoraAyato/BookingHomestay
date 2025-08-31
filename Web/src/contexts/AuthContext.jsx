import React, { useState, useEffect, createContext } from "react";
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
import { getAuthReturnPath, removeAuthReturnPath } from "../utils/session";
export const AuthContext = createContext();

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
      if (res.success) {
        const accessToken = res.data?.accessToken;
        const refreshToken = res.data?.refreshToken;
        if (accessToken) setAccessToken(accessToken);
        if (refreshToken) setRefreshToken(refreshToken);
        await handleSetUserAfterAuth();
        showToast("success", res.message);
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
        if (res.data) {
          setAccessToken(res.data.accessToken);
        }
        await handleSetUserAfterAuth();
        showToast("success", res.message);
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
        await handleSetUserAfterAuth();
        showToast("success", "Đăng nhập Google thành công");
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
        showToast("success", res.message);
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
        showToast("success", res.message);
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
      if (res.success) {
        showToast("success", res.message);
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
        showToast("success", res.message);
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

  const handleSetUserAfterAuth = async () => {
    const getUser = await getCurrentUser();
    if (getUser.success && getUser.data) {
      setUser(getUser.data);
      setUserInfoLocal(getUser.data);
      const returnPath = getAuthReturnPath();
      if (returnPath) {
        removeAuthReturnPath();
        setTimeout(() => {
          window.location.href = returnPath;
        }, 1000);
      } else {
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }
    }
  };
  const logout = () => {
    setToken(null);
    setUser(null);
    removeToken();
    removeUserInfo();
    showToast("success", "Đã đăng xuất");
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
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
