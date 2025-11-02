package com.bookinghomestay.app.application.notification.query;

import com.bookinghomestay.app.api.dto.notification.NotificationDto;
import com.bookinghomestay.app.domain.model.UserNotification;
import com.bookinghomestay.app.infrastructure.mapper.NotificationMapper;
import com.bookinghomestay.app.infrastructure.persistence.repository.JpaNoficationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Query handler for getting unread notifications for a user
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GetUnreadNotificationsQueryHandler {

    private final JpaNoficationRepository userNotificationRepository;

    public List<NotificationDto> handle(GetUnreadNotificationsQuery query) {
        log.info("Handling GetUnreadNotificationsQuery for user: {}", query.getUserId());

        List<UserNotification> notifications = userNotificationRepository
                .findByUser_UserIdAndDaDocFalse(query.getUserId());

        return NotificationMapper.toDtoList(notifications);
    }
}
