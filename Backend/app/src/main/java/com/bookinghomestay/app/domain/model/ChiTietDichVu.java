package com.bookinghomestay.app.domain.model;

import com.bookinghomestay.app.domain.model.id.ChiTietDichVuId;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "chi_tiet_dich_vu")
@IdClass(ChiTietDichVuId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietDichVu {

    @Id
    @Column(name = "ma_pdphong", length = 50)
    private String maPDPhong;

    @Id
    @Column(name = "ma_phong", length = 20)
    private String maPhong;

    @Id
    @Column(name = "ma_dv", length = 20)
    private String maDV;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "ma_pdphong", referencedColumnName = "ma_pdphong"),
            @JoinColumn(name = "ma_phong", referencedColumnName = "ma_phong")
    })
    private ChiTietDatPhong chiTietDatPhong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_dv", referencedColumnName = "ma_dv")
    private DichVu dichVu;

    @Column(name = "so_luong")
    private BigDecimal soLuong;

    @Column(name = "ngay_su_dung")
    private LocalDate ngaySuDung;
}