package com.bookinghomestay.app.api.controller.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.application.admin.notification.command.SendNotificationToAllHandler;
import com.bookinghomestay.app.application.admin.notification.dto.BroadcastNotificationRequest;
import com.bookinghomestay.app.common.response.ApiResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/admin/notification")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('Admin')")
public class NotificationManagerController {
    private final SendNotificationToAllHandler sendNotificationToAllHandler;

    @PostMapping("/broadcast")
    public ResponseEntity<ApiResponse<Void>> sendNotificationToAllUsers(
            @RequestBody BroadcastNotificationRequest request) {
        sendNotificationToAllHandler.handle(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Gửi thông báo cho tất cả user thành công !", null));
    }

}
