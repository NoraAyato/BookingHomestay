package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "khuyen_mai")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhuyenMai {

    @Id
    @Column(name = "ma_km", length = 20)
    private String maKM;

    @Column(name = "noi_dung", nullable = false, length = 100, columnDefinition = "nvarchar(100)")
    private String noiDung;

    @Column(name = "ngay_bat_dau", nullable = false)
    private LocalDateTime ngayBatDau;

    @Column(name = "ngay_ket_thuc", nullable = false)
    private LocalDateTime ngayKetThuc;

    @Column(name = "chiet_khau", nullable = false)
    private BigDecimal chietKhau;

    @Column(name = "loai_chiet_khau", nullable = false)
    private String loaiChietKhau; // "Percentage" hoặc "Fixed"

    @Column(name = "so_dem_toi_thieu")
    private Integer soDemToiThieu;

    @Column(name = "so_ngay_dat_truoc")
    private Integer soNgayDatTruoc;

    @Column(name = "hinh_anh", length = 200)
    private String hinhAnh;

    @Column(name = "chi_ap_dung_cho_khach_moi", nullable = false)
    private boolean chiApDungChoKhachMoi = false;

    @Column(name = "ap_dung_cho_tat_ca_phong", nullable = false)
    private boolean apDungChoTatCaPhong = false;

    @Column(name = "trang_thai", length = 50, nullable = false, columnDefinition = "nvarchar(50)")
    private String trangThai = "Đang áp dụng";

    @Column(name = "so_luong")
    private BigDecimal soLuong;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao = LocalDateTime.now();

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User nguoiTao;

    @OneToMany(mappedBy = "khuyenMai", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<KhuyenMaiPhong> khuyenMaiPhongs;

}
