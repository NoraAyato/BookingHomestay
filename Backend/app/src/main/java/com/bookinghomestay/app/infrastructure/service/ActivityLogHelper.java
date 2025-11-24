package com.bookinghomestay.app.infrastructure.service;

import com.bookinghomestay.app.application.admin.activitylog.command.LogActivityCommand;
import com.bookinghomestay.app.application.admin.activitylog.command.LogActivityCommandHandler;
import com.bookinghomestay.app.domain.model.activitylog.ActivityAction;
import com.bookinghomestay.app.domain.model.activitylog.ActivityType;
import com.bookinghomestay.app.infrastructure.security.CustomUserPrincipal;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Helper class for logging activities
 * Simplifies activity logging with automatic user context extraction
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ActivityLogHelper {

    private final LogActivityCommandHandler logActivityCommandHandler;

    /**
     * Log activity with automatic user extraction from SecurityContext
     * 
     * @param activityType Type of activity
     * @param action       Action performed
     * @param title        Activity title
     * @param description  Detailed description
     * @param entityType   Type of entity affected
     * @param entityId     ID of entity affected
     * @param request      HTTP request for IP and user agent
     * @param metadata     Additional metadata as JSON string
     */
    public void log(
            ActivityType activityType,
            ActivityAction action,
            String title,
            String description,
            String entityType,
            String entityId,
            HttpServletRequest request,
            String metadata) {
        try {
            // Get user info from SecurityUtils
            String userId = SecurityUtils.getCurrentUserId();
            String userName = SecurityUtils.getCurrentUsername();
            CustomUserPrincipal principal = SecurityUtils.getCurrentUserPrincipal();

            // Default to system if no authenticated user
            if (userId == null) {
                userId = "system";
                userName = "System";
            }

            // Get user role from CustomUserPrincipal
            String userRole = "SYSTEM";
            if (principal != null) {
                userRole = principal.getAuthorities().stream()
                        .findFirst()
                        .map(ga -> ga.getAuthority().replace("ROLE_", ""))
                        .orElse("USER");
            }

            String ipAddress = null;
            String userAgent = null;
            String requestUrl = null;

            if (request != null) {
                ipAddress = extractIpAddress(request);
                userAgent = request.getHeader("User-Agent");
                requestUrl = request.getRequestURI();
                if (request.getQueryString() != null) {
                    requestUrl += "?" + request.getQueryString();
                }
            }

            LogActivityCommand command = LogActivityCommand.builder()
                    .userId(userId)
                    .userName(userName)
                    .userRole(userRole)
                    .activityType(activityType)
                    .action(action)
                    .title(title)
                    .description(description)
                    .entityType(entityType)
                    .entityId(entityId)
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .requestUrl(requestUrl)
                    .metadata(metadata)
                    .build();

            logActivityCommandHandler.handle(command);
        } catch (Exception e) {
            log.error("Failed to log activity", e);
        }
    }

    /**
     * Log activity without HTTP request context
     */
    public void log(
            ActivityType activityType,
            ActivityAction action,
            String title,
            String description,
            String entityType,
            String entityId) {
        log(activityType, action, title, description, entityType, entityId, null, null);
    }

    /**
     * Log activity with metadata
     */
    public void log(
            ActivityType activityType,
            ActivityAction action,
            String title,
            String description,
            String entityType,
            String entityId,
            String metadata) {
        log(activityType, action, title, description, entityType, entityId, null, metadata);
    }

    /**
     * Extract IP address from request (handles X-Forwarded-For)
     */
    private String extractIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // If multiple IPs, take the first one
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }

    // ==================== BOOKING ACTIVITIES ====================

    /**
     * Log booking creation
     */
    public void logBookingCreated(String bookingId, String roomName, String checkIn, String checkOut) {
        log(
                ActivityType.BOOKING,
                ActivityAction.CREATE,
                "Tạo đặt phòng mới",
                String.format("Đặt phòng %s từ %s đến %s", roomName, checkIn, checkOut),
                "Booking",
                bookingId,
                null,
                null);
    }

    /**
     * Log booking confirmation
     */
    public void logBookingConfirmed(String bookingId) {
        log(
                ActivityType.BOOKING,
                ActivityAction.APPROVE,
                "Xác nhận đặt phòng",
                String.format("Đơn đặt phòng #%s đã được xác nhận", bookingId),
                "Booking",
                bookingId,
                null,
                null);
    }

    /**
     * Log booking cancellation
     */
    public void logBookingCancelled(String bookingId, String reason) {
        log(
                ActivityType.BOOKING,
                ActivityAction.CANCEL,
                "Hủy đặt phòng",
                String.format("Đơn đặt phòng #%s đã bị hủy. Lý do: %s", bookingId, reason),
                "Booking",
                bookingId,
                null,
                null);
    }

    // ==================== USER ACTIVITIES ====================

    /**
     * Log user login
     */
    public void logUserLogin() {
        String username = SecurityUtils.getCurrentUsername();
        log(
                ActivityType.USER,
                ActivityAction.LOGIN,
                "Đăng nhập hệ thống",
                String.format("Người dùng %s đã đăng nhập", username),
                "User",
                SecurityUtils.getCurrentUserId(),
                null,
                null);
    }

    /**
     * Log user registration
     */
    public void logUserRegistered(String userId, String email) {
        log(
                ActivityType.USER,
                ActivityAction.CREATE,
                "Đăng ký tài khoản mới",
                String.format("Tài khoản mới với email %s đã được đăng ký", email),
                "User",
                userId,
                null,
                null);
    }

    /**
     * Log user profile update
     */
    public void logUserUpdated(String userId) {
        log(
                ActivityType.USER,
                ActivityAction.UPDATE,
                "Cập nhật thông tin người dùng",
                String.format("Thông tin người dùng #%s đã được cập nhật", userId),
                "User",
                userId,
                null,
                null);
    }

    // ==================== PAYMENT ACTIVITIES ====================

    /**
     * Log payment creation
     */
    public void logPaymentCreated(String paymentId, String bookingId, double amount) {
        log(
                ActivityType.PAYMENT,
                ActivityAction.CREATE,
                "Tạo thanh toán mới",
                String.format("Thanh toán %.0f VNĐ cho đơn #%s", amount, bookingId),
                "Payment",
                paymentId,
                null,
                null);
    }

    /**
     * Log payment success
     */
    public void logPaymentSuccess(String paymentId, String bookingId) {
        log(
                ActivityType.PAYMENT,
                ActivityAction.APPROVE,
                "Thanh toán thành công",
                String.format("Thanh toán #%s cho đơn #%s đã thành công", paymentId, bookingId),
                "Payment",
                paymentId,
                null,
                null);
    }

    // ==================== HOMESTAY ACTIVITIES ====================

    /**
     * Log homestay created
     */
    public void logHomestayCreated(String homestayId, String homestayName) {
        log(
                ActivityType.HOMESTAY,
                ActivityAction.CREATE,
                "Tạo homestay mới",
                String.format("Homestay '%s' đã được tạo", homestayName),
                "Homestay",
                homestayId,
                null,
                null);
    }

    /**
     * Log homestay updated
     */
    public void logHomestayUpdated(String homestayId, String homestayName) {
        log(
                ActivityType.HOMESTAY,
                ActivityAction.UPDATE,
                "Cập nhật homestay",
                String.format("Homestay '%s' đã được cập nhật", homestayName),
                "Homestay",
                homestayId,
                null,
                null);
    }

    // ==================== REVIEW ACTIVITIES ====================

    /**
     * Log review created
     */
    public void logReviewCreated(String reviewId, String homestayName, int rating) {
        log(
                ActivityType.REVIEW,
                ActivityAction.CREATE,
                "Tạo đánh giá mới",
                String.format("Đánh giá %d sao cho '%s'", rating, homestayName),
                "Review",
                reviewId,
                null,
                null);
    }
}
