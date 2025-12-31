import http from "../http";

export async function getServicesData({
  page = 1,
  limit = 6,
  search = "",
} = {}) {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (search) params.append("search", search);

  return http.get(`/api/admin/servicemanager?${params.toString()}`, {
    requireAuth: true,
  });
}

export async function createService(data) {
  const params = new URLSearchParams();
  params.append("serviceName", data.name);

  return http.post(
    `/api/admin/servicemanager/create?${params.toString()}`,
    null,
    {
      requireAuth: true,
    }
  );
}

export async function updateService(id, data) {
  const params = new URLSearchParams();
  params.append("name", data.name);

  return http.put(
    `/api/admin/servicemanager/update/${id}?${params.toString()}`,
    null,
    {
      requireAuth: true,
    }
  );
}

export async function deleteService(id) {
  return http.post(`/api/admin/servicemanager/delete/${id}`, null, {
    requireAuth: true,
  });
}

export async function getHomestayServices(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.status !== undefined) queryParams.append("status", params.status);
  if (params.search) queryParams.append("search", params.search);

  return http.get(
    `/api/admin/servicemanager/homestay-service?${queryParams.toString()}`,
    {
      requireAuth: true,
    }
  );
}

export async function approveHomestayService(serviceId) {
  return http.put(
    `/api/admin/servicemanager/homestay-service/approve/${serviceId}`,
    null,
    {
      requireAuth: true,
    }
  );
}

export async function rejectHomestayService(serviceId) {
  return http.put(
    `/api/admin/servicemanager/homestay-service/reject/${serviceId}`,
    null,
    {
      requireAuth: true,
    }
  );
}

export async function getHomestayServiceStats() {
  return http.get(`/api/admin/servicemanager/homestay-service/stats`, {
    requireAuth: true,
  });
}
