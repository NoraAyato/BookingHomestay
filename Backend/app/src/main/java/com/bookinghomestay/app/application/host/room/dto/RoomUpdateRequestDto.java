package com.bookinghomestay.app.application.host.room.dto;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoomUpdateRequestDto {
    private String roomName;
    private String status;
    private int pricePerNight;
    private int capacity;
    private String RoomTypeId;
    private String homestayId;
}
