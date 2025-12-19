package com.bookinghomestay.app.application.notification.query;

import com.bookinghomestay.app.application.notification.dto.NotificationDto;
import com.bookinghomestay.app.domain.model.UserNotification;
import com.bookinghomestay.app.infrastructure.mapper.NotificationMapper;
import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaNoficationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Query handler for getting all notifications for a user
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GetMyNotificationsQueryHandler {

    private final JpaNoficationRepository userNotificationRepository;

    public List<NotificationDto> handle(GetMyNotificationsQuery query) {
        log.info("Handling GetMyNotificationsQuery for user: {}", query.getUserId());

        List<UserNotification> notifications = userNotificationRepository
                .findByUser_UserId(query.getUserId()).stream()
                .sorted((n1, n2) -> n2.getNotification().getNgayGui().compareTo(n1.getNotification().getNgayGui()))
                .toList();

        return NotificationMapper.toDtoList(notifications);
    }
}
