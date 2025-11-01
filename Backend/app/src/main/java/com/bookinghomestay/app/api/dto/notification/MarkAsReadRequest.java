package com.bookinghomestay.app.api.dto.notification;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for marking notification as read
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarkAsReadRequest {

    @NotNull(message = "ID UserNotification không được để trống")
    private Long userNotificationId;
}
