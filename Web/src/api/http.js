import { BASE_URL } from "./config";
import {
  getToken,
  getRefreshToken,
  setToken,
  removeToken,
} from "../utils/session";

const request = async (endpoint, options = {}) => {
  try {
    // Tự động gắn accessToken vào header nếu có
    const accessToken = getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    // Nếu token hết hạn (401), thử refresh token
    if (res.status === 401) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        // Gọi API refresh token
        const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          setToken(refreshData.accessToken);
          headers["Authorization"] = `Bearer ${refreshData.accessToken}`;
          const retryRes = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
          });
          if (!retryRes.ok) {
            let errorMessage = "Có lỗi xảy ra.";
            let errorData;
            const text = await retryRes.text();
            try {
              errorData = JSON.parse(text);
              errorMessage =
                errorData.message ||
                errorData.error ||
                errorData.status ||
                text;
            } catch {
              errorMessage = text;
            }
            return { success: false, message: errorMessage, error: errorData };
          }
          const data = await retryRes.json();
          return { success: true, data };
        } else {
          // Refresh token thất bại, logout user
          removeToken();
          return {
            success: false,
            message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
          };
        }
      }
    }
    if (!res.ok) {
      let errorMessage = "Có lỗi xảy ra.";
      let errorData;
      const text = await res.text();
      try {
        errorData = JSON.parse(text);
        errorMessage =
          errorData.message || errorData.error || errorData.status || text;
      } catch {
        errorMessage = text;
      }
      return { success: false, message: errorMessage, error: errorData };
    }
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      message:
        err.message &&
        (err.message.includes("Failed to fetch") ||
          err.message.includes("NetworkError"))
          ? "Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng hoặc thử lại sau."
          : err.message || "Có lỗi xảy ra.",
    };
  }
};

const http = {
  get: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (endpoint, body, options = {}) =>
    request(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),
  delete: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: "DELETE" }),
};

export default http;
