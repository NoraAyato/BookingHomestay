package com.bookinghomestay.app.application.nofication.command;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SetReadNotificationCommand {
    private final Long notificationId;
}
