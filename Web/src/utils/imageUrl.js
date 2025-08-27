// Hàm xử lý URL ảnh, dùng chung cho toàn bộ
import { BASE_URL } from "../api/config";
export function getImageUrl(imagePath) {
  console.log("getImageUrl called with:", imagePath);
  if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
  if (
    imagePath.startsWith("/img") ||
    imagePath.startsWith("/images") ||
    imagePath.startsWith("/avatar")
  ) {
    return `${BASE_URL}${imagePath}`;
  }
  return imagePath;
}
