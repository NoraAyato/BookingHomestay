package com.bookinghomestay.app.application.booking.event;

import com.bookinghomestay.app.application.notification.command.SendNotificationToUserCommand;
import com.bookinghomestay.app.application.notification.command.SendNotificationToUserCommandHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * Event Listener để tự động gửi thông báo khi có sự kiện booking
 * Đây là ví dụ về cách tích hợp WebSocket notification vào business logic
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BookingEventListener {

    private final SendNotificationToUserCommandHandler sendNotificationHandler;

    // Notification Type IDs - Nên lấy từ database hoặc constants
    private static final Long BOOKING_NOTIFICATION_TYPE_ID = 1L; // Adjust theo DB của bạn

    /**
     * Lắng nghe sự kiện BookingCreatedEvent
     * Tự động gửi thông báo cho Host khi có booking mới
     */
    @EventListener
    @Async // Chạy bất đồng bộ để không block booking process
    public void handleBookingCreated(BookingCreatedEvent event) {
        log.info("📩 BookingCreatedEvent received - Booking ID: {}", event.getBookingId());

        try {
            // 1. Tạo command gửi thông báo cho Host
            SendNotificationToUserCommand command = new SendNotificationToUserCommand(
                    event.getHostUserId(),
                    "🏠 Đặt phòng mới",
                    String.format(
                            "%s đã đặt phòng %s từ %s đến %s",
                            event.getGuestName(),
                            event.getHomestayName(),
                            event.getCheckInDate(),
                            event.getCheckOutDate()),
                    "/bookings/" + event.getBookingId(), // Link đến chi tiết booking
                    BOOKING_NOTIFICATION_TYPE_ID);

            // 2. Gửi thông báo (sẽ tự động push qua WebSocket)
            sendNotificationHandler.handle(command);

            log.info("✅ Notification sent to host {} via WebSocket", event.getHostUserId());

        } catch (Exception e) {
            log.error("❌ Error sending booking notification: {}", e.getMessage(), e);
            // Không throw exception để không ảnh hưởng đến booking process
        }
    }

    /**
     * Ví dụ: Thông báo khi booking được confirm
     */
    @EventListener
    @Async
    public void handleBookingConfirmed(BookingConfirmedEvent event) {
        log.info("📩 BookingConfirmedEvent received - Booking ID: {}", event.getBookingId());

        try {
            // Gửi thông báo cho Guest
            SendNotificationToUserCommand command = new SendNotificationToUserCommand(
                    event.getGuestUserId(),
                    "✅ Đặt phòng được xác nhận",
                    String.format(
                            "Đơn đặt phòng %s của bạn đã được xác nhận bởi chủ nhà",
                            event.getHomestayName()),
                    "/bookings/" + event.getBookingId(),
                    BOOKING_NOTIFICATION_TYPE_ID);

            sendNotificationHandler.handle(command);

            log.info("✅ Confirmation notification sent to guest {} via WebSocket", event.getGuestUserId());

        } catch (Exception e) {
            log.error("❌ Error sending confirmation notification: {}", e.getMessage(), e);
        }
    }

    /**
     * Ví dụ: Thông báo khi booking bị cancel
     */
    @EventListener
    @Async
    public void handleBookingCancelled(BookingCancelledEvent event) {
        log.info("📩 BookingCancelledEvent received - Booking ID: {}", event.getBookingId());

        try {
            // Gửi thông báo cho cả Host và Guest

            // 1. Thông báo cho Host
            SendNotificationToUserCommand hostCommand = new SendNotificationToUserCommand(
                    event.getHostUserId(),
                    "❌ Đặt phòng bị hủy",
                    String.format(
                            "Đơn đặt phòng %s đã bị hủy bởi %s",
                            event.getHomestayName(),
                            event.getCancelledBy()),
                    "/bookings/" + event.getBookingId(),
                    BOOKING_NOTIFICATION_TYPE_ID);
            sendNotificationHandler.handle(hostCommand);

            // 2. Thông báo cho Guest
            SendNotificationToUserCommand guestCommand = new SendNotificationToUserCommand(
                    event.getGuestUserId(),
                    "❌ Đặt phòng đã hủy",
                    String.format(
                            "Đơn đặt phòng %s của bạn đã được hủy. Lý do: %s",
                            event.getHomestayName(),
                            event.getCancelReason()),
                    "/bookings/" + event.getBookingId(),
                    BOOKING_NOTIFICATION_TYPE_ID);
            sendNotificationHandler.handle(guestCommand);

            log.info("✅ Cancellation notifications sent via WebSocket");

        } catch (Exception e) {
            log.error("❌ Error sending cancellation notification: {}", e.getMessage(), e);
        }
    }
}
