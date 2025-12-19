package com.bookinghomestay.app.application.host.bookings.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomService {
    private String serviceName;
    private String description;
    private int quantity;
    private int pricePerUnit;
}
