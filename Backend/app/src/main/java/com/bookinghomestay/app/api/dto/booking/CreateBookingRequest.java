package com.bookinghomestay.app.api.dto.booking;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateBookingRequest {
    private String maPhong;
    private LocalDateTime ngayDen;
    private LocalDateTime ngayDi;
}
