import http from "../http";

export async function getUsers({
  page = 1,
  limit = 20,
  role,
  status,
  search,
} = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (role && role !== "all") params.append("role", role);
  if (status && status !== "all") params.append("status", status);
  if (search) params.append("search", search);
  return http.get(`/api/admin/usermanager?${params.toString()}`, {
    requireAuth: true,
  });
}

export async function getUserDetail(id) {
  return http.get(`/api/admin/usermanager/getUser?${id}`, {
    requireAuth: true,
  });
}

export async function updateUserByAdmin(id, data) {
  return http.put(`/api/admin/usermanager/updateUser?${id}`, data, {
    requireAuth: true,
  });
}

export async function deleteUserByAdmin(id) {
  return http.delete(`/api/admin/usermanager/deleteUser?${id}`, {
    requireAuth: true,
  });
}
export async function getAllRoles() {
  return http.get(`/api/admin/usermanager/getAllRoles`, {
    requireAuth: true,
  });
}

export async function getUserStats() {
  return http.get(`/api/admin/usermanager/getUserStats`, {
    requireAuth: true,
  });
}

export async function updateUserStatus(id, status) {
  return http.put(`/api/admin/usermanager/updateStatus/${id}`, status, {
    requireAuth: true,
  });
}

export async function updateUserRole(id, role) {
  return http.post(
    `/api/admin/usermanager/updateRole`,
    { userId: id, role },
    {
      requireAuth: true,
    }
  );
}

export async function getAllUsers() {
  return http.get(`/api/admin/usermanager/getAllUsers`, {
    requireAuth: true,
  });
}
