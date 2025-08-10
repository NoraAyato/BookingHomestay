package com.bookinghomestay.app.application.booking.command;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookinghomestay.app.domain.model.ChinhSach;
import com.bookinghomestay.app.domain.model.Homestay;
import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.PhieuHuyPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class CancelBookingCommandHandler {

    private final IBookingRepository bookingRepository;

    @Transactional
    public void handle(CancelBookingCommand command) {
        // Lấy thông tin phiếu đặt phòng
        PhieuDatPhong booking = bookingRepository.findById(command.getMaPDPhong())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu đặt phòng"));

        // Kiểm tra người hủy có phải người đặt không
        if (!booking.getNguoiDung().getUserId().equals(command.getUserId())) {
            throw new RuntimeException("Bạn không có quyền hủy phiếu đặt phòng này");
        }

        // Kiểm tra trạng thái phiếu đặt phòng
        if (!"Booked".equals(booking.getTrangThai())) {
            throw new RuntimeException("Chỉ có thể hủy phiếu đặt phòng ở trạng thái 'Booked'");
        }

        // Lấy chi tiết đặt phòng đầu tiên để kiểm tra
        if (booking.getChiTietDatPhongs() == null || booking.getChiTietDatPhongs().isEmpty()) {
            throw new RuntimeException("Phiếu đặt phòng không có chi tiết");
        }

        var chiTiet = booking.getChiTietDatPhongs().get(0);
        var phong = chiTiet.getPhong();
        Homestay homestay = phong.getHomestay();

        // Lấy chính sách hủy phòng từ homestay
        String chinhSachHuyPhong = null;
        if (homestay.getChinhSachs() != null && !homestay.getChinhSachs().isEmpty()) {
            for (ChinhSach cs : homestay.getChinhSachs()) {
                if (cs.getHuyPhong() != null && !cs.getHuyPhong().isEmpty()) {
                    chinhSachHuyPhong = cs.getHuyPhong();
                    break;
                }
            }
        }

        if (chinhSachHuyPhong == null) {
            throw new RuntimeException("Homestay chưa có chính sách hủy phòng");
        }

        // Phân tích chính sách hủy phòng
        int soGioChoPhepHuy = extractHoursFromCancellationPolicy(chinhSachHuyPhong);

        // Kiểm tra thời gian hủy phòng
        LocalDateTime ngayDen = chiTiet.getNgayDen();
        LocalDateTime now = LocalDateTime.now();
        long hoursUntilCheckIn = ChronoUnit.HOURS.between(now, ngayDen);

        if (hoursUntilCheckIn < soGioChoPhepHuy) {
            throw new RuntimeException("Không thể hủy phòng. Chính sách hủy phòng yêu cầu hủy trước ít nhất "
                    + soGioChoPhepHuy + " giờ trước thời gian nhận phòng");
        }

        // Tạo phiếu hủy phòng
        PhieuHuyPhong phieuHuy = new PhieuHuyPhong();
        phieuHuy.setMaPHP(UUID.randomUUID().toString().replace("-", "").substring(0, 20));
        phieuHuy.setLyDo(command.getLyDoHuy());
        phieuHuy.setNgayHuy(LocalDateTime.now());
        phieuHuy.setNguoiHuy(booking.getNguoiDung().getUserId());
        phieuHuy.setTrangThai("Processed");
        phieuHuy.setTenNganHang(command.getTenNganHang());
        phieuHuy.setSoTaiKhoan(command.getSoTaiKhoan());
        phieuHuy.setPhieuDatPhong(booking);

        // Cập nhật trạng thái phiếu đặt phòng
        booking.setTrangThai("Cancelled");
        if (booking.getHoadon() != null) {
            booking.getHoadon().setTrangThai("Cancelled");
        }

        // Lưu phiếu hủy phòng và cập nhật phiếu đặt phòng
        bookingRepository.saveCancelledBooking(phieuHuy);
        bookingRepository.save(booking);

        log.info("Đã hủy phiếu đặt phòng {}, lý do: {}", booking.getMaPDPhong(), command.getLyDoHuy());
    }

    /**
     * Trích xuất số giờ từ chính sách hủy phòng
     * Ví dụ: "Hủy phòng trước 24 giờ" -> 24
     */
    private int extractHoursFromCancellationPolicy(String policy) {
        Pattern pattern = Pattern.compile("(\\d+)\\s*giờ");
        Matcher matcher = pattern.matcher(policy);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        }
        // Giá trị mặc định nếu không tìm thấy: 24 giờ
        return 24;
    }
}
