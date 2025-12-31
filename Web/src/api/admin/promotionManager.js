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


  return http.post(`/api/admin/promotionmanager/create`, formData, {
    requireAuth: true,
  });
};

// Cập nhật khuyến mãi
export const updatePromotion = (id, data) => {
  
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

  const jsonBlob = new Blob([JSON.stringify(promotionDto)], {
    type: "application/json",
  });
  formData.append("data", jsonBlob);

  if (data.imageFile) {
    console.log("New Image:", data.imageFile.name, data.imageFile.type);
    formData.append("image", data.imageFile);
  } else {
    console.log("No new image - keeping existing image");
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
