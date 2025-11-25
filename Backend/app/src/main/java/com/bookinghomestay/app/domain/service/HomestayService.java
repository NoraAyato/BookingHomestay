package com.bookinghomestay.app.domain.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.model.ChiTietDatPhong;
import com.bookinghomestay.app.domain.model.ChiTietPhong;
import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.KhuyenMaiPhong;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.Phong;

@Service
public class HomestayService {

    public boolean isInLocationId(Homestay homestay, String locationId) {
        if (locationId == null || locationId.isEmpty()) {
            return true;
        }
        return locationId.equals(homestay.getKhuVuc().getMaKv());
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

    /**
     * Lọc danh sách các phòng khả dụng
     */
    public boolean isAvailableHomestay(Homestay homestay, LocalDate checkIn, LocalDate checkOut) {
        return homestay.getPhongs().stream()
                .anyMatch(phong -> isRoomAvailable(phong, checkIn, checkOut));
    }

    /**
     * Tính điểm đánh giá trung bình của homestay
     */
    public double calculateAverageRating(Homestay homestay) {
        if (homestay.getDanhGias() == null || homestay.getDanhGias().isEmpty()) {
            return 0.0;
        }
        return homestay.getDanhGias().stream()
                .mapToDouble(dg -> dg.getDichVu() + dg.getTienIch() + dg.getSachSe())
                .average()
                .orElse(0.0);
    }

    public List<String> getHomestayAmenities(Homestay homestay) {
        List<Phong> rooms = homestay.getPhongs();
        List<String> allTenTienNghi = rooms.stream()
                .flatMap(room -> room.getChiTietPhongs().stream())
                .map(ChiTietPhong::getTienNghi)
                .map(getTienNghi -> getTienNghi.getTenTienNghi())
                .distinct()
                .collect(Collectors.toList());
        return allTenTienNghi;
    }

    /**
     * Lấy danh sách mã tiện nghi của một homestay
     */
    public List<String> getHomestayAmenitiesIds(Homestay homestay) {
        List<Phong> rooms = homestay.getPhongs();
        List<String> allMaTienNghi = rooms.stream()
                .flatMap(room -> room.getChiTietPhongs().stream())
                .map(chiTietPhong -> chiTietPhong.getTienNghi().getMaTienNghi())
                .distinct()
                .collect(Collectors.toList());
        return allMaTienNghi;
    }

    /**
     * Kiểm tra homestay có chứa tất cả tiện nghi trong danh sách không
     */
    public boolean hasAllAmenities(Homestay homestay, List<String> requiredAmenityIds) {
        System.out.println("Required Amenity IDs: " + requiredAmenityIds);
        if (requiredAmenityIds == null || requiredAmenityIds.isEmpty()) {
            return true;
        }

        List<String> homestayAmenityIds = getHomestayAmenitiesIds(homestay);
        return homestayAmenityIds.containsAll(requiredAmenityIds);
    }

    public long countActiveHomestays(List<Homestay> homestays) {
        return homestays.stream()
                .count();
    }

    public BigDecimal getHomestayDiscountPrice(Homestay homestay) {
        BigDecimal originalPrice = caculateMinRoomPriceByHomestay(homestay);
        List<KhuyenMai> khuyenMais = homestay.getPhongs().stream()
                .flatMap(room -> room.getKhuyenMaiPhongs().stream())
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
                .orElse(originalPrice);
    }

    public int totalReviews(Homestay homestay) {
        return homestay.getDanhGias() != null ? homestay.getDanhGias().size() : 0;
    }

    public List<String> getHomestayImages(Homestay homestay) {
        List<String> roomImages = homestay.getPhongs().stream()
                .flatMap(phong -> phong.getHinhAnhPhongs().stream())
                .map(hinhAnhPhong -> hinhAnhPhong.getUrlAnh())
                .collect(Collectors.toList());
        // Thêm ảnh đại diện homestay vào đầu danh sách
        List<String> allImages = roomImages.stream().collect(Collectors.toList());
        if (homestay.getHinhAnh() != null && !homestay.getHinhAnh().isEmpty()) {
            allImages.add(0, homestay.getHinhAnh());
        }
        return allImages;
    }

    public BigDecimal caculateMinRoomPriceByHomestay(Homestay homestay) {
        return homestay.getPhongs().stream()
                .map(Phong::getDonGia)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
    }

    public BigDecimal caculateMaxRoomPriceByHomestay(Homestay homestay) {
        return homestay.getPhongs().stream()
                .map(Phong::getDonGia)
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
    }

    public boolean isInPriceRange(Homestay homestay, int minPrice, int maxPrice) {
        BigDecimal minRoomPrice = caculateMinRoomPriceByHomestay(homestay);
        return (minPrice <= 0 || minRoomPrice.compareTo(BigDecimal.valueOf(minPrice)) >= 0) &&
                (maxPrice <= 0 || minRoomPrice.compareTo(BigDecimal.valueOf(maxPrice)) <= 0);
    }

    /**
     * Kiểm tra tính hợp lệ của Homestay
     */
    public boolean validateHomestay(Homestay homestay) {
        // Kiểm tra các điều kiện cơ bản
        if (homestay == null) {
            return false;
        }

        if (homestay.getTenHomestay() == null || homestay.getTenHomestay().trim().isEmpty()) {
            return false;
        }

        if (homestay.getDiaChi() == null || homestay.getDiaChi().trim().isEmpty()) {
            return false;
        }

        // Kiểm tra có ít nhất một phòng
        if (homestay.getPhongs() == null || homestay.getPhongs().isEmpty()) {
            return false;
        }

        // Kiểm tra có chính sách
        if (homestay.getChinhSachs() == null || homestay.getChinhSachs().isEmpty()) {
            return false;
        }

        return true;
    }
}
