package com.bookinghomestay.app.application.homestay.query;

import lombok.*;
import java.time.LocalDate;

@AllArgsConstructor
@Getter
public class GetRoomAvailabilityQuery {
    private String homestayId;
    private LocalDate ngayDen;
    private LocalDate ngayDi;
}
