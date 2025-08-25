// Auth API functions
import http from "./http";

export const login = async (email, password, rememberMe) => {
  return await http.post("/api/auth/login", { email, password, rememberMe });
};

export const register = async (email, passWord, firstName, lastName) => {
  return await http.post("/api/auth/register", {
    email,
    passWord,
    firstName,
    lastName,
  });
};

export const forgotPassword = async (email) => {
  return await http.post("/api/auth/forgot-password", { email });
};

export const resetPassword = async (token, newPassword) => {
  return await http.post("/api/auth/reset-password", { token, newPassword });
};

// Gửi OTP tới email
export const sendOtp = async (email) => {
  return await http.post("/api/auth/send-otp", { email });
};
//verify otp
export const verifyOtp = async (email, otp) => {
  return await http.post("/api/auth/verify-otp", { email, otp });
};
