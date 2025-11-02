package com.bookinghomestay.app.infrastructure.mapper;

import com.bookinghomestay.app.api.dto.notification.NotificationDto;
import com.bookinghomestay.app.domain.model.Notification;
import com.bookinghomestay.app.domain.model.UserNotification;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting Notification entities to DTOs
 */
@Component
public class NotificationMapper {

    /**
     * Map UserNotification to NotificationDto
     * 
     * @param userNotification UserNotification entity
     * @return NotificationDto
     */
    public static NotificationDto toDto(UserNotification userNotification) {
        if (userNotification == null) {
            return null;
        }

        Notification notification = userNotification.getNotification();
        if (notification == null) {
            return null;
        }

        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTieuDe());
        dto.setMessage(notification.getNoiDung());
        dto.setLink(notification.getMaLienKet());
        dto.setType(
                notification.getNotificationType() != null ? notification.getNotificationType().getTypeName() : null);
        dto.setTimestamp(notification.getNgayGui());
        dto.setRead(userNotification.isDaDoc());
        return dto;
    }

    /**
     * Map Notification to NotificationDto (for broadcast notifications)
     * 
     * @param notification Notification entity
     * @return NotificationDto
     */
    public static NotificationDto toDtoFromNotification(Notification notification) {
        if (notification == null) {
            return null;
        }

        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTieuDe());
        dto.setMessage(notification.getNoiDung());
        dto.setLink(notification.getMaLienKet());
        dto.setType(
                notification.getNotificationType() != null ? notification.getNotificationType().getTypeName() : null);
        dto.setTimestamp(notification.getNgayGui());
        dto.setRead(false); // Broadcast notifications are unread by default

        return dto;
    }

    /**
     * Map list of UserNotifications to list of NotificationDtos
     * 
     * @param notifications List of UserNotification entities
     * @return List of NotificationDto
     */
    public static List<NotificationDto> toDtoList(List<UserNotification> notifications) {
        if (notifications == null) {
            return null;
        }

        return notifications.stream()
                .map(NotificationMapper::toDto)
                .collect(Collectors.toList());
    }
}
