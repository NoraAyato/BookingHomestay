package com.bookinghomestay.app.application.admin.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BroadcastNotificationRequest {
    private String title;
    private String content;
}
