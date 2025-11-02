package com.bookinghomestay.app.application.booking.dto.booking;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CreateBookingRequest {
    private String maPhong;
    private LocalDateTime ngayDen;
    private LocalDateTime ngayDi;
}
