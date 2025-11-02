package com.bookinghomestay.app.application.notification.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Command to broadcast notification to all users
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendNotificationToAllCommand {
    private String tieuDe;
    private String noiDung;
    private String maLienKet;
    private Long notificationTypeId;
}
