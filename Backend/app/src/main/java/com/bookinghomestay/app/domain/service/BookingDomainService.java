package com.bookinghomestay.app.domain.service;

import com.bookinghomestay.app.domain.model.ChiTietDichVu;
import com.bookinghomestay.app.domain.model.DichVu;
import com.bookinghomestay.app.domain.model.HoaDon;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.PhieuHuyPhong;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

@Service
public class BookingDomainService {
    /**
     * Tính tổng tiền của booking
     */
    public BigDecimal calculateTotalAmount(PhieuDatPhong booking) {
        if (booking.getHoadon() != null) {
            return booking.getHoadon().getTongTien();
        }
        if (booking.getChiTietDatPhongs() == null || booking.getChiTietDatPhongs().isEmpty()) {
            return BigDecimal.ZERO;
        }
        var chiTiet = booking.getChiTietDatPhongs().get(0);
        var phong = chiTiet.getPhong();
        long soNgayLuuTru = ChronoUnit.DAYS.between(
                chiTiet.getNgayDen().toLocalDate(),
                chiTiet.getNgayDi().toLocalDate());
        BigDecimal tongTienPhong = phong.getDonGia().multiply(BigDecimal.valueOf(soNgayLuuTru));
        BigDecimal tongTienDichVu = BigDecimal.ZERO;
        if (chiTiet.getChiTietDichVus() != null) {
            for (var dichVu : chiTiet.getChiTietDichVus()) {
                tongTienDichVu = tongTienDichVu.add(
                        dichVu.getDichVu().getDonGia().multiply(BigDecimal.valueOf(soNgayLuuTru)));
            }
        }
        return tongTienPhong.add(tongTienDichVu);
    }

    /**
     * Kiểm tra xem người dùng có quyền hủy booking hay không
     */
    public boolean canCancelBooking(PhieuDatPhong booking, String userId) {
        // Kiểm tra người hủy có phải người đặt không
        if (!booking.getNguoiDung().getUserId().equals(userId)) {
            return false;
        }

        // Kiểm tra trạng thái phiếu đặt phòng
        if (!"Booked".equals(booking.getTrangThai())) {
            return false;
        }

        return true;
    }

    /**
     * Trích xuất số giờ từ chính sách hủy phòng
     * Ví dụ: "Hủy phòng trước 24 giờ" -> 24
     */
    public int extractHoursFromCancellationPolicy(String policy) {
        Pattern pattern = Pattern.compile("(\\d+)\\s*giờ");
        Matcher matcher = pattern.matcher(policy);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        // Giá trị mặc định nếu không tìm thấy: 24 giờ
        return 24;
    }

    /**
     * Kiểm tra xem thời gian hủy có hợp lệ theo chính sách không
     */
    public boolean validateCancellationTimePolicy(PhieuDatPhong booking) {
        if (booking.getChiTietDatPhongs() == null || booking.getChiTietDatPhongs().isEmpty()) {
            return false;
        }

        var chiTiet = booking.getChiTietDatPhongs().get(0);
        var phong = chiTiet.getPhong();
        var homestay = phong.getHomestay();

        // Lấy chính sách hủy phòng từ homestay
        String chinhSachHuyPhong = null;
        if (homestay.getChinhSachs() != null && !homestay.getChinhSachs().isEmpty()) {
            for (var cs : homestay.getChinhSachs()) {
                if (cs.getHuyPhong() != null && !cs.getHuyPhong().isEmpty()) {
                    chinhSachHuyPhong = cs.getHuyPhong();
                    break;
                }
            }
        }

        if (chinhSachHuyPhong == null) {
            return false;
        }

        // Lấy số giờ cho phép hủy từ chính sách
        int soGioChoPhepHuy = extractHoursFromCancellationPolicy(chinhSachHuyPhong);

        // Kiểm tra thời gian hủy
        LocalDateTime ngayDen = chiTiet.getNgayDen();
        LocalDateTime now = LocalDateTime.now();
        long hoursUntilCheckIn = ChronoUnit.HOURS.between(now, ngayDen);

        return hoursUntilCheckIn >= soGioChoPhepHuy;
    }

    /**
     * Tạo phiếu hủy phòng
     */
    public PhieuHuyPhong createCancellationForm(PhieuDatPhong booking, String lyDoHuy, String tenNganHang,
            String soTaiKhoan) {
        PhieuHuyPhong phieuHuy = new PhieuHuyPhong();
        phieuHuy.setMaPHP(UUID.randomUUID().toString().replace("-", "").substring(0, 20));
        phieuHuy.setLyDo(lyDoHuy);
        phieuHuy.setNgayHuy(LocalDateTime.now());
        phieuHuy.setNguoiHuy(booking.getNguoiDung().getUserId());
        phieuHuy.setTrangThai("Processed");
        phieuHuy.setTenNganHang(tenNganHang);
        phieuHuy.setSoTaiKhoan(soTaiKhoan);
        phieuHuy.setPhieuDatPhong(booking);

        return phieuHuy;
    }

