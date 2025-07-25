package com.bookinghomestay.app.domain.model;

import com.bookinghomestay.app.domain.model.id.KhuyenMaiPhongId;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "khuyen_mai_phong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhuyenMaiPhong {

    @EmbeddedId
    private KhuyenMaiPhongId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("maKM")
    @JoinColumn(name = "ma_km", referencedColumnName = "ma_km")
    private KhuyenMai khuyenMai;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("maPhong")
    @JoinColumn(name = "ma_phong", referencedColumnName = "ma_phong", columnDefinition = "VARCHAR(20)")
    private Phong phong;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("idHomestay")
    @JoinColumn(name = "id_homestay", referencedColumnName = "id_homestay", columnDefinition = "VARCHAR(255)")
    private Homestay homestay;
}