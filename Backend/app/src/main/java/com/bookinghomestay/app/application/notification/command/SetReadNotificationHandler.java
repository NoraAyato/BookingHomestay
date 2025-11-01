package com.bookinghomestay.app.application.notification.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.INoficationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SetReadNotificationHandler {
    private final INoficationRepository repository;

    public void handle(SetReadNotificationCommand command) {
        try {
            if (command.getUserId() == null) {
                throw new IllegalArgumentException("User ID cannot be null");
            }
            var notifications = repository.findByUser_UserId(command.getUserId());
            notifications.forEach(notification -> {
                if (!notification.isDaDoc()) {
                    notification.setDaDoc(true);
                    repository.save(notification);
                }
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to mark all notifications as read: " + e.getMessage(), e);
        }
    }
}
