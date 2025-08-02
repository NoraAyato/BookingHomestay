// File: IDanhGiaRepository.java
package com.bookinghomestay.app.domain.repository;

import com.bookinghomestay.app.domain.model.DanhGia;
import java.util.List;

public interface IDanhGiaRepository {
    List<DanhGia> findByHomestay_IdHomestay(String homestayId);

    int countByHomestayId(String homestayId);

    Double averageHaiLongByHomestayId(String homestayId);

}
