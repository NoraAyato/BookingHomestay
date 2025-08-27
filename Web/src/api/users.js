// src/api/users.js
import http from "./http";

export async function getCurrentUser() {
  return await http.get("/api/users/me", { requireAuth: true });
}

export async function updateUser(data) {
  return await http.put("/api/users/me", data, { requireAuth: true });
}
