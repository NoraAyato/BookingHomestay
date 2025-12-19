package com.bookinghomestay.app.application.notification.query;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.notification.dto.NotificationDto;
import com.bookinghomestay.app.domain.model.Notification;
import com.bookinghomestay.app.domain.repository.INotificationRepository;
import com.bookinghomestay.app.infrastructure.mapper.NotificationMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetPublicNotificationHandler {

    private final INotificationRepository notificationRepository;

    public List<NotificationDto> handle() {
        List<Notification> publicNotifications = notificationRepository.findPublicNotifications();
        return publicNotifications.stream()
                .map(NotificationMapper::toDtoFromNotification)
                .collect(Collectors.toList());
    }
}
