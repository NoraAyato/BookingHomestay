package com.bookinghomestay.app.domain.model;

import com.bookinghomestay.app.domain.model.id.ChiTietPhongId;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chi_tiet_phong")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ChiTietPhongId.class)
public class ChiTietPhong {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_phong", referencedColumnName = "ma_phong", foreignKey = @ForeignKey(name = "FK_chi_tiet_phong_phong"))
    private Phong phong;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_tiennghi", referencedColumnName = "ma_tiennghi", foreignKey = @ForeignKey(name = "FK_chi_tiet_phong_tiennghi"))
    private TienNghi tienNghi;

    @Column(name = "so_luong")
    private int soLuong;
}