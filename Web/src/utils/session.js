const USERINFO_KEY = "userInfo";
const TOKEN_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export function setUserInfoLocal(user) {
  localStorage.setItem(USERINFO_KEY, JSON.stringify(user));
}

export function getUserInfo() {
  const data = localStorage.getItem(USERINFO_KEY);
  return data ? JSON.parse(data) : null;
}

export function removeUserInfo() {
  localStorage.removeItem(USERINFO_KEY);
}

export function setAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}
export function setRefreshToken(token) {
  localStorage.setItem(REFRESH_KEY, token);
}
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}
