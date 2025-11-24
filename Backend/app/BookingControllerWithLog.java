package com.bookinghomestay.app.api.controller.booking;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import com.bookinghomestay.app.application.booking.command.*;
import com.bookinghomestay.app.application.booking.dto.booking.*;
import com.bookinghomestay.app.application.booking.query.*;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.domain.model.activitylog.ActivityAction;
import com.bookinghomestay.app.domain.model.activitylog.ActivityType;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;
import com.bookinghomestay.app.infrastructure.service.ActivityLogHelper;

import lombok.RequiredArgsConstructor;

/**
 * EXAMPLE: BookingController với Activity Log
 * Minh họa cách triển khai log cho các hành động của user
 */
@RestController
@RequestMapping("/api/Booking")
@RequiredArgsConstructor
public class BookingControllerWithLog {
    
    private final CreateBookingCommandHandler bookingCommandHandler;
    private final ConfirmBookingCommandHandler confirmBookingCommandHandler;
    private final CancelBookingCommandHandler cancelBookingCommandHandler;
    private final GetBookingDetailQueryHandler getBookingDetailQueryHandler;
    
    // ✅ Inject ActivityLogHelper
    private final ActivityLogHelper activityLogHelper;

    /**
     * ✅ EXAMPLE 1: Create Booking - Log khi tạo booking
     */
    @PostMapping
    public ResponseEntity<ApiResponse<String>> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            HttpServletRequest httpRequest) {
        
        String userId = SecurityUtils.getCurrentUserId();

        CreateBookingCommand command = new CreateBookingCommand(
                userId,
                request.getMaPhong(),
                request.getNgayDen(),
                request.getNgayDi());

        String bookingId = bookingCommandHandler.handle(command);

        // ✅ LOG ACTIVITY
        activityLogHelper.log(
            ActivityType.BOOKING,
            ActivityAction.CREATE,
            "Tạo booking mới #" + bookingId,
            String.format("Đặt phòng %s từ %s đến %s", 
                request.getMaPhong(), 
                request.getNgayDen(), 
                request.getNgayDi()),
            "Booking",
            bookingId,
            httpRequest,
            null  // metadata (optional)
        );

        return ResponseEntity.ok(
            new ApiResponse<>(true, "Tạo đơn đặt phòng thành công", bookingId)
        );
    }

    /**
     * ✅ EXAMPLE 2: Confirm Booking - Log khi xác nhận
     */
    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<String>> confirmBooking(
            @Valid @RequestBody ConfirmBookingPaymentRequest request,
            HttpServletRequest httpRequest) {
        
        String userId = SecurityUtils.getCurrentUserId();

        ConfirmBookingCommand command = new ConfirmBookingCommand(
            userId,
            request.getBookingId(),
            request.getRoomIds(),
            request.getServiceIds()
        );

        String bookingId = confirmBookingCommandHandler.handle(command);

        // ✅ LOG ACTIVITY với metadata
        String metadata = String.format(
            "{\"roomIds\": %s, \"serviceIds\": %s, \"totalAmount\": %d}",
            request.getRoomIds(),
            request.getServiceIds(),
            calculateTotal(request)  // Your logic
        );

        activityLogHelper.log(
            ActivityType.BOOKING,
            ActivityAction.APPROVE,
            "Xác nhận booking #" + bookingId,
            String.format("Booking được xác nhận với %d phòng và %d dịch vụ", 
                request.getRoomIds().size(),
                request.getServiceIds().size()),
            "Booking",
            bookingId,
            httpRequest,
            metadata
        );

        return ResponseEntity.ok(
            new ApiResponse<>(true, "Xác nhận đặt phòng thành công", bookingId)
        );
    }

    /**
     * ✅ EXAMPLE 3: Cancel Booking - Log khi hủy
     */
    @PostMapping("/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @Valid @RequestBody CancelBookingRequest request,
            HttpServletRequest httpRequest) {
        
        String userId = SecurityUtils.getCurrentUserId();

        CancelBookingCommand command = new CancelBookingCommand(
            request.getBookingId(),
            userId,
            request.getCancelReason()
        );

        cancelBookingCommandHandler.handle(command);

        // ✅ LOG ACTIVITY
        String metadata = String.format(
            "{\"reason\": \"%s\", \"refundAmount\": %d}",
            request.getCancelReason(),
            request.getRefundAmount()
        );

        activityLogHelper.log(
            ActivityType.BOOKING,
            ActivityAction.CANCEL,
            "Hủy booking #" + request.getBookingId(),
            "Booking bị hủy: " + request.getCancelReason(),
            "Booking",
            request.getBookingId(),
            httpRequest,
            metadata
        );

        return ResponseEntity.ok(
            new ApiResponse<>(true, "Hủy đặt phòng thành công", null)
        );
    }

    /**
     * ✅ EXAMPLE 4: View Details - Log khi xem chi tiết (optional)
     */
    @GetMapping("/detail/{bookingId}")
    public ResponseEntity<ApiResponse<BookingResponseDto>> getBookingDetail(
            @PathVariable String bookingId,
            HttpServletRequest httpRequest) {
        
        BookingResponseDto dto = getBookingDetailQueryHandler.handle(
            new GetBookingDetailQuery(bookingId)
        );

        if (dto == null) {
            return ResponseEntity.ok(
                new ApiResponse<>(false, "Không tìm thấy đơn đặt phòng", null)
            );
        }

        // ✅ LOG ACTIVITY (Optional - nếu muốn track viewing)
        activityLogHelper.log(
            ActivityType.BOOKING,
            ActivityAction.VIEW,
            "Xem chi tiết booking #" + bookingId,
            "User xem thông tin booking",
            "Booking",
            bookingId,
            httpRequest,
            null
        );

        return ResponseEntity.ok(
            new ApiResponse<>(true, "Lấy chi tiết đơn đặt phòng thành công", dto)
        );
    }

    // Helper method (example)
    private int calculateTotal(ConfirmBookingPaymentRequest request) {
        // Your calculation logic
        return 0;
    }
}
