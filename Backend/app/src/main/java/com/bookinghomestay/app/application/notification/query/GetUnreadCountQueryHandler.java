package com.bookinghomestay.app.application.notification.query;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.bookinghomestay.app.infrastructure.persistence.repository.jpa.JpaNoficationRepository;

/**
 * Query handler for getting unread notification count for a user
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GetUnreadCountQueryHandler {

    private final JpaNoficationRepository userNotificationRepository;

    public Long handle(GetUnreadCountQuery query) {
        log.info("Handling GetUnreadCountQuery for user: {}", query.getUserId());

        long count = userNotificationRepository
                .findByUser_UserIdAndDaDocFalse(query.getUserId())
                .size();

        return count;
    }
}
