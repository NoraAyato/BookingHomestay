package com.bookinghomestay.app.domain.model.activitylog;

/**
 * Types of activities in the system
 */
public enum ActivityType {
    BOOKING("Đặt phòng"),
    USER("Người dùng"),
    HOMESTAY("Homestay"),
    REVIEW("Đánh giá"),
    PAYMENT("Thanh toán"),
    MESSAGE("Tin nhắn"),
    PROMOTION("Khuyến mãi"),
    POLICY("Chính sách"),
    SYSTEM("Hệ thống");

    private final String displayName;

    ActivityType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
