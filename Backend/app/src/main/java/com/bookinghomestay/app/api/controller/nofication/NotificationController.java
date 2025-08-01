package com.bookinghomestay.app.api.controller.nofication;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.api.dto.ApiResponse;
import com.bookinghomestay.app.api.dto.Nofication.UserNotificationResponeDto;
import com.bookinghomestay.app.api.dto.promotion.PromotionResponeDto;
import com.bookinghomestay.app.application.nofication.command.SetReadNotificationCommand;
import com.bookinghomestay.app.application.nofication.command.SetReadNotificationHandler;
import com.bookinghomestay.app.application.nofication.query.GetUserNotificationsHandler;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final GetUserNotificationsHandler getUserNotificationsHandler;
    private final SetReadNotificationHandler setReadNotificationHandler;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<UserNotificationResponeDto>>> getMyNotifications() {
        String userId = SecurityUtils.getCurrentUserId(); // bạn cần cài sẵn SecurityUtils
        var notifications = getUserNotificationsHandler.handle(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách thông báo thành công!", notifications));
    }

    @PutMapping("/read/{id}")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable("id") Long notificationId) {
        setReadNotificationHandler.handle(new SetReadNotificationCommand(notificationId));
        return ResponseEntity.ok(new ApiResponse<>(true, "Đánh dấu đã đọc thành công!", null));
    }
}
