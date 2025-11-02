package com.bookinghomestay.app.application.notification.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Command to mark notification as read
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarkNotificationAsReadCommand {
    private Long userNotificationId;
}
