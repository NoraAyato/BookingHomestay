package com.bookinghomestay.app.application.nofication.query;

import java.util.List;
import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.INoficationRepository;
import com.bookinghomestay.app.infrastructure.mapper.NotificationMapper;
import com.bookinghomestay.app.api.dto.nofication.NotificationResponeDto;
import com.bookinghomestay.app.domain.exception.BusinessException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetUserNotificationsHandler {
    private final INoficationRepository repository;

    public List<NotificationResponeDto> handle(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new BusinessException("Mã người dùng không được để trống");
        }

        var notifications = repository.findByUser_UserId(userId);
        return NotificationMapper.toDtoList(notifications);
    }
}
