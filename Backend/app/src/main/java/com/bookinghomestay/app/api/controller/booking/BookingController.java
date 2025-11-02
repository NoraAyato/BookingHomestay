package com.bookinghomestay.app.api.controller.booking;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.bookinghomestay.app.application.booking.command.BookingAddPromotionCommand;
import com.bookinghomestay.app.application.booking.command.BookingAddPromotionHandler;
import com.bookinghomestay.app.application.booking.command.BookingPaymentCommand;
import com.bookinghomestay.app.application.booking.command.BookingPaymentCommandHandler;
import com.bookinghomestay.app.application.booking.command.CancelBookingCommand;
import com.bookinghomestay.app.application.booking.command.CancelBookingCommandHandler;
import com.bookinghomestay.app.application.booking.command.ConfirmBookingCommand;
import com.bookinghomestay.app.application.booking.command.ConfirmBookingCommandHandler;
import com.bookinghomestay.app.application.booking.command.CreateBookingCommand;
import com.bookinghomestay.app.application.booking.command.CreateBookingCommandHandler;
import com.bookinghomestay.app.application.booking.dto.booking.BookingAddPromotionRequest;
import com.bookinghomestay.app.application.booking.dto.booking.BookingDetailResponseDto;
import com.bookinghomestay.app.application.booking.dto.booking.BookingPaymentResponseDto;
import com.bookinghomestay.app.application.booking.dto.booking.BookingResponseDto;
import com.bookinghomestay.app.application.booking.dto.booking.CancelBookingRequest;
import com.bookinghomestay.app.application.booking.dto.booking.ConfirmBookingPaymentRequest;
import com.bookinghomestay.app.application.booking.dto.booking.ConfirmPaymentRequest;
import com.bookinghomestay.app.application.booking.dto.booking.CreateBookingRequest;
import com.bookinghomestay.app.application.booking.query.GetBookingDetailQuery;
import com.bookinghomestay.app.application.booking.query.GetBookingDetailQueryHandler;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/Booking")
@RequiredArgsConstructor
public class BookingController {
    private final CreateBookingCommandHandler bookingCommandHandler;
    private final ConfirmBookingCommandHandler confirmBookingCommandHandler;
    private final GetBookingDetailQueryHandler getBookingDetailQueryHandler;
    private final BookingAddPromotionHandler bookingAddPromotionHandler;
    private final CancelBookingCommandHandler cancelBookingCommandHandler;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        String userId = SecurityUtils.getCurrentUserId();

        CreateBookingCommand command = new CreateBookingCommand(
                userId,
                request.getMaPhong(),
                request.getNgayDen(),
                request.getNgayDi());

        String bookingId = bookingCommandHandler.handle(command);

        return ResponseEntity.ok(new ApiResponse<>(true, "Tạo đơn đặt phòng thành công", bookingId));
    }

    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<String>> confirmBooking(
            @Valid @RequestBody ConfirmBookingPaymentRequest request) {
        String userId = SecurityUtils.getCurrentUserId();

        ConfirmBookingCommand command = new ConfirmBookingCommand(userId,
                request.getBookingId(),
                request.getRoomIds(),
                request.getServiceIds());

        String bookingId = confirmBookingCommandHandler.handle(command);

        return ResponseEntity.ok(new ApiResponse<>(true, "Xác nhận đặt phòng thành công", bookingId));
    }

    @GetMapping("/detail/{bookingId}")
    public ResponseEntity<ApiResponse<BookingResponseDto>> getBookingDetail(@PathVariable String bookingId) {
        BookingResponseDto dto = getBookingDetailQueryHandler.handle(new GetBookingDetailQuery(bookingId));
        if (dto == null) {
            return ResponseEntity.ok(new ApiResponse<>(false, "Không tìm thấy đơn đặt phòng", null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết đơn đặt phòng thành công", dto));
    }

    @PostMapping("/addPromotion/{bookingId}")
    public ResponseEntity<ApiResponse<Void>> addPromotion(@PathVariable String bookingId,
            @Valid @RequestBody BookingAddPromotionRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        BookingAddPromotionCommand command = new BookingAddPromotionCommand(bookingId, request.getPromotionCode(),
                userId);
        bookingAddPromotionHandler.handle(command);
        return ResponseEntity.ok(new ApiResponse<>(true, "Thêm khuyến mãi thành công", null));
    }

    @PostMapping("/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(@Valid @RequestBody CancelBookingRequest request) {
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
