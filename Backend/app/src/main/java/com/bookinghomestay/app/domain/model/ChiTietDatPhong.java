package com.bookinghomestay.app.domain.model;

import com.bookinghomestay.app.domain.model.id.ChiTietDatPhongId;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "chi_tiet_dat_phong")
@IdClass(ChiTietDatPhongId.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietDatPhong {

    @Id
    @Column(name = "ma_pdphong", length = 50)
    private String maPDPhong;

    @Id
    @Column(name = "ma_phong", length = 20)
    private String maPhong;

    @Column(name = "ngay_den", nullable = false)
    private LocalDate ngayDen;

    @Column(name = "ngay_di", nullable = false)
    private LocalDate ngayDi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_pdphong", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "fk_ctdp_pdphong"))
    private PhieuDatPhong phieuDatPhong;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_phong", insertable = false, updatable = false, foreignKey = @ForeignKey(name = "fk_ctdp_phong"))
    private Phong phong;

    @OneToMany(mappedBy = "chiTietDatPhong", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChiTietDichVu> chiTietDichVus;

}
