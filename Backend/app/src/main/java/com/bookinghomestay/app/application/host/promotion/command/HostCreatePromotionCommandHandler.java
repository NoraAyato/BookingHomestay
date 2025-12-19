package com.bookinghomestay.app.application.host.promotion.command;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.bookinghomestay.app.application.host.promotion.dto.HostCreatePromotionRequestDto;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.KhuyenMaiPhong;
import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.model.User;
import com.bookinghomestay.app.domain.model.id.KhuyenMaiPhongId;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.domain.repository.IUserRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HostCreatePromotionCommandHandler {
    private final IKhuyenMaiRepository promotionRepository;
    private final IUserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final IHomestayRepository homestayRepository;

    @Transactional
    public void handle(HostCreatePromotionRequestDto requestDto, String hostId, List<String> homestayIds,
            MultipartFile image) {
        // Validate required fields
        if (requestDto.getDescription() == null || requestDto.getDescription().isEmpty()) {
            throw new IllegalArgumentException("Mô tả không được để trống");
        }
        if (requestDto.getDiscountValue() == null) {
            throw new IllegalArgumentException("Giá trị giảm giá không được để trống");
        }
        if (requestDto.getStartDate() == null || requestDto.getEndDate() == null) {
            throw new IllegalArgumentException("Ngày bắt đầu và kết thúc không được để trống");
        }
        User user = userRepository.findById(hostId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        KhuyenMai promotion = new KhuyenMai();
        promotion.setMaKM("KM" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        promotion.setNoiDung(requestDto.getDescription());
        promotion.setLoaiChietKhau(requestDto.getDiscountType());
        promotion.setChietKhau(BigDecimal.valueOf(Integer.parseInt(requestDto.getDiscountValue())));
        promotion.setNgayBatDau(requestDto.getStartDate().atStartOfDay());
        promotion.setNgayKetThuc(requestDto.getEndDate().atStartOfDay());
        promotion.setSoNgayDatTruoc(
                requestDto.getMinBookedDays() != null ? Integer.parseInt(requestDto.getMinBookedDays()) : 0);
        promotion.setSoDemToiThieu(
                requestDto.getMinNights() != null ? Integer.parseInt(requestDto.getMinNights()) : 0);
        promotion.setToiThieu(
                requestDto.getMinValue() != null ? BigDecimal.valueOf(Integer.parseInt(requestDto.getMinValue()))
                        : BigDecimal.ZERO);
        promotion.setSoLuong(
                requestDto.getQuantity() != null ? BigDecimal.valueOf(Integer.parseInt(requestDto.getQuantity()))
                        : BigDecimal.ZERO);
        promotion.setTrangThai(requestDto.getStatus() != null ? requestDto.getStatus() : "active");
        promotion.setChiApDungChoKhachMoi(
                requestDto.getIsForNewCustomer() != null ? Boolean.parseBoolean(requestDto.getIsForNewCustomer())
                        : false);
        promotion.setApDungChoTatCaPhong(false);
        promotion.setNgayTao(LocalDateTime.now());
        promotion.setNguoiTao(user);

        // Upload ảnh nếu có
        if (image != null && !image.isEmpty() && image.getSize() > 0) {
            String imageUrl = fileStorageService.storePromotion(image, "pm_");
            promotion.setHinhAnh(imageUrl);
        }

        // ===== PHẦN MỚI: TẠO KHUYẾN MÃI CHO CÁC PHÒNG =====
        if (homestayIds != null && !homestayIds.isEmpty()) {
            // Danh sách để lưu tất cả KhuyenMaiPhong
            List<KhuyenMaiPhong> khuyenMaiPhongs = new ArrayList<>();

            // Duyệt qua từng homestay được chọn
            for (String homestayId : homestayIds) {
                // 1. Lấy thông tin homestay
                Homestay homestay = homestayRepository.findById(homestayId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay: " + homestayId));

                // 2. Kiểm tra quyền sở hữu (security check)
                if (!homestay.getNguoiDung().getUserId().equals(hostId)) {
                    throw new RuntimeException("Bạn không có quyền tạo khuyến mãi cho homestay: " + homestayId);
                }

                // 3. Lấy tất cả phòng của homestay này
                List<Phong> phongs = homestay.getPhongs();

                if (phongs == null || phongs.isEmpty()) {
                    // Optional: Log warning hoặc skip
                    continue;
                }

                // 4. Tạo KhuyenMaiPhong cho MỖI phòng
                for (Phong phong : phongs) {
                    // Tạo composite key
                    KhuyenMaiPhongId id = new KhuyenMaiPhongId();
                    id.setMaKM(promotion.getMaKM());
                    id.setMaPhong(phong.getMaPhong());
                    id.setIdHomestay(homestay.getIdHomestay());

                    // Tạo entity
                    KhuyenMaiPhong khuyenMaiPhong = new KhuyenMaiPhong();
                    khuyenMaiPhong.setId(id);
                    khuyenMaiPhong.setKhuyenMai(promotion);
                    khuyenMaiPhong.setPhong(phong);
                    khuyenMaiPhong.setHomestay(homestay);

                    khuyenMaiPhongs.add(khuyenMaiPhong);
                }
            }

            // 5. Set list vào promotion trước khi save
            promotion.setKhuyenMaiPhongs(khuyenMaiPhongs);
        }
        promotionRepository.save(promotion);
    }
}
