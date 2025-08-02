package com.bookinghomestay.app.application.tintuc.query;

import com.bookinghomestay.app.api.dto.tintuc.NewsDetailResponseDto;
import com.bookinghomestay.app.domain.model.TinTuc;
import com.bookinghomestay.app.domain.repository.INewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetNewsDetailQueryHandler {

    private final INewsRepository newsRepository;

    public NewsDetailResponseDto handle(GetNewsDetailQuery query) {
        TinTuc tt = newsRepository.findById(query.getMaTinTuc())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tức"));

        return NewsDetailResponseDto.builder()
                .maTinTuc(tt.getMaTinTuc())
                .tieuDe(tt.getTieuDe())
                .noiDung(tt.getNoiDung())
                .hinhAnh(tt.getHinhAnh())
                .tacGia(tt.getTacGia())
                .ngayDang(tt.getNgayDang())
                .trangThai(tt.getTrangThai())
                .tenChuDe(tt.getChuDe().getTenChuDe())
                .build();
    }
}
