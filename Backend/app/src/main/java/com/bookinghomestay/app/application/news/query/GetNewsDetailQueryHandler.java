package com.bookinghomestay.app.application.news.query;

import com.bookinghomestay.app.api.dto.tintuc.NewsDetailResponseDto;
import com.bookinghomestay.app.domain.model.TinTuc;
import com.bookinghomestay.app.domain.repository.INewsRepository;
import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetNewsDetailQueryHandler {

    private final INewsRepository newsRepository;

    public NewsDetailResponseDto handle(GetNewsDetailQuery query) {
        TinTuc tt = newsRepository.findById(query.getMaTinTuc())
                .orElseThrow(
                        () -> new ResourceNotFoundException("Không tìm thấy tin tức với mã: " + query.getMaTinTuc()));

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
