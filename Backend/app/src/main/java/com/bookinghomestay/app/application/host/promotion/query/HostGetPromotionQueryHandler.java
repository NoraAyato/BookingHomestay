package com.bookinghomestay.app.application.host.promotion.query;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.promotion.dto.HostPromotionDataResponseDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.common.util.PaginationUtil;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.domain.service.PromotionService;
import com.bookinghomestay.app.infrastructure.mapper.PromotionMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostGetPromotionQueryHandler {
    private final IKhuyenMaiRepository promotionRepository;
    private final PromotionService promotionService;

    public PageResponse<HostPromotionDataResponseDto> handle(HostGetPromotionQuery query) {
        List<KhuyenMai> promotions = promotionRepository.getAll().stream()
                .filter(promotion -> promotion.getNguoiTao() != null
                        && promotion.getNguoiTao().getUserId().equalsIgnoreCase(query.getHostId()))
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
        int total = promotions.size();

        // Phân trang sử dụng PaginationUtil
        List<KhuyenMai> pagedPromotions = PaginationUtil.paginate(
                promotions,
                query.getPage(),
                query.getSize());
        List<HostPromotionDataResponseDto> promotionDtos = pagedPromotions.stream()
                .map(km -> {
                    String title = promotionService.getPromotionTitle(km);
                    return PromotionMapper.toHostPromotionDataDto(km, title);
                })
                .toList();

        return new PageResponse<>(promotionDtos, total, query.getPage(), query.getSize());
    }
}
