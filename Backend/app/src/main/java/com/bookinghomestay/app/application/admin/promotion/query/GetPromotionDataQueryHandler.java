package com.bookinghomestay.app.application.admin.promotion.query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.admin.promotion.dto.PromotionDataResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.common.util.PaginationUtil;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.domain.service.PromotionService;
import com.bookinghomestay.app.infrastructure.mapper.PromotionMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetPromotionDataQueryHandler {
    private final IKhuyenMaiRepository khuyenMaiRepository;
    private final PromotionService promotionService;

    public PageResponse<PromotionDataResponseDto> handler(GetPromotionDataQuery query) {
        // Lấy tất cả promotions
        List<KhuyenMai> promotions = khuyenMaiRepository.getAll();

        // Filter theo điều kiện và sắp xếp theo ngày tạo mới nhất
        List<KhuyenMai> filteredPromotions = promotions.stream()
                .filter(km -> query.getStatus() == null || km.getTrangThai().equalsIgnoreCase(query.getStatus()))
                .filter(km -> promotionService.filterByDateRange(km, query.getStartDate(), query.getEndDate()))
                .filter(km -> promotionService.filterBySearch(km, query.getSearch()))
                .sorted((km1, km2) -> {
                    // Sắp xếp ngày tạo giảm dần (mới nhất lên đầu)
                    if (km1.getNgayTao() == null && km2.getNgayTao() == null)
                        return 0;
                    if (km1.getNgayTao() == null)
                        return 1;
                    if (km2.getNgayTao() == null)
                        return -1;
                    return km2.getNgayTao().compareTo(km1.getNgayTao());
                })
                .toList();

        // Tính total sau khi filter
        int total = filteredPromotions.size();

        // Phân trang sử dụng PaginationUtil
        List<KhuyenMai> pagedPromotions = PaginationUtil.paginate(
                filteredPromotions,
                query.getPage(),
                query.getSize());

        // Map sang DTO
        List<PromotionDataResponseDto> promotionDtos = pagedPromotions.stream()
                .map(km -> {
                    String title = promotionService.getPromotionTitle(km);
                    return PromotionMapper.toPromotionDataDto(km, title);
                })
                .toList();

        return new PageResponse<>(promotionDtos, total, query.getPage(), query.getSize());
    }

}
