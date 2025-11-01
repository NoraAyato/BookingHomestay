package com.bookinghomestay.app.infrastructure.websocket;

import com.bookinghomestay.app.api.dto.notification.NotificationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Infrastructure service for sending WebSocket notifications
 * Uses STOMP over WebSocket to send real-time notifications to clients
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotificationToUser(String userId, NotificationDto notification) {
        try {
            // Send to /user/{userId}/queue/notifications
            // Client subscribes to /user/queue/notifications
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/notifications",
                    notification);
            log.info("Sent notification to user {}: {}", userId, notification.getTitle());
        } catch (Exception e) {
            log.error("Error sending notification to user {}: {}", userId, e.getMessage(), e);
        }
    }

    public void broadcastNotification(NotificationDto notification) {
        try {
            // Send to /topic/broadcast
            messagingTemplate.convertAndSend("/topic/broadcast", notification);
            log.info("Broadcasted notification: {}", notification.getTitle());
        } catch (Exception e) {
            log.error("Error broadcasting notification: {}", e.getMessage(), e);
        }
    }

    public void sendUnreadCountUpdate(String userId, long unreadCount) {
        try {
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/unread-count",
                    unreadCount);
            log.info("Sent unread count {} to user {}", unreadCount, userId);
        } catch (Exception e) {
            log.error("Error sending unread count to user {}: {}", userId, e.getMessage(), e);
        }
    }
}
