package com.bookinghomestay.app.application.admin.notification.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.notification.dto.BroadcastNotificationRequest;
import com.bookinghomestay.app.domain.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SendNotificationToAllHandler {
    private final NotificationService notificationService;

    public void handle(BroadcastNotificationRequest request) {
        notificationService.sendNotificationToAll(request.getTitle(), request.getContent(), null, 4L);
    }
}
