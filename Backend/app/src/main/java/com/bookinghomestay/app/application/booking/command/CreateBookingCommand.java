package com.bookinghomestay.app.application.booking.command;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateBookingCommand {
    private String userId;
    private String maPhong;
    private LocalDateTime ngayDen;
    private LocalDateTime ngayDi;
}
