package com.bookinghomestay.app.domain.service;

import com.bookinghomestay.app.domain.model.Notification;
import com.bookinghomestay.app.domain.model.UserNotification;

import java.util.List;

/**
 * Domain Service for notification operations
 * This interface defines the business logic contracts for notification
 * management
 */
public interface NotificationService {

    /**
     * Send notification to a specific user
     * 
     * @param userId             Target user ID
     * @param tieuDe             Notification title
     * @param noiDung            Notification content
     * @param maLienKet          Link to related entity (booking, payment, etc.)
     * @param notificationTypeId Type of notification
     * @return Created UserNotification
     */
    UserNotification sendNotificationToUser(
            String userId,
            String tieuDe,
            String noiDung,
            String maLienKet,
            Long notificationTypeId);

    /**
     * Send notification to all users (broadcast)
     * 
     * @param tieuDe             Notification title
     * @param noiDung            Notification content
     * @param maLienKet          Link to related entity
     * @param notificationTypeId Type of notification
     * @return Created Notification
     */
    Notification sendNotificationToAll(
            String tieuDe,
            String noiDung,
            String maLienKet,
            Long notificationTypeId);

    /**
     * Mark notification as read
     * 
     * @param userNotificationId UserNotification ID to mark as read
     * @return Updated UserNotification
     */
    UserNotification markAsRead(Long userNotificationId);

    /**
     * Get all notifications for a user
     * 
     * @param userId User ID
     * @return List of UserNotifications
     */
    List<UserNotification> getUserNotifications(String userId);

    /**
     * Get unread notification count for a user
     * 
     * @param userId User ID
     * @return Count of unread notifications
     */
    long getUnreadCount(String userId);
}
