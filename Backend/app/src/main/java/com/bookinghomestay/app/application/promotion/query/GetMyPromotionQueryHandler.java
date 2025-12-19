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
                // Validate input
                validateQuery(query);

                // Lấy thông tin user
                User user = userRepository.findById(query.getUserId())
                                .orElseThrow(() -> new com.bookinghomestay.app.domain.exception.BusinessException(
                                                "User not found"));

                // Kiểm tra khách hàng mới (chưa có booking hoàn thành)
                boolean isNewCustomer = userService.countBookingComplete(user) == 0;

                LocalDate today = LocalDate.now();

                // Filter khuyến mãi hợp lệ
                List<KhuyenMai> allPromos = khuyenMaiRepository.getAll();
                List<KhuyenMai> validPromos = allPromos.stream()
                                // Kiểm tra trạng thái
                                .filter(km -> "active".equalsIgnoreCase(km.getTrangThai()))
                                // Kiểm tra thời gian hiệu lực
                                .filter(km -> !today.isAfter(km.getNgayKetThuc().toLocalDate()))
                                .filter(km -> !today.isBefore(km.getNgayBatDau().toLocalDate()))
                                // Kiểm tra điều kiện khách mới
                                .filter(km -> !km.isChiApDungChoKhachMoi() || isNewCustomer)
                                // Kiểm tra quota còn lại
                                .filter(km -> {
                                        if (km.getSoLuong() == null)
                                                return true;
                                        int usedCount = (km.getHoaDons() != null) ? km.getHoaDons().size() : 0;
                                        return km.getSoLuong().intValue() > usedCount;
                                })
                                // LƯU Ý: KHÔNG check soNgayDatTruoc, soDemToiThieu vì user chưa chọn ngày
                                .toList();

                int total = validPromos.size();

                // Phân trang trước khi map DTO (tối ưu performance)
                int limit = query.getLimit();
                int offset = (query.getPage() - 1) * limit;
                List<MyPromotionResponeDto> pagedPromos = validPromos.stream()
                                .skip(offset)
                                .limit(limit)
                                .map(km -> PromotionMapper.toMyPromotionDto(km, promotionService.getPromotionTitle(km)))
                                .toList();

                PageResponse<MyPromotionResponeDto> response = new PageResponse<>();
                response.setItems(pagedPromos);
                response.setTotal(total);
                response.setPage(query.getPage());
                response.setLimit(limit);
                return response;
        }

        /**
         * Validate query input
         */
        private void validateQuery(MyPromotionQueryDto query) {
                if (query == null) {
                        throw new com.bookinghomestay.app.domain.exception.BusinessException("Query không được null");
                }
                if (query.getUserId() == null || query.getUserId().trim().isEmpty()) {
                        throw new com.bookinghomestay.app.domain.exception.BusinessException(
                                        "User ID không được để trống");
                }
                if (query.getPage() < 1) {
                        throw new com.bookinghomestay.app.domain.exception.BusinessException("Page phải >= 1");
                }
                if (query.getLimit() < 1 || query.getLimit() > 100) {
                        throw new com.bookinghomestay.app.domain.exception.BusinessException(
                                        "Limit phải trong khoảng 1-100");
                }
        }
}
