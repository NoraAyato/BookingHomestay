package com.bookinghomestay.app.domain.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
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

    @Column(name = "hinh_anh")
    private String hinhAnh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_homestay", nullable = false)
    private Homestay homestay;

    @OneToMany(mappedBy = "dichVu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietDichVu> chiTietDichVus;

}
