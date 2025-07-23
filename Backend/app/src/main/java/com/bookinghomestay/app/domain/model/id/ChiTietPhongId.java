package com.bookinghomestay.app.domain.model.id;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.model.TienNghi;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietPhongId implements Serializable {
    private Phong phong;
    private TienNghi tienNghi;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof ChiTietPhongId))
            return false;
        ChiTietPhongId that = (ChiTietPhongId) o;
        return Objects.equals(phong, that.phong) && Objects.equals(tienNghi, that.tienNghi);
    }

    @Override
    public int hashCode() {
        return Objects.hash(phong, tienNghi);
    }
}