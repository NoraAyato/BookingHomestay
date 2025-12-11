package com.bookinghomestay.app.domain.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.application.host.homestay.query.GetHomestayDataQuery;
import com.bookinghomestay.app.domain.model.ChiTietDatPhong;
import com.bookinghomestay.app.domain.model.ChiTietPhong;
import com.bookinghomestay.app.domain.model.DanhGia;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.KhuVuc;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.KhuyenMaiPhong;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.Phong;

@Service
public class HomestayService {

    public int countBookingByLocation(KhuVuc khuVuc) {
        int count = 0;
        for (Homestay homestay : khuVuc.getHomestays()) {
            count += countBookingByHomestay(homestay);
        }
        return count;
    }

    public int countAvailableRooms(Homestay homestay) {
        int count = 0;
        for (Phong phong : homestay.getPhongs()) {
            if (phong.getTrangThai().equalsIgnoreCase("active")) {
                count++;
            }
        }
        return count;
    }

    public double calculateRevenueByHomestay(Homestay homestay) {
        double totalRevenue = 0.0;
        double roomRevenue = 0.0;
        double serviceRevenue = 0.0;
        for (Phong phong : homestay.getPhongs()) {
            for (ChiTietDatPhong chiTietDatPhong : phong.getChiTietDatPhongs()) {
                PhieuDatPhong phieuDatPhong = chiTietDatPhong.getPhieuDatPhong();
                int days = chiTietDatPhong.getNgayDi().toLocalDate()
                        .compareTo(chiTietDatPhong.getNgayDen().toLocalDate());

                if (phieuDatPhong != null) {
                    if ((phieuDatPhong.getTrangThai().equalsIgnoreCase("completed"))) {
                        double discount = phieuDatPhong.getHoadon() != null
                                && phieuDatPhong.getHoadon().getKhuyenMai() != null
                                        ? phieuDatPhong.getHoadon().getKhuyenMai().getChietKhau().doubleValue()
                                        : 0.0;
                        if (phieuDatPhong.getHoadon().getKhuyenMai() != null
                                && phieuDatPhong.getHoadon().getKhuyenMai().getLoaiChietKhau()
                                        .equalsIgnoreCase("percentage")) {
                            discount = discount / 100.0;
                            roomRevenue += phong.getDonGia().doubleValue() * days * (1 - discount) * 85 / 100;
                        } else {
                            roomRevenue += (phong.getDonGia().doubleValue() * days) - discount * 85 / 100;
                        }
                        // Tính doanh thu từ dịch vụ
                        serviceRevenue += phieuDatPhong.getChiTietDatPhongs().stream()
                                .flatMap(ctdp -> ctdp.getChiTietDichVus().stream())
                                .mapToDouble(ctdv -> ctdv.getDichVu().getDonGia().doubleValue()
                                        * ctdv.getSoLuong().doubleValue() * days)
                                .sum();
                    }
                }
            }
        }
        totalRevenue = roomRevenue + serviceRevenue;
        return totalRevenue;
    }

    public int countBookingByHomestay(Homestay homestay) {
        int count = 0;
        for (Phong phong : homestay.getPhongs()) {
            for (ChiTietDatPhong chiTietDatPhong : phong.getChiTietDatPhongs()) {
                PhieuDatPhong phieuDatPhong = chiTietDatPhong.getPhieuDatPhong();
                if (phieuDatPhong != null) {
                    if (phieuDatPhong.getTrangThai().equalsIgnoreCase("booked")
                            || phieuDatPhong.getTrangThai().equalsIgnoreCase("completed")) {

                        count++;
                    }
                }
            }
        }
        return count;
    }

    public boolean isInLocationId(Homestay homestay, String locationId) {
        if (locationId == null || locationId.isEmpty()) {
            return true;
        }
        return locationId.equals(homestay.getKhuVuc().getMaKv());
    }

    public boolean isFavoriteHomestay(Homestay homestay, String userId) {
        if (userId == null || userId.isEmpty()) {
            return false;
        }
        return homestay.getUserFavorites().stream()
                .anyMatch(favorite -> favorite.getUserId().equals(userId));
    }

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

        int count = homestay.getDanhGias().size();

        double total = homestay.getDanhGias().stream()
                .mapToDouble(dg -> (dg.getDichVu() + dg.getTienIch() + dg.getSachSe()) / 3.0)
                .sum();

        double average = total / count;

        return Math.round(average * 10.0) / 10.0;
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

    public List<Homestay> sortHomestays(List<Homestay> list, String sortBy) {
        if (sortBy == null)
            return list;
        switch (sortBy) {
            case "rating-desc":
                return list.stream().sorted(Comparator.comparing(this::calculateAverageRating).reversed())
                        .collect(Collectors.toList());
            case "rating-asc":
                return list.stream().sorted(Comparator.comparing(this::calculateAverageRating))
                        .collect(Collectors.toList());
            case "revenue-desc":
                return list.stream()
                        .sorted(Comparator.comparing(this::calculateRevenueByHomestay).reversed())
                        .collect(Collectors.toList());
            case "price-asc":
                return list.stream().sorted(Comparator.comparing(this::caculateMinRoomPriceByHomestay))
                        .collect(Collectors.toList());
            case "price-desc":
                return list.stream()
                        .sorted(Comparator.comparing(this::caculateMinRoomPriceByHomestay).reversed())
                        .collect(Collectors.toList());
            case "name-asc":
                return list.stream().sorted(Comparator.comparing(Homestay::getTenHomestay))
                        .collect(Collectors.toList());
            case "name-desc":
                return list.stream().sorted(Comparator.comparing(Homestay::getTenHomestay).reversed())
                        .collect(Collectors.toList());
            default:
                return list;
        }
    }

    public boolean filterHomestay(Homestay homestay, GetHomestayDataQuery query) {
        if (query.getSearch() != null && !query.getSearch().isEmpty()) {
            if (!homestay.getTenHomestay().toLowerCase().contains(query.getSearch().toLowerCase()))
                return false;
        }
        if (query.getLocationId() != null && !query.getLocationId().isEmpty()) {
            if (!homestay.getKhuVuc().getMaKv().equals(query.getLocationId()))
                return false;
        }
        if (query.getStatus() != null && !query.getStatus().isEmpty()) {
            if (!homestay.getTrangThai().equalsIgnoreCase(query.getStatus()))
                return false;
        }
        return true;
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
                    if (km.getLoaiChietKhau().equalsIgnoreCase("percentage")) {
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
