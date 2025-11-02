package com.bookinghomestay.app.application.payment.command;

import com.bookinghomestay.app.domain.exception.ResourceNotFoundException;
import com.bookinghomestay.app.domain.model.ThanhToan;
import com.bookinghomestay.app.domain.repository.IThanhToanRepository;
import com.bookinghomestay.app.domain.service.PaymentService;
import com.bookinghomestay.app.domain.service.PendingRoomService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class HandlePaymentCallbackCommandHandler {

    private final PaymentService paymentService;
    private final IThanhToanRepository thanhToanRepository;
    private final PendingRoomService pendingRoomService;

    @Transactional
    public boolean handle(Map<String, String> callbackParams) {
        try {
            // 1. Verify callback signature and payment success
            boolean isValid = paymentService.verifyPaymentCallback(callbackParams);
            if (!isValid) {
                return false;
            }

            // 2. Get payment transaction
            String orderId = callbackParams.get("orderId");
         
            ThanhToan thanhToan = thanhToanRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch thanh toán"));

            // 3. Update payment status
            thanhToan.setTrangThai("SUCCESS");
            thanhToan.setNgayTT(LocalDateTime.now());

            // 4. Update invoice status
            if (thanhToan.getHoaDon() != null) {
                log.info("Updating invoice status to Paid");
                thanhToan.getHoaDon().setTrangThai("Paid");
            }
            thanhToan.getHoaDon().getPhieudatphong().setTrangThai("Booked");
            thanhToanRepository.save(thanhToan);

            return true;

        } catch (Exception e) {
            return false;
        }
    }
}
