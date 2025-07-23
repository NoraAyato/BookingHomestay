package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "phong")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Phong {

    @Id
    @Column(name = "ma_phong", length = 20, nullable = false)
    private String maPhong;

    @Column(name = "ten_phong", length = 100, nullable = false)
    private String tenPhong;

    @Column(name = "trang_thai", length = 50, nullable = false)
    private String trangThai = "Trống";

    @Column(name = "don_gia", nullable = false)
    private BigDecimal donGia;

    @Column(name = "so_nguoi", nullable = false)
    private Integer soNguoi;

    @Column(name = "virtual_tour")
    private String virtualTour;

    // Quan hệ nhiều-1 với Homestay
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_homestay", insertable = false, updatable = false)
    private Homestay homestay;

    // Quan hệ nhiều-1 với LoaiPhong
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_loai", insertable = false, updatable = false)
    private LoaiPhong loaiPhong;

    // Quan hệ 1-n với HinhAnhPhong
    @OneToMany(mappedBy = "phong", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HinhAnhPhong> hinhAnhPhongs = new ArrayList<>();

    // Quan hệ 1-n với ChiTietPhong
    @OneToMany(mappedBy = "phong", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietPhong> chiTietPhongs = new ArrayList<>();

    // Quan hệ 1-n với ChiTietDatPhong
    @OneToMany(mappedBy = "phong", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietDatPhong> chiTietDatPhongs = new ArrayList<>();

    // Quan hệ 1-n với KhuyenMaiPhong
    @OneToMany(mappedBy = "phong", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<KhuyenMaiPhong> khuyenMaiPhongs = new ArrayList<>();
}
