package com.bookinghomestay.app.api.controller;

import com.bookinghomestay.app.domain.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller để test gửi thông báo
 * ✅ LƯU VÀO DB + GỬI QUA WEBSOCKET (nếu user online)
 * Xóa file này sau khi test xong
 */
@RestController
@RequestMapping("/api/test-websocket")
@RequiredArgsConstructor
@Slf4j
public class TestWebSocketController {

    private final NotificationService notificationService;

    /**
     * Test gửi thông báo đến 1 user cụ thể
     * ✅ LƯU VÀO DB + GỬI QUA WEBSOCKET (nếu user online)
     * 
     * POST http://localhost:8080/api/test-websocket/send-to-user
     * {
     * "userId": "7ce48730-56b4-44c5-a14b-29b4734d9830",
     * "title": "Test Notification",
     * "content": "This is a test message"
     * }
     */
    @PostMapping("/send-to-user")
    public ResponseEntity<String> sendToUser(@RequestBody TestNotificationRequest request) {
        log.info("🔔 Sending test notification to user: {}", request.getUserId());

        try {
            // ✅ LƯU VÀO DB + GỬI QUA WEBSOCKET
            notificationService.sendNotificationToUser(
                    request.getUserId(),
                    request.getTitle(),
                    request.getContent(),
                    null, // maLienKet
                    1L // notificationTypeId (adjust based on your DB)
            );

            return ResponseEntity.ok("✅ Sent notification to user: " + request.getUserId() +
                    " (saved to DB + WebSocket sent if online)");
        } catch (Exception e) {
            log.error("Error sending notification", e);
            return ResponseEntity.badRequest().body("❌ Error: " + e.getMessage());
        }
    }

    /**
     * Test broadcast thông báo đến tất cả user
     * ✅ LƯU VÀO DB CHO TẤT CẢ USER + BROADCAST QUA WEBSOCKET
     * 
     * POST http://localhost:8080/api/test-websocket/broadcast
     * {
     * "title": "System Announcement",
     * "content": "Maintenance in 10 minutes"
     * }
     */
    @PostMapping("/broadcast")
    public ResponseEntity<String> broadcast(@RequestBody BroadcastRequest request) {
        log.info("📢 Broadcasting notification to all users");

        try {
            // ✅ LƯU DB CHO TẤT CẢ + BROADCAST WEBSOCKET
            notificationService.sendNotificationToAll(
                    request.getTitle(),
                    request.getContent(),
                    null, // maLienKet
                    1L // notificationTypeId
            );

            return ResponseEntity.ok("✅ Broadcasted notification (saved to DB for all users + WebSocket sent)");
        } catch (Exception e) {
            log.error("Error broadcasting notification", e);
            return ResponseEntity.badRequest().body("❌ Error: " + e.getMessage());
        }
    }

    /**
     * Test lấy số thông báo chưa đọc từ DB
     * 
     * GET http://localhost:8080/api/test-websocket/unread-count?userId=user123
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(@RequestParam String userId) {
        log.info("🔢 Getting unread count for user: {}", userId);

        try {
            long count = notificationService.getUnreadCount(userId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            log.error("Error getting unread count", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // ===== REQUEST DTOs =====

    // ===== REQUEST DTOs =====

    @lombok.Data
    public static class TestNotificationRequest {
        private String userId;
        private String title;
        private String content;
    }

    @lombok.Data
    public static class BroadcastRequest {
        private String title;
        private String content;
    }
}
