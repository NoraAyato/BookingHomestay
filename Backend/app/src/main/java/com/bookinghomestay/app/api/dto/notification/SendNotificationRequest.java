package com.bookinghomestay.app.api.dto.notification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for sending notifications
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendNotificationRequest {

    @NotBlank(message = "Tiêu đề không được để trống")
    private String tieuDe;

    @NotBlank(message = "Nội dung không được để trống")
    private String noiDung;

    private String maLienKet; // Link to booking, payment, etc.

    @NotNull(message = "Loại thông báo không được để trống")
    private Long notificationTypeId;

    private String targetUserId; // Null = broadcast to all

    private boolean forAll = false; // true = send to all users
}
