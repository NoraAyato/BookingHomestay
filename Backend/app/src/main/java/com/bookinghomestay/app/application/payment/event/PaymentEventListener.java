package com.bookinghomestay.app.application.payment.event;

import com.bookinghomestay.app.application.notification.command.SendNotificationToUserCommand;
import com.bookinghomestay.app.application.notification.command.SendNotificationToUserCommandHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Event Listener để tự động gửi thông báo khi có sự kiện payment
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventListener {

    private final SendNotificationToUserCommandHandler sendNotificationHandler;

    private static final Long PAYMENT_NOTIFICATION_TYPE_ID = 2L; // Adjust theo DB của bạn

    /**
     * Tự động gửi thông báo khi payment thành công
     */
    @EventListener
    @Async
    public void handlePaymentSuccess(PaymentSuccessEvent event) {
        log.info("📩 PaymentSuccessEvent received - Booking ID: {}", event.getBookingId());

        try {
            SendNotificationToUserCommand command = new SendNotificationToUserCommand(
                    event.getUserId(),
                    "💳 Thanh toán thành công",
                    String.format(
                            "Bạn đã thanh toán thành công %.0f VNĐ cho đặt phòng %s qua %s",
                            event.getAmount(),
                            event.getHomestayName(),
                            event.getPaymentMethod().toUpperCase()),
                    "/bookings/" + event.getBookingId(),
                    PAYMENT_NOTIFICATION_TYPE_ID);

            sendNotificationHandler.handle(command);

            log.info("✅ Payment success notification sent to user {} via WebSocket", event.getUserId());

        } catch (Exception e) {
            log.error("❌ Error sending payment notification: {}", e.getMessage(), e);
        }
    }
}
