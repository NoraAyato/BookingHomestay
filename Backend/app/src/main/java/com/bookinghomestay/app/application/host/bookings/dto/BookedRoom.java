package com.bookinghomestay.app.application.host.bookings.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookedRoom {
    private String roomName;
    private int pricePerNight;
    private List<RoomService> services;
}
