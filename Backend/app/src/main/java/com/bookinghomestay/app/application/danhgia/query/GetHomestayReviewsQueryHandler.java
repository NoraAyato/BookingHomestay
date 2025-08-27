// GetHomestayReviewsQueryHandler.java
package com.bookinghomestay.app.application.danhgia.query;

import com.bookinghomestay.app.api.dto.homestay.HomestayReviewResponseDto;
import com.bookinghomestay.app.domain.model.ChiTietDatPhong;
import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.repository.IDanhGiaRepository;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetHomestayReviewsQueryHandler {

    private final IDanhGiaRepository danhGiaRepository;

    @Transactional
    public List<HomestayReviewResponseDto> handle(GetHomestayReviewsQuery query) {
        List<DanhGia> danhGias = danhGiaRepository.findByHomestay_IdHomestay(query.getHomestayId());

        return danhGias.stream()
                .filter(dg -> {
                    if (query.getHaiLongRange() != null) {
                        String[] parts = query.getHaiLongRange().split("-");
                        int min = Integer.parseInt(parts[0]);
                        int max = Integer.parseInt(parts[1]);
                        // if (dg.getHaiLong() < min || dg.getHaiLong() > max)
                        // return false;
                    }
                    if (query.getReviewerType() != null) {
                        boolean isMe = dg.getNguoiDung().getUserId().equals(query.getCurrentUserId());
                        if ("me".equals(query.getReviewerType()) && !isMe)
                            return false;
                        if ("others".equals(query.getReviewerType()) && isMe)
                            return false;
                    }
                    return true;
                })
                .map(dg -> HomestayReviewResponseDto.builder()
                        .idDG(dg.getIdDG())
                        .username(dg.getNguoiDung().getUserName())
                        .binhLuan(dg.getBinhLuan())
                        .hinhAnh(dg.getHinhAnh())
                        .haiLong(dg.getDichVu())
                        .sachSe(dg.getSachSe())
                        .tienIch(dg.getTienIch())
                        .dichVu(dg.getDichVu())
                        .ngayDanhGia(dg.getNgayDanhGia().toString())
                        .tenPhong(Optional.ofNullable(dg.getPhieuDatPhong())
                                .flatMap(pd -> pd.getChiTietDatPhongs().stream().findFirst())
                                .map(ct -> ct.getPhong().getTenPhong())
                                .orElse(""))
                        .build())
                .collect(Collectors.toList());
    }
}