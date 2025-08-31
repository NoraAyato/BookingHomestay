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
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Hàm format ngày dạng dd/mm/yyyy
export const formatDateDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
