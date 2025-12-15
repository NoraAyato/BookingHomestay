import http from "../http";

/**
 * Get promotions with pagination and filters
 * @param {Object} params - Query parameters
 * @param {string} params.search - Search term
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.size - Items per page (default: 5)
 * @param {string} params.startDate - Start date filter (YYYY-MM-DD)
 * @param {string} params.endDate - End date filter (YYYY-MM-DD)
 * @param {string} params.type - Promotion type (Percentage/Fixed)
 * @param {string} params.status - Promotion status (Active/Inactive)
 * @returns {Promise} API response with promotion data
 */
export const getPromotions = (params = {}) => {
  const {
    search,
    page = 1,
    size = 5,
    startDate,
    endDate,
    type,
    status,
  } = params;

  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  queryParams.append("page", page);
  queryParams.append("size", size);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (type && type !== "all") queryParams.append("type", type);
  if (status && status !== "all") queryParams.append("status", status);
  return http.get(`/api/host/promotions?${queryParams.toString()}`, {
    requireAuth: true,
  });
};

/**
 * Get promotion statistics
 * @returns {Promise} API response with stats
 */
export const getPromotionStats = () => {
  return http.get("/api/host/promotions/stats", { requireAuth: true });
};

/**
 * Create a new promotion
 * @param {Object} data - Promotion data
 * @param {File} data.imageFile - Image file (optional)
 * @param {Array<string>} data.homestayIds - Selected homestay IDs (optional)
 * @returns {Promise} API response
 */
export const createPromotion = (data) => {
  const formData = new FormData();

  // Create DTO object for @RequestPart("data")
  const promotionDto = {
    description: data.description || "",
    discountType: data.discountType || "percentage",
    discountValue: data.discountValue || "",
    startDate: data.startDate ? data.startDate.split("T")[0] : "",
    endDate: data.endDate ? data.endDate.split("T")[0] : "",
    minBookedDays: data.minBookedDays || "",
    minNights: data.minNights || "",
    minValue: data.minValue || "",
    quantity: data.quantity || "",
    status: data.status || "active",
    isForNewCustomer: data.isForNewCustomer || "false",
  };

  // Append DTO as JSON Blob with key "data" (for @RequestPart("data"))
  const jsonBlob = new Blob([JSON.stringify(promotionDto)], {
    type: "application/json",
  });
  formData.append("data", jsonBlob);

  // Append image file if provided (for @RequestPart("image"))
  if (data.imageFile) {
    formData.append("image", data.imageFile);
  }

  // Append homestayIds if provided (for @RequestPart("homestayIds"))
  if (data.homestayIds && data.homestayIds.length > 0) {
    const homestayIdsBlob = new Blob([JSON.stringify(data.homestayIds)], {
      type: "application/json",
    });
    formData.append("homestayIds", homestayIdsBlob);
  }

  return http.post(`/api/host/promotions/create`, formData, {
    requireAuth: true,
  });
};

/**
 * Update an existing promotion
 * @param {string} id - Promotion ID
 * @param {Object} data - Promotion data
 * @param {File} data.imageFile - Image file (optional)
 * @param {Array<string>} data.homestayIds - Selected homestay IDs (optional)
 * @returns {Promise} API response
 */
export const updatePromotion = (id, data) => {
  const formData = new FormData();

  // Create DTO object for @RequestPart("data")
  const promotionDto = {
    description: data.description || "",
    discountType: data.discountType || "percentage",
    discountValue: data.discountValue ? parseInt(data.discountValue) : 0,
    startDate: data.startDate ? data.startDate.split("T")[0] : "",
    endDate: data.endDate ? data.endDate.split("T")[0] : "",
    minBookedDays: data.minBookedDays ? parseInt(data.minBookedDays) : 0,
    minNights: data.minNights ? parseInt(data.minNights) : 0,
    minValue: data.minValue ? parseInt(data.minValue) : 0,
    quantity: data.quantity ? parseInt(data.quantity) : 0,
    status: data.status || "active",
    isForNewCustomer:
      data.isForNewCustomer === true || data.isForNewCustomer === "true",
  };

  // Append DTO as JSON Blob with key "data"
  const jsonBlob = new Blob([JSON.stringify(promotionDto)], {
    type: "application/json",
  });
  formData.append("data", jsonBlob);

  // Append image file if provided (for @RequestPart("image"))
  if (data.imageFile) {
    formData.append("image", data.imageFile);
  }

  // [] hoặc array = cập nhật danh sách mới
  if (data.homestayIds !== undefined) {
    if (data.homestayIds && data.homestayIds.length > 0) {
      const homestayIdsBlob = new Blob([JSON.stringify(data.homestayIds)], {
        type: "application/json",
      });
      formData.append("homestayIds", homestayIdsBlob);
    } else {
      const homestayIdsBlob = new Blob([JSON.stringify([])], {
        type: "application/json",
      });
      formData.append("homestayIds", homestayIdsBlob);
    }
  } else {
  }

  return http.post(`/api/host/promotions/${id}/update`, formData, {
    requireAuth: true,
  });
};

/**
 * Delete a promotion
 * @param {string} id - Promotion ID
 * @returns {Promise} API response
 */
export const deletePromotion = (id) => {
  return http.post(`/api/host/promotions/delete/${id}`, null, {
    requireAuth: true,
  });
};
