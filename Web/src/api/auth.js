// Auth API functions
import http from "./http";
import { setToken, setRefreshToken } from "../utils/session";

export const login = async (email, password, rememberMe) => {
  return await http.post("/api/auth/login", { email, password, rememberMe });
};

export const loginAndGetUser = async (email, password, rememberMe) => {
  const res = await login(email, password, rememberMe);

  const accessToken = res.data?.data?.accessToken;
  const refreshToken = res.data?.data?.refreshToken;
  if (accessToken) setToken(accessToken);
  if (refreshToken) setRefreshToken(refreshToken);
  if (accessToken) {
    const userRes = await http.get("/api/users/me");
    if (userRes.success && userRes.data) {
      return { ...res, user: userRes.data };
    } else {
      return {
        ...res,
        user: null,
        message: userRes.message || "Không lấy được thông tin user",
      };
    }
  }
  return res;
};

export const register = async (email, password, firstname, lastname) => {
  return await http.post("/api/auth/register", {
    email,
    password,
    firstname,
    lastname,
  });
};

// Gửi OTP tới email
export const sendOtp = async (email) => {
  return await http.post("/api/auth/send-otp", { email });
};
//verify otp
export const verifyOtp = async (email, otp) => {
  return await http.post("/api/auth/verify-otp", { email, otp });
};

// Đăng nhập với Google
export const loginWithGoogle = async (idToken) => {
  return await http.post("/api/auth/google", { idToken });
};
