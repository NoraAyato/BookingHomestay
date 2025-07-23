package com.bookinghomestay.app.domain.model.id;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietDichVuId implements Serializable {

    private String maPDPhong;
    private String maPhong;
    private String maDV;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof ChiTietDichVuId))
            return false;
        ChiTietDichVuId that = (ChiTietDichVuId) o;
        return Objects.equals(maPDPhong, that.maPDPhong) &&
                Objects.equals(maPhong, that.maPhong) &&
                Objects.equals(maDV, that.maDV);
    }

    @Override
    public int hashCode() {
        return Objects.hash(maPDPhong, maPhong, maDV);
    }
}
