package com.bookinghomestay.app.domain.model.activitylog;

/**
 * Actions performed on entities
 */
public enum ActivityAction {
    CREATE("Tạo mới"),
    UPDATE("Cập nhật"),
    DELETE("Xóa"),
    CANCEL("Hủy"),
    APPROVE("Phê duyệt"),
    REJECT("Từ chối"),
    LOGIN("Đăng nhập"),
    LOGOUT("Đăng xuất"),
    VIEW("Xem"),
    EXPORT("Xuất dữ liệu");

    private final String displayName;

    ActivityAction(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
