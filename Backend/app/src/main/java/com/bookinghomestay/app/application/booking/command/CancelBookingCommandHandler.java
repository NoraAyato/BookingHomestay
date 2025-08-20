package com.bookinghomestay.app.application.booking.command;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bookinghomestay.app.domain.model.PhieuDatPhong;
import com.bookinghomestay.app.domain.model.PhieuHuyPhong;
import com.bookinghomestay.app.domain.repository.IBookingRepository;
import com.bookinghomestay.app.domain.service.BookingDomainService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CancelBookingCommandHandler {

    private final IBookingRepository bookingRepository;
    private final BookingDomainService bookingDomainService;

    @Transactional
    public void handle(CancelBookingCommand command) {
        // Lấy thông tin phiếu đặt phòng
        PhieuDatPhong booking = bookingRepository.findById(command.getMaPDPhong())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu đặt phòng"));

        // Kiểm tra người hủy có phải người đặt không
        if (!bookingDomainService.canCancelBooking(booking, command.getUserId())) {
            throw new RuntimeException("Bạn không có quyền hủy phiếu đặt phòng này");
        }

        // Kiểm tra chính sách hủy phòng
        if (!bookingDomainService.validateCancellationTimePolicy(booking)) {
            var chiTiet = booking.getChiTietDatPhongs().get(0);
            var phong = chiTiet.getPhong();
            var homestay = phong.getHomestay();
            String chinhSachHuyPhong = homestay.getChinhSachs().get(0).getHuyPhong();
            int soGioChoPhepHuy = bookingDomainService.extractHoursFromCancellationPolicy(chinhSachHuyPhong);

            throw new RuntimeException("Không thể hủy phòng. Chính sách hủy phòng yêu cầu hủy trước ít nhất "
                    + soGioChoPhepHuy + " giờ trước thời gian nhận phòng");
        }

        // Tạo phiếu hủy phòng
        PhieuHuyPhong phieuHuy = bookingDomainService.createCancellationForm(
                booking,
                command.getLyDoHuy(),
                command.getTenNganHang(),
                command.getSoTaiKhoan());

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
}
