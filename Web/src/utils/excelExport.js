import * as XLSX from "xlsx";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Format timestamp safely for Excel export
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} Formatted date string or empty string
 */
const formatTimestamp = (timestamp) => {
  try {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    return format(date, "dd/MM/yyyy HH:mm:ss", { locale: vi });
  } catch (error) {
    return timestamp?.toString() || "";
  }
};

/**
 * Export activity logs to Excel file
 * @param {Array} activities - Array of activity log objects
 * @param {string} fileName - Optional custom file name
 */
export const exportActivityLogsToExcel = (activities, fileName) => {
  if (!activities || activities.length === 0) {
    throw new Error("Không có dữ liệu để xuất");
  }

  // Prepare data for export
  const exportData = activities.map((activity, index) => ({
    STT: index + 1,
    "Thời gian": formatTimestamp(activity.timestamp),
    "Loại hoạt động": activity.activityType || "",
    "Hành động": activity.action || "",
    "Người thực hiện": activity.userName || activity.userId || "",
    Email: activity.userEmail || "",
    "Đối tượng": activity.entityType || "",
    "ID đối tượng": activity.entityId || "",
    "Mô tả": activity.description || "",
    "IP Address": activity.ipAddress || "",
    "Trình duyệt": activity.userAgent || "",
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  ws["!cols"] = [
    { wch: 5 }, // STT
    { wch: 20 }, // Thời gian
    { wch: 15 }, // Loại hoạt động
    { wch: 15 }, // Hành động
    { wch: 20 }, // Người thực hiện
    { wch: 25 }, // Email
    { wch: 15 }, // Đối tượng
    { wch: 15 }, // ID đối tượng
    { wch: 40 }, // Mô tả
    { wch: 15 }, // IP Address
    { wch: 50 }, // Trình duyệt
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Lịch sử hoạt động");

  // Generate filename with timestamp
  const defaultFileName = `Lich_su_hoat_dong_${format(
    new Date(),
    "dd-MM-yyyy_HH-mm-ss"
  )}.xlsx`;

  // Save file
  XLSX.writeFile(wb, fileName || defaultFileName);
};

/**
 * Generic function to export any data to Excel
 * @param {Array} data - Array of objects to export
 * @param {string} sheetName - Name of the Excel sheet
 * @param {string} fileName - Name of the file to save
 * @param {Array} columnWidths - Optional array of column widths
 */
export const exportToExcel = (data, sheetName, fileName, columnWidths) => {
  if (!data || data.length === 0) {
    throw new Error("Không có dữ liệu để xuất");
  }

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);

  // Set column widths if provided
  if (columnWidths && Array.isArray(columnWidths)) {
    ws["!cols"] = columnWidths.map((width) => ({ wch: width }));
  }

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Save file
  XLSX.writeFile(wb, fileName);
};