    /**
     * Kiểm tra tính hợp lệ của booking trước khi xác nhận
     */
    public void validateBookingConfirmation(PhieuDatPhong booking) {
        if (!"Pending".equals(booking.getTrangThai())) {
            throw new IllegalStateException("Booking status is not pending");
        }

        if (booking.getChiTietDatPhongs() == null || booking.getChiTietDatPhongs().isEmpty()) {
            throw new IllegalStateException("Booking does not have any room details");
        }

        var firstRoomDetail = booking.getChiTietDatPhongs().get(0);
        if (firstRoomDetail.getMaPhong() == null) {
            throw new IllegalStateException("Room ID is missing in booking details");
        }
    }

    /**
     * Tạo chi tiết dịch vụ cho booking
     */
    public ChiTietDichVu createServiceDetail(String bookingId, String roomId, DichVu service) {
        ChiTietDichVu chiTietDichVu = new ChiTietDichVu();
        chiTietDichVu.setMaPDPhong(bookingId);
        chiTietDichVu.setMaPhong(roomId);
        chiTietDichVu.setMaDV(service.getMaDV());
        chiTietDichVu.setSoLuong(BigDecimal.ONE);
        chiTietDichVu.setNgaySuDung(LocalDateTime.now().toLocalDate());
        chiTietDichVu.setDichVu(service);

        return chiTietDichVu;
    }

    /**
     * Tạo hóa đơn mới cho booking
     */
    public HoaDon createInvoice(PhieuDatPhong booking, BigDecimal totalAmount, KhuyenMai khuyenMai) {
        HoaDon hoaDon = new HoaDon();
        hoaDon.setMaHD(UUID.randomUUID().toString().replace("-", "").substring(0, 20));
        hoaDon.setNgayLap(LocalDateTime.now());
        hoaDon.setTongTien(totalAmount);
        hoaDon.setThue(totalAmount.multiply(new BigDecimal("0.0")));
        hoaDon.setTrangThai("Pending");
        hoaDon.setKhuyenMai(khuyenMai);
        hoaDon.setPhieudatphong(booking);

        return hoaDon;
    }

    /**
     * Áp dụng khuyến mãi cho giá phòng
     */
    public BigDecimal applyPromotion(BigDecimal roomPrice, KhuyenMai promo) {
        if (promo == null) {
            return roomPrice;
        }

        if ("percentage".equalsIgnoreCase(promo.getLoaiChietKhau())) {
            BigDecimal discount = roomPrice.multiply(
                    promo.getChietKhau().divide(new BigDecimal("100")));
            return roomPrice.subtract(discount);
        } else {
            return roomPrice.subtract(
                    promo.getChietKhau().multiply(BigDecimal.valueOf(1000)));
        }
    }

    /**
     * Tính tổng tiền của booking có áp dụng khuyến mãi
     */
    public BigDecimal calculateTotalAmountWithPromotion(PhieuDatPhong booking, KhuyenMai promotion) {
        // Tính tiền phòng
        BigDecimal roomPrice = booking.getChiTietDatPhongs().stream()
                .map(ctdp -> {
                    long nights = ChronoUnit.DAYS.between(
                            ctdp.getNgayDen().toLocalDate(),
                            ctdp.getNgayDi().toLocalDate());
                    return ctdp.getPhong().getDonGia().multiply(BigDecimal.valueOf(nights));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Áp dụng khuyến mãi nếu có
        if (promotion != null) {
            roomPrice = applyPromotion(roomPrice, promotion);
        }

        // Tính tiền dịch vụ (không giảm giá)
        BigDecimal servicePrice = booking.getChiTietDatPhongs().stream()
                .map(ctdp -> {
                    long nights = ChronoUnit.DAYS.between(
                            ctdp.getNgayDen().toLocalDate(),
                            ctdp.getNgayDi().toLocalDate());
                    BigDecimal serviceTotalForRoom = ctdp.getChiTietDichVus().stream()
                            .map(ctdv -> ctdv.getDichVu().getDonGia())
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return serviceTotalForRoom.multiply(BigDecimal.valueOf(nights));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Tổng cộng
        BigDecimal total = roomPrice.add(servicePrice);
        return total.max(BigDecimal.ZERO);
    }

    /**
     * Kiểm tra tính hợp lệ của thanh toán
     */
    public void validatePayment(PhieuDatPhong booking, BigDecimal amountPaid) {
        if (booking.getHoadon() == null) {
            throw new IllegalStateException("Invoice not found for booking");
        }

        BigDecimal invoiceAmount = booking.getHoadon().getTongTien();
        if (amountPaid.compareTo(invoiceAmount) != 0) {
            throw new IllegalStateException("Payment amount does not match invoice total");
        }
    }
}
