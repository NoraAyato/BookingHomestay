package com.bookinghomestay.app.application.host.room.dto;

import java.util.List;

import com.bookinghomestay.app.application.host.amenities.dto.HostAmenitiesDataResponseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostRoomDataResponseDto {
    private String id;
    private String name;
    private String homestayId;
    private String homestayName;
    private String roomType;
    private String roomTypeId;
    private int capacity;
    private String status;
    private int price;
    private List<String> images;
    private List<HostAmenitiesDataResponseDto> amenities;
}
