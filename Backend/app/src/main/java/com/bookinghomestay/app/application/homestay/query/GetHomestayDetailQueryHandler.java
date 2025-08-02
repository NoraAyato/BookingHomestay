// file: GetHomestayDetailQueryHandler.java
package com.bookinghomestay.app.application.homestay.query;

import com.bookinghomestay.app.api.dto.homestay.HomestayDetailResponseDto;
import com.bookinghomestay.app.domain.model.ChinhSach;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.repository.IDanhGiaRepository;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetHomestayDetailQueryHandler {

        private final IHomestayRepository homestayRepository;
        private final IDanhGiaRepository danhGiaRepository;

        @Transactional
        public HomestayDetailResponseDto handle(GetHomestayDetailQuery query) {
                Homestay homestay = homestayRepository.findById(query.getHomestayId())
                                .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay"));

                ChinhSach chinhSach = homestay.getChinhSachs().stream().findFirst()
                                .orElseThrow(() -> new RuntimeException("Không có chính sách cho homestay"));

                int tongDanhGia = danhGiaRepository.countByHomestayId(query.getHomestayId());
                Double diemTB = danhGiaRepository.averageHaiLongByHomestayId(query.getHomestayId());
                double diemTrungBinh = diemTB != null ? diemTB : 0.0;

                return HomestayDetailResponseDto.builder()
                                .id(homestay.getIdHomestay())
                                .tenHomestay(homestay.getTenHomestay())
                                .diaChi(homestay.getDiaChi())
                                .gioiThieu(homestay.getGioiThieu())
                                .tongDanhGia(tongDanhGia)
                                .diemHaiLongTrungBinh(diemTrungBinh)
                                .chinhSach(
                                                HomestayDetailResponseDto.ChinhSachDto.builder()
                                                                .nhanPhong(chinhSach.getNhanPhong())
                                                                .traPhong(chinhSach.getTraPhong())
                                                                .huyPhong(chinhSach.getHuyPhong())
                                                                .buaAn(chinhSach.getBuaAn())
                                                                .build())
                                .build();
        }

}
