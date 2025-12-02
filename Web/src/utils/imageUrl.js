// Hàm xử lý URL ảnh, dùng chung cho toàn bộ
import { BASE_URL } from "../api/config";
export function getImageUrl(imagePath) {
  if (!imagePath) return "/avatar/default-user.png"; // Đặt file default.png vào public/avatar
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  if (
    imagePath.startsWith("/img") ||
    imagePath.startsWith("/images") ||
    imagePath.startsWith("/avatar")
  ) {
    return `${BASE_URL}${imagePath}`;
  }
  return imagePath;
}
