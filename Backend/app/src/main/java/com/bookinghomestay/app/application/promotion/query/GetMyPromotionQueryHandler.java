package com.bookinghomestay.app.application.promotion.query;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.promotion.dto.MyPromotionQueryDto;
import com.bookinghomestay.app.application.promotion.dto.MyPromotionResponeDto;
import com.bookinghomestay.app.common.response.PageResponse;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.domain.service.PromotionService;
import com.bookinghomestay.app.domain.service.UserService;
import com.bookinghomestay.app.infrastructure.mapper.PromotionMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GetMyPromotionQueryHandler {
        private final IKhuyenMaiRepository khuyenMaiRepository;
        private final IUserRepository userRepository;
        private final UserService userService;
        private final PromotionService promotionService;

        public PageResponse<MyPromotionResponeDto> handle(MyPromotionQueryDto query) {
                User user = userRepository.findById(query.getUserId())
                                .orElseThrow(() -> new RuntimeException("User not found"));
                boolean isNewCustomer = userService.countBookingComplete(user) > 0 ? false : true;
                List<KhuyenMai> allPromos = khuyenMaiRepository.getAll();
                var validPromos = allPromos.stream()
                                .filter(km -> !LocalDate.now().isAfter(km.getNgayKetThuc().toLocalDate()))
                                .filter(km -> !LocalDate.now().isBefore(km.getNgayBatDau().toLocalDate()))
                                .filter(km -> km.getTrangThai().equalsIgnoreCase("active"))
                                .filter(km -> !km.isChiApDungChoKhachMoi() || isNewCustomer)
                                .map(km -> PromotionMapper.toMyPromotionDto(km, promotionService.getPromotionTitle(km)))
                                .toList();
                int total = validPromos.size();
                int limit = query.getLimit();
                List<MyPromotionResponeDto> pagedPromos = validPromos.stream()
                                .skip((long) (query.getPage() - 1) * query.getLimit())
                                .limit(limit)
                                .toList();

                PageResponse<MyPromotionResponeDto> response = new PageResponse<>();
                response.setItems(pagedPromos);
                response.setTotal(total);
                response.setPage(query.getPage());
                response.setLimit(limit);
                return response;
        }
}
