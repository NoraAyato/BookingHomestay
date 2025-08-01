package com.bookinghomestay.app.application.nofication.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.api.dto.Nofication.UserNotificationResponeDto;
import com.bookinghomestay.app.domain.repository.INoficationRepository;
import com.bookinghomestay.app.infrastructure.mapper.NotificationMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetUserNotificationsHandler {
    private final INoficationRepository repository;

    public List<UserNotificationResponeDto> handle(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }

        var notifications = repository.findByUser_UserId(userId);
        return NotificationMapper.toDtoList(notifications);
    }
}
