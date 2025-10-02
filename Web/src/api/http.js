import { BASE_URL } from "./config";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  removeToken,
  setRefreshToken,
  removeUserInfo,
  setAuthReturnPath,
} from "../utils/session";

let isRefreshing = false;
let refreshPromise = null;
const MAX_RETRY = 2;

function handleAuthError(
  message = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
) {
  logoutAndCleanup();
  window.dispatchEvent(
    new CustomEvent("AUTH_POPUP_EVENT", {
      detail: {
        type: "openAuthPopup",
        mode: "login",
        message,
      },
    })
  );
  return { success: false };
}

// Hàm xử lý lỗi chuẩn hóa trả về cho UI
function handleError(res) {
  let errorMessage = "Có lỗi xảy ra.";
  let errorData;
  if (res && typeof res.text === "function") {
    return res.text().then((text) => {
      try {
        errorData = JSON.parse(text);
        errorMessage =
          errorData.message || errorData.error || errorData.status || text;
      } catch {
        errorMessage = text;
      }
      return { success: false, message: errorMessage, error: errorData };
    });
  } else {
    return Promise.resolve({ success: false, message: errorMessage });
  }
}

const fetchWithTimeout = (url, options = {}, timeout = 15000) => {
  const controller = options.signal ? null : new AbortController();
  const signal = options.signal || (controller && controller.signal);
  const fetchPromise = fetch(url, { ...options, signal });
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      if (controller) controller.abort();
      reject(new Error("Request timeout"));
    }, timeout);
  });
  return Promise.race([fetchPromise, timeoutPromise]).finally(() =>
    clearTimeout(timeoutId)
  );
};

const fetchWithAuth = async (
  endpoint,
  options = {},
  accessToken,
  timeout = 15000
) => {
  let headers = { ...(options.headers || {}) };
  // Nếu body là FormData thì KHÔNG set Content-Type
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  return fetchWithTimeout(
    `${BASE_URL}${endpoint}`,
    { ...options, headers },
    timeout
  );
};
const request = async (endpoint, options = {}) => {
  let retryCount = 0;
  let lastError = null;
  const requireAuth = options.requireAuth;
  while (retryCount <= MAX_RETRY) {
    try {
      const accessToken = getAccessToken();
      if (requireAuth && !accessToken) {
        window.dispatchEvent(
          new CustomEvent("AUTH_POPUP_EVENT", {
            detail: {
              type: "openAuthPopup",
              mode: "login",
              to: "/",
              message: "Bạn cần đăng nhập để tiếp tục !",
            },
          })
        );
        return { success: false };
      }
      let res = await fetchWithAuth(endpoint, options, accessToken);
      if (res.status === 403) {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          if (!isRefreshing) {
            isRefreshing = true;
            // console.log("refreshing token...");
            refreshPromise = fetchWithTimeout(
              `${BASE_URL}/api/auth/refresh-token`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
              }
            ).then(async (refreshRes) => {
              isRefreshing = false;
              if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                setAccessToken(refreshData.accessToken);
                setRefreshToken(refreshData.refreshToken);
                return refreshData.accessToken;
              } else {
                logoutAndCleanup();
                throw new Error(
                  "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
                );
              }
            });
          }
          let newAccessToken;
          try {
            newAccessToken = await refreshPromise;
          } catch (err) {
            return handleAuthError(err.message);
          }
          // Retry request với accessToken mới
          res = await fetchWithAuth(endpoint, options, newAccessToken);
          if (res.status === 403) {
            return handleAuthError();
          }
        } else {
          return handleAuthError();
        }
      }
      if (!res.ok) {
        return await handleError(res);
      }
      const response = await res.json();
      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (err) {
      lastError = err;
      // Retry nếu lỗi mạng hoặc timeout
      if (
        err.message &&
        (err.message.includes("Failed to fetch") ||
          err.message.includes("NetworkError") ||
          err.message.includes("timeout")) &&
        retryCount < MAX_RETRY
      ) {
        retryCount++;
        continue;
      }
      // Nếu lỗi refresh token, logout
      if (err.message && err.message.includes("timeout")) {
        logoutAndCleanup();
      }
      return {
        success: false,
        message: err.message || "Có lỗi xảy ra.",
      };
    }
  }
  // Nếu hết retry vẫn lỗi
  return {
    success: false,
    message:
      lastError?.message &&
      (lastError.message.includes("Failed to fetch") ||
        lastError.message.includes("NetworkError") ||
        lastError.message.includes("timeout"))
        ? "Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng hoặc thử lại sau."
        : lastError?.message || "Có lỗi xảy ra.",
  };
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
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (endpoint, options = {}) =>
    request(endpoint, { ...options, method: "DELETE" }),
};
function logoutAndCleanup() {
  removeToken();
  removeUserInfo();
}
export default http;
