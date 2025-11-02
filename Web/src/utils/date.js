// Helper to parse DD/MM/YYYY to Date
export function parseDate(dateStr) {
  if (!dateStr) return null;
  // Nếu là dạng DD/MM/YYYY
  if (dateStr.includes("/")) {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  }
  // Nếu là dạng YYYY-MM-DD
  return new Date(dateStr);
}

// Hàm format ngày dạng dd/mm/yyyy
export const formatDateDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatCheckInCheckoOutDate = (date) => {
  // Use local timezone instead of UTC to avoid date shifting
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatLocal = (date) => {
  if (!date) return "";

  // Nếu date đã là chuỗi định dạng YYYY-MM-DD, trả về nguyên dạng
  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // Chuyển đổi thành đối tượng Date nếu chưa phải
  const dateObj = date instanceof Date ? date : new Date(date);

  // Kiểm tra nếu dateObj hợp lệ
  if (isNaN(dateObj.getTime())) {
    console.warn("Invalid date provided to formatLocal:", date);
    return "";
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getMaxCheckInDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 30);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTodayFormatted = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTomorrowFormatted = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getMaxCheckOutDate = (checkInDate) => {
  if (!checkInDate) return "";
  const checkIn = new Date(checkInDate);
  const maxCheckOut = new Date(checkIn);
  maxCheckOut.setDate(checkIn.getDate() + 30);
  const year = maxCheckOut.getFullYear();
  const month = String(maxCheckOut.getMonth() + 1).padStart(2, "0");
  const day = String(maxCheckOut.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isValidCheckInDate = (checkInDate) => {
  if (!checkInDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const checkIn = new Date(checkInDate);
  const maxCheckIn = new Date(today);
  maxCheckIn.setDate(today.getDate() + 30);

  return checkIn >= today && checkIn <= maxCheckIn;
};

export const isValidCheckOutDate = (checkInDate, checkOutDate) => {
  if (!checkInDate || !checkOutDate) return false;
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const maxCheckOut = new Date(checkIn);
  maxCheckOut.setDate(checkIn.getDate() + 30);

  return checkOut > checkIn && checkOut <= maxCheckOut;
};

// Hàm lấy local date yyyy-mm-dd
export const getLocalDate = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
// Convert date string (YYYY-MM-DD) to LocalDateTime format (YYYY-MM-DDTHH:mm:ss)
export const convertToLocalDateTime = (dateString, timeString = "00:00:00") => {
  if (!dateString) return null;
  return `${dateString}T${timeString}`;
};
// Helper function để format time
export const formatNotificationTime = (timestamp) => {
  const now = new Date();
  const notifTime = new Date(timestamp);
  const diffMs = now - notifTime;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return notifTime.toLocaleDateString("vi-VN");
};
