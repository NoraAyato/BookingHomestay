package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "homestay")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Homestay {

    @Id
    @Column(name = "id_homestay", nullable = false)
    private String idHomestay;

    @Column(name = "ten_homestay", nullable = false, length = 100, columnDefinition = "nvarchar(100)")
    private String tenHomestay;

    @Column(name = "trang_thai", nullable = false, length = 50, columnDefinition = "nvarchar(50)")
    private String trangThai;

    @Column(name = "price_per_night")
    private BigDecimal pricePerNight;

    @Column(name = "hinh_anh")
    private String hinhAnh;

    @Column(name = "gioi_thieu", columnDefinition = "nvarchar(max)", nullable = true)
    private String gioiThieu;

    @Column(name = "dia_chi", columnDefinition = "nvarchar(100)")
    private String diaChi;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Column(name = "hang")
    private BigDecimal hang;

    // Quan hệ nhiều-1 với KhuVuc
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_kv", nullable = false)
    private KhuVuc khuVuc;

    // Quan hệ nhiều-1 với ApplicationUser (tương đương NguoiDung)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User nguoiDung;

    // Quan hệ 1-n với Phong
    @OneToMany(mappedBy = "homestay", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Phong> phongs = new ArrayList<>();

    // Quan hệ 1-n với DichVu
    @OneToMany(mappedBy = "homestay", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DichVu> dichVus = new ArrayList<>();

    // Quan hệ 1-n với DanhGia
    @OneToMany(mappedBy = "homestay", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DanhGia> danhGias = new ArrayList<>();

    // Quan hệ 1-n với ChinhSach
    @OneToMany(mappedBy = "homestay", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChinhSach> chinhSachs = new ArrayList<>();
}
