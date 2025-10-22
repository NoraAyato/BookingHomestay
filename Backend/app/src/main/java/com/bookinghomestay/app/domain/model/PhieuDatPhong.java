package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "phieu_dat_phong")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhieuDatPhong {

    @Id
    @Column(name = "ma_pdphong", length = 50)
    private String maPDPhong;

    @Column(name = "ngay_lap", nullable = false)
    private LocalDateTime ngayLap = LocalDateTime.now();

    @Column(name = "trang_thai", nullable = false, columnDefinition = "nvarchar(100)")
    private String trangThai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User nguoiDung;

    @OneToMany(mappedBy = "phieuDatPhong", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietDatPhong> chiTietDatPhongs;

    @OneToOne(mappedBy = "phieudatphong", cascade = CascadeType.ALL, orphanRemoval = true)
    private HoaDon hoadon;

    @OneToMany(mappedBy = "phieuDatPhong", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PhieuHuyPhong> phieuHuyPhongs;
}