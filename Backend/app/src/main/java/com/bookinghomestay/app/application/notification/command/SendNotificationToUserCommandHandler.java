package com.bookinghomestay.app.application.notification.command;

import com.bookinghomestay.app.api.dto.notification.NotificationDto;
import com.bookinghomestay.app.domain.model.Notification;
import com.bookinghomestay.app.domain.model.NotificationType;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.model.UserNotification;
import com.bookinghomestay.app.infrastructure.mapper.NotificationMapper;
import com.bookinghomestay.app.infrastructure.persistence.repository.JpaNoficationRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.JpaNotificationRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.JpaNotificationTypeRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.JpaUserRepository;
import com.bookinghomestay.app.infrastructure.websocket.WebSocketNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Command handler for sending notification to a specific user
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SendNotificationToUserCommandHandler {

    private final JpaNotificationRepository notificationRepository;
    private final JpaNoficationRepository userNotificationRepository;
    private final JpaUserRepository userRepository;
    private final JpaNotificationTypeRepository notificationTypeRepository;
    private final WebSocketNotificationService webSocketService;

    @Transactional
    public NotificationDto handle(SendNotificationToUserCommand command) {
        log.info("Handling SendNotificationToUserCommand for user: {}", command.getUserId());

        // 1. Validate user exists
        User user = userRepository.findById(command.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + command.getUserId()));

        // 2. Validate notification type exists
        NotificationType notificationType = notificationTypeRepository.findById(command.getNotificationTypeId())
                .orElseThrow(
                        () -> new RuntimeException("NotificationType not found: " + command.getNotificationTypeId()));

        // 3. Create and save Notification
        Notification notification = new Notification();
        notification.setTieuDe(command.getTieuDe());
        notification.setNoiDung(command.getNoiDung());
        notification.setMaLienKet(command.getMaLienKet());
        notification.setForAll(false); // Personal notification
        notification.setNgayGui(LocalDateTime.now());
        notification.setNotificationType(notificationType);
        notification = notificationRepository.save(notification);

        // 4. Create and save UserNotification
        UserNotification userNotification = new UserNotification();
        userNotification.setUser(user);
        userNotification.setNotification(notification);
        userNotification.setDaDoc(false);
        userNotification = userNotificationRepository.save(userNotification);

        // 5. Send via WebSocket
        NotificationDto dto = NotificationMapper.toDto(userNotification);
        webSocketService.sendNotificationToUser(command.getUserId(), dto);

        // 6. Update unread count
        long unreadCount = userNotificationRepository.findByUser_UserIdAndDaDocFalse(command.getUserId()).size();
        webSocketService.sendUnreadCountUpdate(command.getUserId(), unreadCount);

        log.info("Successfully sent notification to user: {}", command.getUserId());
        return dto;
    }

}
