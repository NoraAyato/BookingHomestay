import http from "../http";

export async function getAdminNews({
  page = 1,
  size = 5,
  search = null,
  startDate = null,
  endDate = null,
  status = null,
  category = null,
}) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("size", size.toString());

  if (search) params.append("search", search);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (status) params.append("status", status);
  if (category) params.append("category", category);

  return await http.get(`/api/admin/newsmanager?${params.toString()}`, {
    requireAuth: true,
  });
}

export async function getNewsStats() {
  return await http.get("/api/admin/newsmanager/stats", {
    requireAuth: true,
  });
}

export async function createNews(data) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("status", data.status);
  formData.append("categoryId", data.categoryId);
  formData.append("featured", data.featured);

  if (data.image) {
    formData.append("image", data.image);
  }

  return await http.post("/api/admin/newsmanager/create", formData, {
    requireAuth: true,
  });
}

export async function updateNews(newsId, data) {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("status", data.status);
  formData.append("categoryId", data.categoryId);
  formData.append("featured", data.featured);

  // Image là tùy chọn khi update
  if (data.image) {
    formData.append("image", data.image);
  }

  return await http.put(`/api/admin/newsmanager/${newsId}`, formData, {
    requireAuth: true,
  });
}

export async function deleteNews(newsId) {
  return await http.post(`/api/admin/newsmanager/delete/${newsId}`, null, {
    requireAuth: true,
  });
}
