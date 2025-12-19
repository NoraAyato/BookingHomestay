import http from "../http";

// Lấy thống kê khuyến mãi
export const getPromotionStats = () => {
  return http.get("/api/admin/promotionmanager/stats", { requireAuth: true });
};

// Lấy danh sách khuyến mãi với phân trang và filter
export const getPromotions = (params) => {
  const { search, page = 1, size = 5, startDate, endDate, status } = params;

  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  queryParams.append("page", page);
  queryParams.append("size", size);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (status && status !== "all") queryParams.append("status", status);

  return http.get(`/api/admin/promotionmanager?${queryParams.toString()}`, {
    requireAuth: true,
  });
};

// Tạo khuyến mãi mới
export const createPromotion = (data) => {
  console.log("=== CREATE PROMOTION DEBUG ===");
  console.log("Raw input data:", data);

  const formData = new FormData();

  // Tạo DTO object cho @RequestPart("data")
  const promotionDto = {
    description: data.description || "",
    discountType: data.discountType || "percentage",
    discountValue: data.discountValue || 0,
    startDate: data.startDate ? data.startDate.split("T")[0] : "",
    endDate: data.endDate ? data.endDate.split("T")[0] : "",
    minBookedDays: data.minBookedDays || 0,
    minNights: data.minNights || 0,
    minValue: data.minValue || 0,
    quantity: data.quantity || 0,
    status: data.status || "active",
    isForNewCustomer: data.isForNewCustomer || false,
  };

  console.log("Promotion DTO:", promotionDto);

  // Append DTO as JSON Blob với key "data" (tương ứng @RequestPart("data"))
  const jsonBlob = new Blob([JSON.stringify(promotionDto)], {
    type: "application/json",
  });
  formData.append("data", jsonBlob);

  // Append image file nếu có (tương ứng @RequestPart("image"))
  if (data.imageFile) {
    console.log("Image:", data.imageFile.name, data.imageFile.type);
    formData.append("image", data.imageFile);
  } else {
    console.log("No image provided");
  }

  // Log FormData entries
  console.log("Final FormData:");
  for (let [key, value] of formData.entries()) {
    if (value instanceof Blob) {
      console.log(`  ${key}: [Blob] ${value.type} (${value.size} bytes)`);
    } else if (value instanceof File) {
      console.log(`  ${key}: [File] ${value.name}`);
    } else {
      console.log(`  ${key}:`, value);
    }
  }

  return http.post(`/api/admin/promotionmanager/create`, formData, {
    requireAuth: true,
  });
};

// Cập nhật khuyến mãi
export const updatePromotion = (id, data) => {
  console.log("=== UPDATE PROMOTION DEBUG ===");
  console.log("Promotion ID:", id);
  console.log("Raw input data:", data);

  const formData = new FormData();

  // Tạo DTO object cho @RequestPart("data")
  const promotionDto = {
    description: data.description || "",
    discountType: data.discountType || "percentage",
    discountValue: data.discountValue || 0,
    startDate: data.startDate ? data.startDate.split("T")[0] : "",
    endDate: data.endDate ? data.endDate.split("T")[0] : "",
    minBookedDays: data.minBookedDays || 0,
    minNights: data.minNights || 0,
    minValue: data.minValue || 0,
    quantity: data.quantity || 0,
    status: data.status || "active",
    isForNewCustomer: data.isForNewCustomer || false,
  };

  console.log("Update Promotion DTO:", promotionDto);

  // Append DTO as JSON Blob với key "data" (tương ứng @RequestPart("data"))
  const jsonBlob = new Blob([JSON.stringify(promotionDto)], {
    type: "application/json",
  });
  formData.append("data", jsonBlob);

  // Append image file nếu có (tương ứng @RequestPart("image", required = false))
  if (data.imageFile) {
    console.log("New Image:", data.imageFile.name, data.imageFile.type);
    formData.append("image", data.imageFile);
  } else {
    console.log("No new image - keeping existing image");
  }

  // Log FormData entries
  console.log("Final FormData:");
  for (let [key, value] of formData.entries()) {
    if (value instanceof Blob) {
      console.log(`  ${key}: [Blob] ${value.type} (${value.size} bytes)`);
    } else if (value instanceof File) {
      console.log(`  ${key}: [File] ${value.name}`);
    } else {
      console.log(`  ${key}:`, value);
    }
  }

  return http.post(`/api/admin/promotionmanager/${id}/update`, formData, {
    requireAuth: true,
  });
};

// Xóa khuyến mãi
export const deletePromotion = (id) => {
  return http.post(`/api/admin/promotionmanager/delete/${id}`, {
    requireAuth: true,
  });
};
