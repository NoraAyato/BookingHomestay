package com.bookinghomestay.app.domain.model.id;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietDatPhongId implements Serializable {
    private String maPDPhong;
    private String maPhong;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof ChiTietDatPhongId))
            return false;
        ChiTietDatPhongId that = (ChiTietDatPhongId) o;
        return Objects.equals(maPDPhong, that.maPDPhong) &&
                Objects.equals(maPhong, that.maPhong);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maPDPhong, maPhong);
    }
}
