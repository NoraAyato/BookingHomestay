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
import java.util.List;

/**
 * Command handler for broadcasting notification to all users
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SendNotificationToAllCommandHandler {

    private final JpaNotificationRepository notificationRepository;
    private final JpaNoficationRepository userNotificationRepository;
    private final JpaUserRepository userRepository;
    private final JpaNotificationTypeRepository notificationTypeRepository;
    private final WebSocketNotificationService webSocketService;

    @Transactional
    public NotificationDto handle(SendNotificationToAllCommand command) {
        log.info("Handling SendNotificationToAllCommand: {}", command.getTieuDe());

        // 1. Validate notification type exists
        NotificationType notificationType = notificationTypeRepository.findById(command.getNotificationTypeId())
                .orElseThrow(
                        () -> new RuntimeException("không tìm thấy thông báo này !"));

        // 2. Create and save Notification
        Notification notification = new Notification();
        notification.setTieuDe(command.getTieuDe());
        notification.setNoiDung(command.getNoiDung());
        notification.setMaLienKet(command.getMaLienKet());
        notification.setForAll(true); // Broadcast notification
        notification.setNgayGui(LocalDateTime.now());
        notification.setNotificationType(notificationType);
        notification = notificationRepository.save(notification);

        // 3. Create UserNotification for all users
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            UserNotification userNotification = new UserNotification();
            userNotification.setUser(user);
            userNotification.setNotification(notification);
            userNotification.setDaDoc(false);
            userNotificationRepository.save(userNotification);
        }

        // 4. Broadcast via WebSocket
        NotificationDto dto = NotificationMapper.toDtoFromNotification(notification);
        webSocketService.broadcastNotification(dto);

        log.info("Successfully broadcasted notification to all users");
        return dto;
    }
}
