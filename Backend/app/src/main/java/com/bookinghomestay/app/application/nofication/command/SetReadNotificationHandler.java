package com.bookinghomestay.app.application.nofication.command;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.repository.INoficationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SetReadNotificationHandler {
    private final INoficationRepository repository;

    public void handle(SetReadNotificationCommand command) {
        if (command.getNotificationId() == null) {
            throw new IllegalArgumentException("Notification ID cannot be null");
        }
        var notification = repository.findById(command.getNotificationId())
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setDaDoc(true);   
        repository.save(notification);
    }
}
