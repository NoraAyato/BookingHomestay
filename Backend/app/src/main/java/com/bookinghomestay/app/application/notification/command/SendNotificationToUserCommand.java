package com.bookinghomestay.app.application.notification.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Command to send notification to a specific user
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendNotificationToUserCommand {
    private String userId;
    private String tieuDe;
    private String noiDung;
    private String maLienKet;
    private Long notificationTypeId;
}
