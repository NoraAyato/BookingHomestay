package com.bookinghomestay.app.domain.service;

import com.bookinghomestay.app.domain.model.ChiTietDichVu;
import com.bookinghomestay.app.domain.model.DichVu;
import com.bookinghomestay.app.domain.model.HoaDon;
import com.bookinghomestay.app.domain.model.KhuyenMai;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.PhieuHuyPhong;

import co.elastic.clients.util.DateTime;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.bookinghomestay.app.domain.factory.CancellationFactory;
import com.bookinghomestay.app.domain.factory.InvoiceFactory;
import com.bookinghomestay.app.domain.factory.ServiceDetailFactory;

@AllArgsConstructor
@Service
public class BookingService {
    private final InvoiceFactory invoiceFactory;
    private final CancellationFactory cancellationFactory;
    private final ServiceDetailFactory serviceDetailFactory;

    public boolean isCancelableBooking(PhieuDatPhong booking) {
        LocalDate now = LocalDate.now();
        LocalDate checkInDate = booking.getChiTietDatPhongs().get(0).getNgayDen().toLocalDate();
        if (booking.getTrangThai().equalsIgnoreCase("Cancelled")
                || booking.getTrangThai().equalsIgnoreCase("Completed")) {
            return false;
        }
        if (booking.getHoadon() != null && booking.getHoadon().getThanhToans() != null) {
            boolean hasSuccessfulPayment = booking.getHoadon().getThanhToans().stream()
                    .anyMatch(t -> "SUCCESS".equalsIgnoreCase(t.getTrangThai()));
            if (!hasSuccessfulPayment) {
                return false;
            }
        }
        int day = booking.getChiTietDatPhongs().get(0).getPhong().getHomestay().getChinhSachs().stream()
                .filter(cs -> cs.getHuyPhong() != null && !cs.getHuyPhong().isEmpty())
                .findFirst()
                .map(cs -> extractHoursFromCancellationPolicy(cs.getHuyPhong()) / 24)
                .orElse(0);
        if (ChronoUnit.DAYS.between(now, checkInDate) < day) {
            return false;
        }
        return true;
    }

    public boolean isReviewed(PhieuDatPhong booking, String userId) {
        return booking.getChiTietDatPhongs().get(0).getPhong().getHomestay().getDanhGias().stream()
                .anyMatch(dg -> dg.getPhieuDatPhong() != null
                        && dg.getPhieuDatPhong().getMaPDPhong().equals(booking.getMaPDPhong()))
                && booking.getTrangThai().equals("Completed");
    }

    public boolean matchesKeyword(PhieuDatPhong booking, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return true;
        }

        String lowerKeyword = keyword.toLowerCase();

        // Tìm theo mã booking
        if (booking.getMaPDPhong() != null
                && booking.getMaPDPhong().toLowerCase().contains(lowerKeyword)) {
            return true;
        }

        // Tìm theo tên khách hàng
        if (booking.getNguoiDung() != null) {
            String firstName = booking.getNguoiDung().getFirstName() != null
                    ? booking.getNguoiDung().getFirstName()
                    : "";
            String lastName = booking.getNguoiDung().getLastName() != null
                    ? booking.getNguoiDung().getLastName()
                    : "";
            String fullName = (firstName + " " + lastName).trim().toLowerCase();

            if (firstName.toLowerCase().contains(lowerKeyword)
                    || lastName.toLowerCase().contains(lowerKeyword)
                    || fullName.contains(lowerKeyword)) {
                return true;
            }
        }

        // Tìm theo tên homestay
        if (booking.getChiTietDatPhongs() != null) {
            for (var chiTiet : booking.getChiTietDatPhongs()) {
                if (chiTiet.getPhong() != null
                        && chiTiet.getPhong().getHomestay() != null
                        && chiTiet.getPhong().getHomestay().getTenHomestay() != null
                        && chiTiet.getPhong().getHomestay().getTenHomestay().toLowerCase()
                                .contains(lowerKeyword)) {
                    return true;
                }
            }
        }

