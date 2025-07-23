package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "thanh_toan")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThanhToan {

    @Id
    @Column(name = "ma_tt", length = 20)
    private String maTT;

    @Column(name = "so_tien", nullable = false)
    private BigDecimal soTien;

    @Column(name = "phuong_thuc", nullable = false)
    private String phuongThuc;

    @Column(name = "ngay_tt", nullable = false)
    private LocalDateTime ngayTT;

    @Column(name = "trang_thai", nullable = false)
    private String trangThai;

    @Column(name = "noi_dung", nullable = false)
    private String noiDung;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_hd", insertable = false, updatable = false)
    private HoaDon hoaDon;
}
