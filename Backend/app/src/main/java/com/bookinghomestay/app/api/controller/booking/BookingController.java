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
import com.bookinghomestay.app.application.booking.command.BookingPaymentCommand;
import com.bookinghomestay.app.application.booking.command.BookingPaymentCommandHandler;
import com.bookinghomestay.app.application.booking.command.ConfirmBookingCommand;
import com.bookinghomestay.app.application.booking.command.ConfirmBookingCommandHandler;
import com.bookinghomestay.app.application.booking.command.CreateBookingCommand;
import com.bookinghomestay.app.application.booking.command.CreateBookingCommandHandler;
import com.bookinghomestay.app.application.booking.query.GetBookingDetailQuery;
import com.bookinghomestay.app.application.booking.query.GetBookingDetailQueryHandler;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/Booking")
@RequiredArgsConstructor
public class BookingController {
    private final CreateBookingCommandHandler bookingCommandHandler;
    private final ConfirmBookingCommandHandler confirmBookingCommandHandler;
    private final GetBookingDetailQueryHandler getBookingDetailQueryHandler;
    private final BookingPaymentCommandHandler bookingPaymentCommandHandler;

    @PostMapping
    public ApiResponse<String> createBooking(@RequestBody CreateBookingRequest request) {
        String userId = SecurityUtils.getCurrentUserId();

        CreateBookingCommand command = new CreateBookingCommand(
                userId,
                request.getMaPhong(),
                request.getNgayDen(),
                request.getNgayDi());

        String bookingId = bookingCommandHandler.handle(command);

        return new ApiResponse<>(true, "Booking created successfully", bookingId);
    }

    @PostMapping("/confirm")
    public ApiResponse<BookingPaymentResponseDto> confirmBooking(@RequestBody ConfirmBookingPaymentRequest request) {
        String userId = SecurityUtils.getCurrentUserId();

        ConfirmBookingCommand command = new ConfirmBookingCommand(userId,
                request.getMaPDPhong(),
                request.getServiceIds(),
                request.getPromotionId());

        BookingPaymentResponseDto responseDto = confirmBookingCommandHandler.handle(command);

        return new ApiResponse<>(true, "Booking confirmed successful", responseDto);
    }

    @GetMapping("/{bookingId}/detail")
    public ApiResponse<BookingDetailResponseDto> getBookingDetail(@PathVariable String bookingId) {
        BookingDetailResponseDto dto = getBookingDetailQueryHandler.handle(new GetBookingDetailQuery(bookingId));
        if (dto == null) {
            return new ApiResponse<>(false, "Booking not found", null);
        }
        return new ApiResponse<>(true, "Success", dto);
    }

    @PostMapping("/payment")
    public ApiResponse<Void> payBooking(@RequestBody ConfirmPaymentRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        BookingPaymentCommand command = new BookingPaymentCommand(request.getMaPDPhong(),
                request.getSoTien(),
                request.getPhuongThuc(), userId);

        bookingPaymentCommandHandler.handle(command);
        return new ApiResponse<>(true, "Payment successful", null);
    }
}
