package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "hoa_don")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HoaDon {

    @Id
    @Column(name = "ma_hd", length = 20)
    private String maHD;

    @Column(name = "tong_tien", nullable = false)
    private BigDecimal tongTien;

    @Column(name = "ngay_lap", nullable = false)
    private LocalDateTime ngayLap;

    @Column(name = "thue", nullable = false)
    private BigDecimal thue;

    @Column(name = "trang_thai")
    private String trangThai;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_pdphong", unique = true, insertable = false, updatable = false)
    private PhieuDatPhong phieudatphong;

    @OneToMany(mappedBy = "hoaDon", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ThanhToan> thanhToans;
}