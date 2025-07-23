package com.bookinghomestay.app.domain.model.id;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhuyenMaiPhongId implements Serializable {

    @Column(name = "ma_km", length = 20)
    private String maKM;

    @Column(name = "ma_phong", length = 20)
    private String maPhong;

    @Column(name = "id_homestay", length = 255) // Thêm length để khớp với schema
    private String idHomestay;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof KhuyenMaiPhongId))
            return false;
        KhuyenMaiPhongId that = (KhuyenMaiPhongId) o;
        return maKM.equals(that.maKM) &&
                maPhong.equals(that.maPhong) &&
                idHomestay.equals(that.idHomestay);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maKM, maPhong, idHomestay);
    }
}