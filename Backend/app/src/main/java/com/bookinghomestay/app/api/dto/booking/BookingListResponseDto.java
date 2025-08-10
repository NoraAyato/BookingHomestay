package com.bookinghomestay.app.api.dto.booking;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class BookingListResponseDto {
    private String maPDPhong;
    private LocalDateTime ngayLap;
    private String trangThai;
    private String tenHomestay;
    private String tenPhong;
    private BigDecimal tongTien;
}