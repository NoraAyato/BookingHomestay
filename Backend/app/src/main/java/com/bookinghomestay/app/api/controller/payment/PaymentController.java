package com.bookinghomestay.app.api.controller.payment;

import com.bookinghomestay.app.application.payment.command.CreatePaymentCommand;
import com.bookinghomestay.app.application.payment.command.CreatePaymentCommandHandler;
import com.bookinghomestay.app.application.payment.command.HandlePaymentCallbackCommandHandler;
import com.bookinghomestay.app.application.payment.dto.CreateMoMoPaymentRequest;
import com.bookinghomestay.app.common.response.ApiResponse;
import com.bookinghomestay.app.infrastructure.security.SecurityUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final CreatePaymentCommandHandler createPaymentCommandHandler;
    private final HandlePaymentCallbackCommandHandler handlePaymentCallbackCommandHandler;

    /**
     * Create MoMo payment
     */
    @PostMapping("/momo/create")
    public ResponseEntity<ApiResponse<String>> createMoMoPayment(
            @Valid @RequestBody CreateMoMoPaymentRequest request) {
        String userId = SecurityUtils.getCurrentUserId();
        CreatePaymentCommand command = new CreatePaymentCommand(
                request.getBookingId(),
                request.getSoTien(),
                "MOMO",
                request.getNoiDung(),
                request.getReturnUrl(),
                request.getNotifyUrl(), userId);

        String paymentUrl = createPaymentCommandHandler.handle(command);

        return ResponseEntity.ok(new ApiResponse<>(true, "Tạo yêu cầu thanh toán MoMo thành công", paymentUrl));
    }

    /**
     * MoMo IPN (Instant Payment Notification) callback
     */
    @PostMapping("/momo/callback")
    public ResponseEntity<ApiResponse<Void>> handleMoMoCallback(@RequestParam Map<String, String> params) {
        boolean success = handlePaymentCallbackCommandHandler.handle(params);

        if (success) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Xử lý callback thành công", null));
        } else {
            return ResponseEntity.ok(new ApiResponse<>(false, "Xử lý callback thất bại", null));
        }
    }

    @PostMapping("/momo/confirm")
    public ResponseEntity<ApiResponse<Void>> confirmMoMoPayment(@RequestBody Map<String, String> params) {
        boolean success = handlePaymentCallbackCommandHandler.handle(params);
        if (success) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Xác nhận thanh toán thành công", null));
        } else {
            return ResponseEntity.ok(new ApiResponse<>(false, "Xác nhận thanh toán thất bại", null));
        }
    }
}
