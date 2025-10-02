// Hàm chuẩn hóa chuỗi để so sánh
export const normalizeString = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/\s+/g, " ") // Chuẩn hóa khoảng trắng
    .trim();
};
// Xử lý mô tả có \n thành HTML xuống dòng
export function renderDescription(desc) {
  if (!desc) return "";
  // Thay thế \n hoặc \n\n thành <br />
  return desc.replace(/\\n/g, "");
}
