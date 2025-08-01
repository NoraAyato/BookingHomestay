package com.bookinghomestay.app.infrastructure.mapper;

import com.bookinghomestay.app.domain.model.UserNotification;
import com.bookinghomestay.app.api.dto.Nofication.UserNotificationResponeDto;

import java.util.List;
import java.util.stream.Collectors;

public class NotificationMapper {
    public static UserNotificationResponeDto toDto(UserNotification entity) {
        return new UserNotificationResponeDto(
                entity.getId(),
                entity.getTieuDe(),
                entity.getNoiDung(),
                entity.getNgayNhan(),
                entity.getMaLienKet(),
                entity.isDaDoc(),
                entity.getNotificationType().getTypeName());
    }

    public static List<UserNotificationResponeDto> toDtoList(List<UserNotification> list) {
        return list.stream()
                .map(NotificationMapper::toDto)
                .collect(Collectors.toList());
    }
}
