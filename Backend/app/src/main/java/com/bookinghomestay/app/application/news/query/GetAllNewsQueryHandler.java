package com.bookinghomestay.app.application.news.query;

import com.bookinghomestay.app.api.dto.tintuc.NewsResponseDto;
import com.bookinghomestay.app.domain.model.TinTuc;
import com.bookinghomestay.app.domain.repository.INewsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GetAllNewsQueryHandler {

    private final INewsRepository newsRepository;

    @Transactional
    public List<NewsResponseDto> handle() {
        List<TinTuc> tinTucs = newsRepository.findAllPublished();
        return tinTucs.stream().map(tin -> NewsResponseDto.builder()
                .maTinTuc(tin.getMaTinTuc())
                .tieuDe(tin.getTieuDe())
                .noiDung(tin.getNoiDung())
                .hinhAnh(tin.getHinhAnh())
                .tacGia(tin.getTacGia())
                .ngayDang(tin.getNgayDang())
                .trangThai(tin.getTrangThai())
                .tenChuDe(tin.getChuDe().getTenChuDe())
                .build()).collect(Collectors.toList());
    }
}
