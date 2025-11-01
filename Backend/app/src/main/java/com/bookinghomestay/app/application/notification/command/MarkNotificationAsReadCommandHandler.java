package com.bookinghomestay.app.application.notification.command;

import com.bookinghomestay.app.api.dto.notification.NotificationDto;
import com.bookinghomestay.app.domain.model.UserNotification;
import com.bookinghomestay.app.infrastructure.mapper.NotificationMapper;
import com.bookinghomestay.app.infrastructure.persistence.repository.JpaNoficationRepository;
import com.bookinghomestay.app.infrastructure.websocket.WebSocketNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for marking notification as read
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MarkNotificationAsReadCommandHandler {

        private final JpaNoficationRepository userNotificationRepository;
        private final WebSocketNotificationService webSocketService;

        @Transactional
        public NotificationDto handle(MarkNotificationAsReadCommand command) {
                log.info("Handling MarkNotificationAsReadCommand for userNotificationId: {}",
                                command.getUserNotificationId());

                // 1. Find UserNotification
                UserNotification userNotification = userNotificationRepository
                                .findById(command.getUserNotificationId())
                                .orElseThrow(() -> new RuntimeException(
                                                "UserNotification not found: " + command.getUserNotificationId()));

                // 2. Mark as read
                userNotification.setDaDoc(true);
                userNotification = userNotificationRepository.save(userNotification);

                // 3. Update unread count via WebSocket
                String userId = userNotification.getUser().getUserId();
                long unreadCount = userNotificationRepository
                                .findByUser_UserIdAndDaDocFalse(userId).size();
                webSocketService.sendUnreadCountUpdate(userId, unreadCount);

                log.info("Successfully marked notification as read for user: {}", userId);

                // 4. Map to DTO and return
                return NotificationMapper.toDto(userNotification);
        }
}
