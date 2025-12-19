package com.bookinghomestay.app.application.notification.query;

import java.util.List;
import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.INotificationRepository;
import com.bookinghomestay.app.infrastructure.mapper.NotificationMapper;
import com.bookinghomestay.app.application.notification.dto.NotificationDto;
import com.bookinghomestay.app.domain.exception.BusinessException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetUserNotificationsHandler {
    private final INotificationRepository repository;

    public List<NotificationDto> handle(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new BusinessException("Mã người dùng không được để trống");
        }

        var notifications = repository.findByUser_UserId(userId);
        return NotificationMapper.toDtoList(notifications);
    }
}
