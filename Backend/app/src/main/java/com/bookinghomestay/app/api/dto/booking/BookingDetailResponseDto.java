package com.bookinghomestay.app.api.dto.booking;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class BookingDetailResponseDto {
    private String maPDPhong;
    private String maHomestay;
    private String tenHomestay;
    private String diaChiHomestay;
    private String tenLoaiPhong;
    private String tenPhong;
    private String hinhAnhPhong;
    private String userName;
    private String soDienThoai;
    private BigDecimal tongTienPhong;
    private String chinhSachHuyPhong;
    private String chinhSachNhanPhong;
    private String chinhSachTraPhong;
    private String ngayNhanPhong;
    private String ngayTraPhong;
    private List<String> dichVuSuDung;
}