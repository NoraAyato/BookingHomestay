package com.bookinghomestay.app.api.controller.booking;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bookinghomestay.app.api.dto.ApiResponse;
import com.bookinghomestay.app.api.dto.booking.BookingDetailResponseDto;
import com.bookinghomestay.app.api.dto.booking.BookingPaymentResponseDto;
import com.bookinghomestay.app.api.dto.booking.ConfirmBookingPaymentRequest;
import com.bookinghomestay.app.api.dto.booking.CreateBookingRequest;
import com.bookinghomestay.app.api.dto.booking.ConfirmPaymentRequest;
import com.bookinghomestay.app.api.dto.booking.BookingListResponseDto;
import com.bookinghomestay.app.api.dto.booking.CancelBookingRequest;
import com.bookinghomestay.app.application.booking.command.BookingPaymentCommand;
import com.bookinghomestay.app.application.booking.command.BookingPaymentCommandHandler;
import com.bookinghomestay.app.application.booking.command.CancelBookingCommand;
import com.bookinghomestay.app.application.booking.command.CancelBookingCommandHandler;
import com.bookinghomestay.app.application.booking.command.ConfirmBookingCommand;
import com.bookinghomestay.app.application.booking.command.ConfirmBookingCommandHandler;
import com.bookinghomestay.app.application.booking.command.CreateBookingCommand;
import com.bookinghomestay.app.application.booking.command.CreateBookingCommandHandler;
import com.bookinghomestay.app.application.booking.query.GetBookingDetailQuery;
import com.bookinghomestay.app.application.booking.query.GetBookingDetailQueryHandler;
import com.bookinghomestay.app.application.booking.query.GetBookingListQuery;
import com.bookinghomestay.app.application.booking.query.GetBookingListQueryHandler;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/Booking")
@RequiredArgsConstructor
public class BookingController {
    private final CreateBookingCommandHandler bookingCommandHandler;
    private final ConfirmBookingCommandHandler confirmBookingCommandHandler;
    private final GetBookingDetailQueryHandler getBookingDetailQueryHandler;
    private final BookingPaymentCommandHandler bookingPaymentCommandHandler;
    private final GetBookingListQueryHandler getBookingListQueryHandler;
    private final CancelBookingCommandHandler cancelBookingCommandHandler;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> createBooking(@RequestBody CreateBookingRequest request) {
        String userId = SecurityUtils.getCurrentUserId();

        CreateBookingCommand command = new CreateBookingCommand(
                userId,
                request.getMaPhong(),
                request.getNgayDen(),
                request.getNgayDi());

        String bookingId = bookingCommandHandler.handle(command);

        return ResponseEntity.ok(new ApiResponse<>(true, "Đặt phòng thành công", bookingId));
    }

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<BookingPaymentResponseDto>> confirmBooking(
            @RequestBody ConfirmBookingPaymentRequest request) {
        String userId = SecurityUtils.getCurrentUserId();

        ConfirmBookingCommand command = new ConfirmBookingCommand(userId,
                request.getMaPDPhong(),
                request.getServiceIds(),
                request.getPromotionId());

        BookingPaymentResponseDto responseDto = confirmBookingCommandHandler.handle(command);

        return ResponseEntity.ok(new ApiResponse<>(true, "Xác nhận đặt phòng thành công", responseDto));
    }

    @GetMapping("/{bookingId}/detail")
    public ResponseEntity<ApiResponse<BookingDetailResponseDto>> getBookingDetail(@PathVariable String bookingId) {
        BookingDetailResponseDto dto = getBookingDetailQueryHandler.handle(new GetBookingDetailQuery(bookingId));
        if (dto == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, "Không tìm thấy đơn đặt phòng", null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết đơn đặt phòng thành công", dto));
    }

    @PostMapping("/payment")
    public ResponseEntity<ApiResponse<Void>> payBooking(@RequestBody ConfirmPaymentRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        BookingPaymentCommand command = new BookingPaymentCommand(request.getMaPDPhong(),
                request.getSoTien(),
                request.getPhuongThuc(), userId);

        bookingPaymentCommandHandler.handle(command);
        return ResponseEntity.ok(new ApiResponse<>(true, "Thanh toán thành công", null));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<BookingListResponseDto>>> getMyBookings() {
        String userId = SecurityUtils.getCurrentUserId();
        List<BookingListResponseDto> bookings = getBookingListQueryHandler.handle(new GetBookingListQuery(userId));
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách đặt phòng thành công", bookings));
    }

    @PostMapping("/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(@RequestBody CancelBookingRequest request) {
        String userId = SecurityUtils.getCurrentUserId();

        CancelBookingCommand command = new CancelBookingCommand(
                request.getMaPDPhong(),
                userId,
                request.getLyDoHuy(),
                request.getTenNganHang(),
                request.getSoTaiKhoan());

        cancelBookingCommandHandler.handle(command);
        return ResponseEntity.ok(new ApiResponse<>(true, "Hủy đặt phòng thành công", null));
    }
}
