package com.bookinghomestay.app.application.host.promotion.command;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.bookinghomestay.app.application.host.promotion.dto.HostPromotionUpdateRequestDto;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.KhuyenMaiPhong;
import com.bookinghomestay.app.domain.model.Phong;
import com.bookinghomestay.app.domain.model.id.KhuyenMaiPhongId;
import com.bookinghomestay.app.domain.repository.IHomestayRepository;
import com.bookinghomestay.app.domain.repository.IKhuyenMaiRepository;
import com.bookinghomestay.app.infrastructure.file.FileStorageService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class HostUpdatePromotionHandler {
    private final IKhuyenMaiRepository khuyenMaiRepository;
    private final FileStorageService fileStorageService;
    private final IHomestayRepository homestayRepository;

    @Transactional
    public void handle(HostUpdatePromotionCommand command) {
        try {
            var promotion = khuyenMaiRepository.getKhuyenMaiById(command.getPromotionId())
                    .orElseThrow(() -> new IllegalArgumentException("Khuyến mãi không tồn tại"));
            promotion.setNoiDung(command.getDescription());
            promotion.setLoaiChietKhau(command.getDiscountType());
            promotion.setChietKhau(BigDecimal.valueOf(command.getDiscountValue()));
            promotion.setNgayBatDau(command.getStartDate().atStartOfDay());
            promotion.setNgayKetThuc(command.getEndDate().atStartOfDay());
            promotion.setSoNgayDatTruoc(command.getMinBookedDays());
            promotion.setSoDemToiThieu(command.getMinNights());
            promotion.setToiThieu(BigDecimal.valueOf(command.getMinValue()));
            promotion.setSoLuong(BigDecimal.valueOf(command.getQuantity()));
            promotion.setTrangThai(command.getStatus());

            // Chỉ upload ảnh mới khi có file thật (không null, không rỗng, có kích thước)
            if (command.getImage() != null
                    && !command.getImage().isEmpty()
                    && command.getImage().getSize() > 0) {
                String imageUrl = fileStorageService.storePromotion(command.getImage(), "pm_");
                promotion.setHinhAnh(imageUrl);
            }
            // ===== PHẦN MỚI: TẠO KHUYẾN MÃI CHO CÁC PHÒNG =====
            if (command.getHomestayIds() != null && !command.getHomestayIds().isEmpty()) {
                // Danh sách để lưu tất cả KhuyenMaiPhong
                promotion.getKhuyenMaiPhongs().clear();
                List<KhuyenMaiPhong> khuyenMaiPhongs = new ArrayList<>();

                // Duyệt qua từng homestay được chọn
                for (String homestayId : command.getHomestayIds()) {
                    // 1. Lấy thông tin homestay
                    Homestay homestay = homestayRepository.findById(homestayId)
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy homestay: " + homestayId));

                    // 2. Kiểm tra quyền sở hữu (security check)
                    if (!homestay.getNguoiDung().getUserId().equals(command.getHostId())) {
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

            promotion.setChiApDungChoKhachMoi(command.getIsForNewCustomer());
            promotion.setApDungChoTatCaPhong(true);
            khuyenMaiRepository.save(promotion);
        } catch (Exception e) {
            throw new RuntimeException("Cập nhật khuyến mãi thất bại: " + e.getMessage());
        }
    }
}
