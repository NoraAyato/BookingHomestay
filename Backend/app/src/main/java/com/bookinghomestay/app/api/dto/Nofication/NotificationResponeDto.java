package com.bookinghomestay.app.api.dto.Nofication;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponeDto {

    private Long id;
    private String tieuDe;
    private String noiDung;
    private LocalDateTime ngayNhan;
    private String maLienKet;
    private boolean daDoc;
    private String notificationTypeName;
}