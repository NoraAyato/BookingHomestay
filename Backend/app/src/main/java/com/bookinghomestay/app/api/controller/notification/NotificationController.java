package com.bookinghomestay.app.api.controller.notification;

import com.bookinghomestay.app.api.dto.common.ApiResponse;
import com.bookinghomestay.app.api.dto.notification.NotificationDto;
import com.bookinghomestay.app.api.dto.notification.SendNotificationRequest;
import com.bookinghomestay.app.application.notification.command.*;
import com.bookinghomestay.app.application.notification.query.*;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for notification operations
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Slf4j
public class NotificationController {

    private final SendNotificationToUserCommandHandler sendToUserHandler;
    private final SendNotificationToAllCommandHandler sendToAllHandler;
    private final MarkNotificationAsReadCommandHandler markAsReadHandler;
    private final GetMyNotificationsQueryHandler getMyNotificationsHandler;
    private final GetUnreadNotificationsQueryHandler getUnreadNotificationsHandler;
    private final GetUnreadCountQueryHandler getUnreadCountHandler;
    private final SetReadNotificationHandler setReadNotificationHandler;
    /**
     * Get all notifications for current user
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getMyNotifications() {
        String userId = SecurityUtils.getCurrentUserId();
        log.info("Getting notifications for user: {}", userId);

        GetMyNotificationsQuery query = new GetMyNotificationsQuery(userId);
        List<NotificationDto> dtos = getMyNotificationsHandler.handle(query);

        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách thông báo thành công", dtos));
    }

    /**
     * Get unread notifications for current user
     */
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getUnreadNotifications() {
        String userId = SecurityUtils.getCurrentUserId();
        log.info("Getting unread notifications for user: {}", userId);

        GetUnreadNotificationsQuery query = new GetUnreadNotificationsQuery(userId);
        List<NotificationDto> dtos = getUnreadNotificationsHandler.handle(query);

        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách thông báo chưa đọc thành công", dtos));
    }

    /**
     * Get unread notification count
     */
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        String userId = SecurityUtils.getCurrentUserId();
        log.info("Getting unread count for user: {}", userId);

        GetUnreadCountQuery query = new GetUnreadCountQuery(userId);
        Long count = getUnreadCountHandler.handle(query);

        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy số lượng thông báo chưa đọc thành công", count));
    }

    /**
     * Mark notification as read
     */
    @PutMapping("/{userNotificationId}/read")
    public ResponseEntity<ApiResponse<NotificationDto>> markAsRead(
            @PathVariable Long userNotificationId) {

        MarkNotificationAsReadCommand command = new MarkNotificationAsReadCommand(userNotificationId);
        NotificationDto dto = markAsReadHandler.handle(command);

        return ResponseEntity.ok(new ApiResponse<>(true, "Đánh dấu đã đọc thành công", dto));
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<NotificationDto>> markAllAsRead() {
        String userId = SecurityUtils.getCurrentUserId();
        SetReadNotificationCommand command = new SetReadNotificationCommand(userId);
        setReadNotificationHandler.handle(command);
        // Assuming you have a handler for this command
        return ResponseEntity.ok(new ApiResponse<>(true, "Đánh dấu tất cả đã đọc thành công", null));
    }

    /**
     * Send notification to specific user (Admin only)
     */
    @PostMapping("/send-to-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<NotificationDto>> sendToUser(
            @Valid @RequestBody SendNotificationRequest request) {
        log.info("Sending notification to user: {}", request.getTargetUserId());

        SendNotificationToUserCommand command = new SendNotificationToUserCommand(
                request.getTargetUserId(),
                request.getTieuDe(),
                request.getNoiDung(),
                request.getMaLienKet(),
                request.getNotificationTypeId());

        NotificationDto dto = sendToUserHandler.handle(command);

        return ResponseEntity.ok(new ApiResponse<>(true, "Gửi thông báo thành công", dto));
    }

    /**
     * Broadcast notification to all users (Admin only)
     */
    @PostMapping("/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<NotificationDto>> broadcastToAll(
            @Valid @RequestBody SendNotificationRequest request) {
        log.info("Broadcasting notification to all users");

        SendNotificationToAllCommand command = new SendNotificationToAllCommand(
                request.getTieuDe(),
                request.getNoiDung(),
                request.getMaLienKet(),
                request.getNotificationTypeId());

        NotificationDto dto = sendToAllHandler.handle(command);

        return ResponseEntity.ok(new ApiResponse<>(true, "Phát thông báo đến tất cả người dùng thành công", dto));
    }
}
