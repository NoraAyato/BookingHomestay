package com.bookinghomestay.app.api.dto.homestay;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomAvailabilityDto {
    private String maPhong;
    private String tenPhong;
    private BigDecimal giaTien;

}