        return false;
    }

    public BigDecimal calculateRoomPrice(PhieuDatPhong booking) {
        if (booking.getChiTietDatPhongs() == null || booking.getChiTietDatPhongs().isEmpty()) {
            return BigDecimal.ZERO;
        }
        KhuyenMai khuyenMai = null;
        if (booking.getHoadon() != null) {
            khuyenMai = booking.getHoadon().getKhuyenMai();
        }
        if (khuyenMai != null) {
            BigDecimal roomPrice = booking.getChiTietDatPhongs().stream()
                    .map(ctdp -> {
                        long nights = ChronoUnit.DAYS.between(
                                ctdp.getNgayDen().toLocalDate(),
                                ctdp.getNgayDi().toLocalDate());
                        return ctdp.getPhong().getDonGia().multiply(BigDecimal.valueOf(nights));
                    })
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            return applyPromotion(roomPrice, khuyenMai);
        }
        return booking.getChiTietDatPhongs().stream()
                .map(ctdp -> {
                    long nights = ChronoUnit.DAYS.between(
                            ctdp.getNgayDen().toLocalDate(),
                            ctdp.getNgayDi().toLocalDate());
                    return ctdp.getPhong().getDonGia().multiply(BigDecimal.valueOf(nights));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public long countBookings(List<PhieuDatPhong> bookings, LocalDateTime start, LocalDateTime end) {
        return bookings.stream()
                .filter(b -> b.getNgayLap() != null)
                .filter(b -> b.getTrangThai().equalsIgnoreCase("booked")
                        || b.getTrangThai().equalsIgnoreCase("completed"))
                .filter(b -> !b.getNgayLap().isBefore(start) && b.getNgayLap().isBefore(end))
                .count();
    }

    public BigDecimal calculateRevenue(List<PhieuDatPhong> bookings, LocalDateTime start, LocalDateTime end) {

        var result = bookings.stream()
                .filter(b -> b.getNgayLap() != null)
                .filter(b -> !b.getNgayLap().isBefore(start) && b.getNgayLap().isBefore(end))
                .filter(b -> "Booked".equals(b.getTrangThai()) || "Completed".equals(b.getTrangThai()))
                .filter(b -> b.getHoadon() != null && b.getHoadon().getThanhToans() != null)
                .flatMap(b -> b.getHoadon().getThanhToans().stream()
                        .filter(t -> "SUCCESS".equalsIgnoreCase(t.getTrangThai()))
                        .map(t -> t.getSoTien()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return result;
    }

    /**
     * Tính tổng tiền dịch vụ của booking
     * 
     * @param booking Phiếu đặt phòng
     * @return Tổng tiền dịch vụ
     */
    public BigDecimal calculateServicePrice(PhieuDatPhong booking) {
        if (booking.getChiTietDatPhongs() == null || booking.getChiTietDatPhongs().isEmpty()) {
            return BigDecimal.ZERO;
        }

        return booking.getChiTietDatPhongs().stream()
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
    }

    /**
     * Tính tổng tiền của booking (phòng + dịch vụ)
     */
    public BigDecimal calculateTotalAmount(PhieuDatPhong booking) {
        if (booking.getHoadon() != null) {
            return booking.getHoadon().getTongTien();
        }

        BigDecimal roomPrice = calculateRoomPrice(booking);
        BigDecimal servicePrice = calculateServicePrice(booking);

        return roomPrice.add(servicePrice);
    }

    public int countCompletedBookingsByUser(String userId) {
        int count = 0;
        // Giả sử có một phương thức trong repository để đếm số booking đã hoàn thành
        // count = bookingRepository.countByUserIdAndStatus(userId, "Completed");
        return count;
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
        return cancellationFactory.createCancellationForm(booking, lyDoHuy, tenNganHang, soTaiKhoan);
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
        return serviceDetailFactory.createServiceDetail(bookingId, roomId, service);
    }

    /**
     * Tạo hóa đơn mới cho booking
     */
    public HoaDon createInvoice(PhieuDatPhong booking, BigDecimal totalAmount, KhuyenMai khuyenMai) {
        return invoiceFactory.createInvoice(booking, totalAmount, khuyenMai);
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
        BigDecimal roomPrice = calculateRoomPrice(booking);

        // Áp dụng khuyến mãi nếu có
        if (promotion != null) {
            roomPrice = applyPromotion(roomPrice, promotion);
        }

        // Tính tiền dịch vụ (không giảm giá)
        BigDecimal servicePrice = calculateServicePrice(booking);

        // Tổng cộng
        BigDecimal total = roomPrice.add(servicePrice);
        return total.max(BigDecimal.ZERO);
    }

    /**
     * Tính 15% tổng tiền phòng của booking (dùng cho đặt cọc hoặc phí hủy)
     * 
     * @param booking Phiếu đặt phòng
     * @return 15% tổng tiền phòng (chưa bao gồm dịch vụ)
     */
    public BigDecimal calculateRoomDepositAmount(PhieuDatPhong booking) {
        // Tính tổng tiền phòng
        BigDecimal totalRoomPrice = calculateRoomPrice(booking);

        // Tính 15%
        BigDecimal depositPercentage = new BigDecimal("0.15");
        return totalRoomPrice.multiply(depositPercentage).setScale(0, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Kiểm tra tính hợp lệ của thanh toán
     */
    public void validatePayment(PhieuDatPhong booking, BigDecimal amountPaid) {
        if (booking.getHoadon() == null) {
            throw new IllegalStateException("Phiếu đặt này không có hóa đơn");
        }

        BigDecimal depositAmount = calculateRoomDepositAmount(booking);

        // So sánh BigDecimal phải dùng compareTo(), không dùng == hoặc !=
        if (amountPaid.compareTo(depositAmount) != 0) {
            throw new IllegalStateException(
                    String.format("Số tiền thanh toán không khớp với tiền đặt cọc (15%%). Cần: %s VNĐ, Nhận: %s VNĐ",
                            depositAmount, amountPaid));
        }
    }
}
