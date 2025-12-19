package com.bookinghomestay.app.domain.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.HinhAnhPhong;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.KhuyenMaiPhong;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.Phong;

@Service
public class RoomService {
    /**
     * Tìm hình ảnh chính của phòng
     */
    public String findMainRoomImage(Phong phong) {
        return phong.getHinhAnhPhongs().stream()
                .filter(h -> h.isLaAnhChinh())
                .findFirst()
                .map(h -> h.getUrlAnh())
                .orElse(null);
    }

    /**
     * Lọc danh sách các phòng khả dụng
     */
    public List<Phong> filterAvailableRooms(List<Phong> rooms, LocalDate checkIn, LocalDate checkOut) {
        return rooms.stream()
                .filter(room -> isRoomAvailable(room, checkIn, checkOut))
                .collect(Collectors.toList());
    }

    public List<String> getImagesByRoom(Phong room) {
        return room.getHinhAnhPhongs().stream()
                .sorted(Comparator.comparing(HinhAnhPhong::isLaAnhChinh).reversed())
                .map(h -> h.getUrlAnh())
                .collect(Collectors.toList());
    }

    /**
     * Kiểm tra phòng có khả dụng trong khoảng thời gian
     */
    public boolean isRoomAvailable(Phong phong, LocalDate checkIn, LocalDate checkOut) {
        return phong.getChiTietDatPhongs().stream()
                .filter(ctdp -> {
                    PhieuDatPhong phieu = ctdp.getPhieuDatPhong();
                    return phieu != null && ("Booked".equals(phieu.getTrangThai()) ||
                            "Pending".equals(phieu.getTrangThai()));
                })
                .noneMatch(ctdp -> {
                    LocalDate ngayDen = ctdp.getNgayDen().toLocalDate();
                    LocalDate ngayDi = ctdp.getNgayDi().toLocalDate();
                    return !(checkOut.isBefore(ngayDen) || checkIn.isAfter(ngayDi));
                });
    }

    public BigDecimal caculateMinPriceOfListRoom(List<Phong> rooms) {
        return rooms.stream()
                .map(Phong::getDonGia)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
    }

    public BigDecimal getDiscountPriceOfRoom(Phong room) {
        return getDiscountPriceOfRoom(room, null, null);
    }

    public BigDecimal getDiscountPriceOfRoom(Phong room, LocalDate checkIn, LocalDate checkOut) {
        BigDecimal originalPrice = room.getDonGia();
        LocalDate now = LocalDate.now();

        List<KhuyenMai> khuyenMais = room.getKhuyenMaiPhongs().stream()
                .map(KhuyenMaiPhong::getKhuyenMai)
                // Chỉ lấy khuyến mãi còn hiệu lực
                .filter(km -> "Active".equalsIgnoreCase(km.getTrangThai()))
                .filter(km -> {
                    LocalDate startDate = km.getNgayBatDau().toLocalDate();
                    LocalDate endDate = km.getNgayKetThuc().toLocalDate();
                    return !now.isBefore(startDate) && !now.isAfter(endDate);
                })
                // Kiểm tra số ngày đặt trước (nếu có checkIn)
                .filter(km -> {
                    if (checkIn == null || km.getSoNgayDatTruoc() == null)
                        return true;
                    long daysBeforeCheckIn = java.time.temporal.ChronoUnit.DAYS.between(now, checkIn);
                    return daysBeforeCheckIn >= km.getSoNgayDatTruoc();
                })
                // Kiểm tra số đêm tối thiểu (nếu có checkIn và checkOut)
                .filter(km -> {
                    if (checkIn == null || checkOut == null || km.getSoDemToiThieu() == null)
                        return true;
                    long nights = java.time.temporal.ChronoUnit.DAYS.between(checkIn, checkOut);
                    return nights >= km.getSoDemToiThieu();
                })
                // Kiểm tra quota còn lại
                .filter(km -> {
                    if (km.getSoLuong() == null)
                        return true;
                    int usedCount = (km.getHoaDons() != null) ? km.getHoaDons().size() : 0;
                    return km.getSoLuong().intValue() > usedCount;
                })
                .distinct()
                .collect(Collectors.toList());

        return khuyenMais.stream()
                .map(km -> {
                    BigDecimal discountedPrice;
                    if ("percentage".equalsIgnoreCase(km.getLoaiChietKhau())) {
                        // Tính % chiết khấu với rounding mode
                        BigDecimal discountPercent = km.getChietKhau()
                                .divide(BigDecimal.valueOf(100), 4, java.math.RoundingMode.HALF_UP);
                        discountedPrice = originalPrice
                                .multiply(BigDecimal.ONE.subtract(discountPercent));
                    } else {
                        // Chiết khấu cố định
                        discountedPrice = originalPrice.subtract(km.getChietKhau());
                    }
                    // Đảm bảo giá không âm
                    return discountedPrice.max(BigDecimal.ZERO);
                })
                .min(BigDecimal::compareTo)
                .orElse(originalPrice); // Trả về giá gốc nếu không có khuyến mãi
    }
}
