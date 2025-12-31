package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "dichvu")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DichVu {

    @Id
    @Column(name = "ma_dv", length = 20)
    private String maDV;

    @Column(name = "ten_dv", nullable = false, columnDefinition = "nvarchar(100)")
    private String tenDV;

    @Column(name = "mo_ta", columnDefinition = "nvarchar(255)")
    private String moTa;

    @Column(name = "don_gia", nullable = false)
    private BigDecimal donGia;
    @Column(name = "ngay_yeu_cau", nullable = true)
    private LocalDateTime ngayYeuCau = LocalDateTime.now();
    @Column(name = "ngay_duyet", nullable = true)
    private LocalDateTime ngayDuyet;
    @Column(name = "hinh_anh")
    private String hinhAnh;
    @Column(name = "trang_thai", nullable = true)
    private String trangThai = "PENDING";
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_homestay", nullable = false)
    private Homestay homestay;
    @ManyToOne
    @JoinColumn(name = "ma_dv_hs", referencedColumnName = "ma_dv_hs", nullable = true)
    private DichVuHs dichVuHomestay;
    @OneToMany(mappedBy = "dichVu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietDichVu> chiTietDichVus;

}
