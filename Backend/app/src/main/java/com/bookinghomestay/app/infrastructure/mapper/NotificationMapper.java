package com.bookinghomestay.app.infrastructure.mapper;

import com.bookinghomestay.app.api.dto.Nofication.NotificationResponeDto;
import com.bookinghomestay.app.domain.model.Notification;
import com.bookinghomestay.app.domain.model.UserNotification;

import java.util.List;
import java.util.stream.Collectors;

public class NotificationMapper {

    public static NotificationResponeDto toDto(UserNotification userNotification) {
        var notification = userNotification.getNotification();

        return new NotificationResponeDto(
                userNotification.getId(),
                notification.getTieuDe(),
                notification.getNoiDung(),
                notification.getNgayGui(),
                notification.getMaLienKet(),
                userNotification.isDaDoc(),
                notification.getNotificationType().getTypeName());
    }

    public static NotificationResponeDto toDtoFromNotification(Notification notification) {
        return new NotificationResponeDto(
                notification.getId(),
                notification.getTieuDe(),
                notification.getNoiDung(),
                notification.getNgayGui(),
                notification.getMaLienKet(),
                false,
                notification.getNotificationType().getTypeName());
    }

    public static List<NotificationResponeDto> toDtoList(List<UserNotification> notifications) {
        return notifications.stream()
                .map(NotificationMapper::toDto)
                .collect(Collectors.toList());
    }
}
