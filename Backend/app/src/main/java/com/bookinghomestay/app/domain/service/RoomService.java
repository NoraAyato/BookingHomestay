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
        BigDecimal originalPrice = room.getDonGia();
        List<KhuyenMai> khuyenMais = room.getKhuyenMaiPhongs().stream()
                .map(KhuyenMaiPhong::getKhuyenMai).filter(km -> !km.isApDungChoTatCaPhong())
                .distinct()
                .collect(Collectors.toList());
        return khuyenMais.stream()
                .map(km -> {
                    if (km.getLoaiChietKhau().equals("percentage")) {
                        return originalPrice
                                .multiply(BigDecimal.ONE.subtract(km.getChietKhau().divide(BigDecimal.valueOf(100))));
                    } else {
                        return originalPrice.subtract(km.getChietKhau());
                    }
                })
                .min(BigDecimal::compareTo)
                .orElse(null);
    }
}
