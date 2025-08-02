package com.bookinghomestay.app.application.nofication.query;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.api.dto.Nofication.NotificationResponeDto;
import com.bookinghomestay.app.domain.model.Notification;
import com.bookinghomestay.app.domain.repository.INoficationRepository;
import com.bookinghomestay.app.infrastructure.mapper.NotificationMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetPublicNotificationHandler {

    private final INoficationRepository notificationRepository;

    public List<NotificationResponeDto> handle() {
        List<Notification> publicNotifications = notificationRepository.findPublicNotifications();
        return publicNotifications.stream()
                .map(NotificationMapper::toDtoFromNotification)
                .collect(Collectors.toList());
    }
}
