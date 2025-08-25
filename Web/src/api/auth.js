// Auth API functions
import http from "./http";

export const login = async (email, password, rememberMe) => {
  return await http.post("/api/auth/login", { email, password, rememberMe });
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
