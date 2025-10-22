package com.bookinghomestay.app.api.dto.promotion;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PromotionResponeDto {
    private String maKM;
    private String noiDung;
    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayKetThuc;
    private BigDecimal chietKhau;
    private String loaiChietKhau;
    private Integer soDemToiThieu;
    private Integer soNgayDatTruoc;
    private String hinhAnh;
    private boolean chiApDungChoKhachMoi;
    private boolean apDungChoTatCaPhong;
    private String trangThai;
    private BigDecimal soLuong;
    private LocalDateTime ngayTao;
}
