package com.bookinghomestay.app.api.controller.user;

import com.bookinghomestay.app.application.notification.command.*;
import com.bookinghomestay.app.application.notification.dto.NotificationDto;
import com.bookinghomestay.app.application.notification.query.*;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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
    private final MarkNotificationAsReadCommandHandler markAsReadHandler;
    private final GetMyNotificationsQueryHandler getMyNotificationsHandler;
    private final GetUnreadNotificationsQueryHandler getUnreadNotificationsHandler;
    private final GetUnreadCountQueryHandler getUnreadCountHandler;
    private final SetReadNotificationHandler setReadNotificationHandler;

  
    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getMyNotifications() {
        String userId = SecurityUtils.getCurrentUserId();
        GetMyNotificationsQuery query = new GetMyNotificationsQuery(userId);
        List<NotificationDto> dtos = getMyNotificationsHandler.handle(query);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách thông báo thành công", dtos));
    }

 
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getUnreadNotifications() {
        String userId = SecurityUtils.getCurrentUserId();
     
        GetUnreadNotificationsQuery query = new GetUnreadNotificationsQuery(userId);
        List<NotificationDto> dtos = getUnreadNotificationsHandler.handle(query);

        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách thông báo chưa đọc thành công", dtos));
    }

  
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        String userId = SecurityUtils.getCurrentUserId();
      
        GetUnreadCountQuery query = new GetUnreadCountQuery(userId);
        Long count = getUnreadCountHandler.handle(query);

        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy số lượng thông báo chưa đọc thành công", count));
    }

    
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
        return ResponseEntity.ok(new ApiResponse<>(true, "Đánh dấu tất cả đã đọc thành công", null));
    }

}
