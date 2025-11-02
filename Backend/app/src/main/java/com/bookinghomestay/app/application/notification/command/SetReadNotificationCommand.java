package com.bookinghomestay.app.application.notification.command;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SetReadNotificationCommand {
    private final String userId;
}
