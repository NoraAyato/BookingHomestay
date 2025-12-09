package com.bookinghomestay.app.application.admin.news.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.news.dto.NewsDataResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.common.util.PaginationUtil;
import com.bookinghomestay.app.domain.model.TinTuc;
import com.bookinghomestay.app.domain.repository.INewsRepository;
import com.bookinghomestay.app.domain.service.NewsService;
import com.bookinghomestay.app.infrastructure.mapper.NewsMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetNewsDataQueryHandler {
    private final INewsRepository newsRepository;
    private final NewsService newsService;

    public PageResponse<NewsDataResponseDto> handle(GetNewsDataQuery query) {
        // Implementation for fetching news data based on the query parameters
        List<TinTuc> newsList = newsRepository.findAll();
        List<TinTuc> filteredNews = newsList.stream()
                .filter(km -> query.getStatus() == null || km.getTrangThai().equalsIgnoreCase(query.getStatus()))
                .filter(km -> newsService.filterByCategory(km, query.getCategory()))
                .filter(km -> newsService.filterByDateRange(km, query.getStartDate(), query.getEndDate()))
                .filter(km -> newsService.filterBySearch(km, query.getSearch()))
                .sorted((km1, km2) -> {
                    // Sắp xếp ngày tạo giảm dần (mới nhất lên đầu)
                    if (km1.getNgayDang() == null && km2.getNgayDang() == null)
                        return 0;
                    if (km1.getNgayDang() == null)
                        return 1;
                    if (km2.getNgayDang() == null)
                        return -1;
                    return km2.getNgayDang().compareTo(km1.getNgayDang());
                })
                .toList();
        int total = filteredNews.size();
        List<TinTuc> pagedNews = PaginationUtil.paginate(
                filteredNews,
                query.getPage(),
                query.getSize());
        List<NewsDataResponseDto> newsDtos = pagedNews.stream()
                .map(tt -> NewsMapper.toNewsDataResponseDto(tt.getMaTinTuc(), tt.getTieuDe(), tt.getNoiDung(),
                        tt.getChuDe().getTenChuDe(), tt.getTrangThai(), tt.getFeatured(), tt.getTacGia(),
                        tt.getHinhAnh(), tt.getNgayDang()))
                .toList();

        return new PageResponse<>(newsDtos, total, query.getPage(), query.getSize());
    }
}
