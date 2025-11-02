package com.bookinghomestay.app.infrastructure.service;

import com.bookinghomestay.app.application.notification.dto.NotificationDto;
import com.bookinghomestay.app.domain.model.Notification;
import com.bookinghomestay.app.domain.model.NotificationType;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.model.UserNotification;
import com.bookinghomestay.app.domain.service.NotificationService;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaNotificationRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaNotificationTypeRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaUserNotificationRepository;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaUserRepository;
import com.bookinghomestay.app.infrastructure.websocket.WebSocketNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implementation of NotificationService
 * Handles both DB persistence and real-time WebSocket delivery
 * 
 * FLOW:
 * 1. Save notification to DB (persistence)
 * 2. If user is online → Send via WebSocket (real-time)
 * 3. If user is offline → Notification waits in DB
 * 4. When user logs in → Fetch unread notifications from DB
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final JpaNotificationRepository notificationRepository;
    private final JpaUserNotificationRepository userNotificationRepository;
    private final JpaNotificationTypeRepository notificationTypeRepository;
    private final JpaUserRepository userRepository;
    private final WebSocketNotificationService webSocketNotificationService;

    /**
     * Send notification to a specific user
     * 1. Save to DB
     * 2. Try to send via WebSocket (if user is online)
     */
    @Override
    public UserNotification sendNotificationToUser(
            String userId,
            String tieuDe,
            String noiDung,
            String maLienKet,
            Long notificationTypeId) {

        log.info("📝 Creating notification for user {}: {}", userId, tieuDe);

        // 1. Validate user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // 2. Validate notification type
        NotificationType notificationType = notificationTypeRepository.findById(notificationTypeId)
                .orElseThrow(() -> new IllegalArgumentException("NotificationType not found: " + notificationTypeId));

        // 3. Create and save Notification
        Notification notification = new Notification();
        notification.setTieuDe(tieuDe);
        notification.setNoiDung(noiDung);
        notification.setMaLienKet(maLienKet);
        notification.setNgayGui(LocalDateTime.now());
        notification.setNotificationType(notificationType);
        notification = notificationRepository.save(notification);

        // 4. Create and save UserNotification (link user to notification)
        UserNotification userNotification = new UserNotification();
        userNotification.setUser(user);
        userNotification.setNotification(notification);
        userNotification.setDaDoc(false);
        userNotification = userNotificationRepository.save(userNotification);

        log.info("✅ Notification saved to DB with ID: {}", notification.getId());

        // 5. Try to send via WebSocket (real-time delivery)
        try {
            NotificationDto dto = convertToDto(notification);
            webSocketNotificationService.sendNotificationToUser(userId, dto);
            log.info("📡 Sent notification via WebSocket to user: {}", userId);
        } catch (Exception e) {
            // User might be offline, that's OK - notification is in DB
            log.warn("⚠️ Failed to send WebSocket notification to user {} (might be offline): {}",
                    userId, e.getMessage());
        }

        // 6. Update unread count
        try {
            long unreadCount = userNotificationRepository.countByUserUserIdAndDaDoc(userId, false);
            webSocketNotificationService.sendUnreadCountUpdate(userId, unreadCount);
        } catch (Exception e) {
            log.warn("⚠️ Failed to send unread count update: {}", e.getMessage());
        }

        return userNotification;
    }

    /**
     * Send notification to all users (broadcast)
     * 1. Save to DB
     * 2. Create UserNotification for all users
     * 3. Broadcast via WebSocket to all online users
     */
    @Override
    public Notification sendNotificationToAll(
            String tieuDe,
            String noiDung,
            String maLienKet,
            Long notificationTypeId) {

        log.info("📢 Creating broadcast notification: {}", tieuDe);

        // 1. Validate notification type
        NotificationType notificationType = notificationTypeRepository.findById(notificationTypeId)
                .orElseThrow(() -> new IllegalArgumentException("NotificationType not found: " + notificationTypeId));

        // 2. Create and save Notification
        Notification notification = new Notification();
        notification.setTieuDe(tieuDe);
        notification.setNoiDung(noiDung);
        notification.setMaLienKet(maLienKet);
        notification.setNgayGui(LocalDateTime.now());
        notification.setForAll(true);
        notification.setNotificationType(notificationType);
        notification = notificationRepository.save(notification);

        // 3. Create UserNotification for all active users
        List<User> allUsers = userRepository.findAll(); // Consider adding pagination for large user base
        for (User user : allUsers) {
            UserNotification userNotification = new UserNotification();
            userNotification.setUser(user);
            userNotification.setNotification(notification);
            userNotification.setDaDoc(false);
            userNotificationRepository.save(userNotification);
        }

        log.info("✅ Broadcast notification saved to DB for {} users", allUsers.size());

        // 4. Broadcast via WebSocket (to all online users)
        try {
            NotificationDto dto = convertToDto(notification);
            webSocketNotificationService.broadcastNotification(dto);
            log.info("📡 Broadcasted notification via WebSocket");
        } catch (Exception e) {
            log.warn("⚠️ Failed to broadcast WebSocket notification: {}", e.getMessage());
        }

        return notification;
    }

    /**
     * Mark notification as read
     */
    @Override
    public UserNotification markAsRead(Long userNotificationId) {
        log.info("✓ Marking notification {} as read", userNotificationId);

        UserNotification userNotification = userNotificationRepository.findById(userNotificationId)
                .orElseThrow(() -> new IllegalArgumentException("UserNotification not found: " + userNotificationId));

        userNotification.setDaDoc(true);
        userNotification = userNotificationRepository.save(userNotification);

        // Update unread count
        try {
            String userId = userNotification.getUser().getUserId();
            long unreadCount = userNotificationRepository.countByUserUserIdAndDaDoc(userId, false);
            webSocketNotificationService.sendUnreadCountUpdate(userId, unreadCount);
        } catch (Exception e) {
            log.warn("⚠️ Failed to send unread count update: {}", e.getMessage());
        }

        return userNotification;
    }

    /**
     * Get all notifications for a user
     */
    @Override
    @Transactional(readOnly = true)
    public List<UserNotification> getUserNotifications(String userId) {
        return userNotificationRepository.findByUserUserIdOrderByIdDesc(userId);
    }

    /**
     * Get unread notification count for a user
     */
    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(String userId) {
        return userNotificationRepository.countByUserUserIdAndDaDoc(userId, false);
    }

    /**
     * Convert Notification entity to DTO for WebSocket
     */
    private NotificationDto convertToDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .title(notification.getTieuDe())
                .message(notification.getNoiDung())
                .link(notification.getMaLienKet())
                .timestamp(notification.getNgayGui())
                .type(notification.getNotificationType().getTypeName())
                .isRead(false)
                .build();
    }
}
