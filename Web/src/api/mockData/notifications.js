import { getNotificationConfig } from "../../utils/notificationConfig";

// Mock data cho notifications
export const mockNotifications = [
  {
    id: 1,
    type: "booking",
    title: "Đặt phòng thành công",
    message:
      "Bạn đã đặt phòng tại Homestay Đà Lạt thành công cho ngày 15/11/2025",
    timestamp: "2025-10-30T10:30:00",
    isRead: false,
    ...getNotificationConfig("booking"),
  },
  {
    id: 2,
    type: "promotion",
    title: "Khuyến mãi đặc biệt",
    message: "Giảm 20% cho tất cả homestay tại Sapa. Áp dụng đến 31/12/2025",
    timestamp: "2025-10-29T15:45:00",
    isRead: false,
    ...getNotificationConfig("promotion"),
  },
  {
    id: 3,
    type: "payment",
    title: "Thanh toán thành công",
    message:
      "Đơn hàng #12345 đã được thanh toán thành công. Số tiền: 1.500.000 VNĐ",
    timestamp: "2025-10-29T09:20:00",
    isRead: true,
    ...getNotificationConfig("payment"),
  },
  {
    id: 4,
    type: "review",
    title: "Nhắc nhở đánh giá",
    message: "Hãy đánh giá trải nghiệm của bạn tại Homestay Hội An",
    timestamp: "2025-10-28T18:00:00",
    isRead: true,
    ...getNotificationConfig("review"),
  },
  {
    id: 5,
    type: "system",
    title: "Cập nhật hệ thống",
    message:
      "Hệ thống đã được cập nhật với nhiều tính năng mới. Khám phá ngay!",
    timestamp: "2025-10-27T12:00:00",
    isRead: true,
    ...getNotificationConfig("system"),
  },
  {
    id: 6,
    type: "reminder",
    title: "Nhắc nhở check-in",
    message: "Ngày check-in của bạn sắp đến. Nhớ mang theo CMND/CCCD nhé!",
    timestamp: "2025-10-26T08:00:00",
    isRead: true,
    ...getNotificationConfig("reminder"),
  },
  {
    id: 7,
    type: "discount",
    title: "Ưu đãi cuối tuần",
    message: "Đặt phòng cuối tuần giảm ngay 15%. Nhanh tay đặt ngay!",
    timestamp: "2025-10-25T14:30:00",
    isRead: true,
    ...getNotificationConfig("discount"),
  },
];

// Helper function để lấy notifications chưa đọc
export const getUnreadCount = () => {
  return mockNotifications.filter((n) => !n.isRead).length;
};
