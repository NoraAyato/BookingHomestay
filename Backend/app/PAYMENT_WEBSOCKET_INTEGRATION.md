# 🔔 Hướng dẫn tích hợp WebSocket Notification vào Payment Flow

## 📝 Tích hợp vào PaymentController/Service

### Bước 1: Inject ApplicationEventPublisher

Thêm vào `CreatePaymentCommandHandler.java` hoặc trong callback handler:

```java
@Service
@RequiredArgsConstructor
public class HandlePaymentCallbackCommandHandler {

    private final ApplicationEventPublisher eventPublisher; // ← THÊM CÁI NÀY
    private final BookingRepository bookingRepository;
    // ... các dependencies khác

    public void handle(HandlePaymentCallbackCommand command) {
        // 1. Validate callback signature
        validateCallback(command);

        // 2. Update booking status
        Booking booking = bookingRepository.findById(command.getBookingId())
                .orElseThrow();
        booking.setPaymentStatus("PAID");
        bookingRepository.save(booking);

        // 3. THÊM ĐOẠN NÀY: Publish event để gửi notification qua WebSocket
        PaymentSuccessEvent event = new PaymentSuccessEvent(
            booking.getId(),
            booking.getUser().getUserId(),
            booking.getHomestay().getName(),
            command.getAmount(),
            "MoMo"  // hoặc command.getPaymentMethod()
        );
        eventPublisher.publishEvent(event);
        // ✅ User sẽ nhận notification "Thanh toán thành công" qua WebSocket!

        log.info("✅ Payment processed and notification sent via WebSocket");
    }
}
```

---

## 🔄 Luồng hoạt động đầy đủ

### MoMo Payment Flow + WebSocket Notification

```
1. User click "Thanh toán"
   ↓
2. Frontend gọi POST /api/payment/momo/create
   ↓
3. Backend tạo payment request → redirect đến MoMo
   ↓
4. User nhập mã OTP trên app MoMo
   ↓
5. MoMo callback đến Backend: POST /api/payment/momo/callback
   ↓
6. Backend validate signature + update booking status
   ↓
7. PUBLISH PaymentSuccessEvent
   ↓
8. PaymentEventListener bắt event
   ↓
9. Gửi notification qua SendNotificationToUserCommand
   ↓
10. Handler lưu DB + Push qua WebSocket
   ↓
11. Frontend nhận notification NGAY LẬP TỨC
   ↓
12. Toast hiện ra: "💳 Thanh toán thành công..."
```

---

## 💻 Code ví dụ đầy đủ

### Backend: HandlePaymentCallbackCommandHandler

```java
package com.bookinghomestay.app.application.payment.command;

import com.bookinghomestay.app.application.payment.event.PaymentSuccessEvent;
import com.bookinghomestay.app.domain.model.Booking;
import com.bookinghomestay.app.infrastructure.persistence.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class HandlePaymentCallbackCommandHandler {

    private final BookingRepository bookingRepository;
    private final ApplicationEventPublisher eventPublisher;
    // private final MoMoService moMoService; // để validate signature

    @Transactional
    public void handle(Map<String, String> callbackData) {
        log.info("📥 Processing MoMo callback...");

        // 1. Parse callback data
        String orderId = callbackData.get("orderId");
        String resultCode = callbackData.get("resultCode");
        String amount = callbackData.get("amount");

        // 2. Validate signature (bỏ qua trong ví dụ)
        // if (!moMoService.validateSignature(callbackData)) {
        //     throw new RuntimeException("Invalid signature");
        // }

        // 3. Check result code
        if (!"0".equals(resultCode)) {
            log.error("❌ Payment failed with code: {}", resultCode);
            return;
        }

        // 4. Update booking
        Long bookingId = extractBookingIdFromOrderId(orderId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setPaymentStatus("PAID");
        booking = bookingRepository.save(booking);

        // 5. PUBLISH EVENT để gửi notification qua WebSocket
        PaymentSuccessEvent event = new PaymentSuccessEvent(
            booking.getId(),
            booking.getUser().getUserId(),
            booking.getHomestay().getName(),
            Double.parseDouble(amount),
            "MoMo"
        );
        eventPublisher.publishEvent(event);

        log.info("✅ Payment processed successfully, notification sent via WebSocket");
    }

    private Long extractBookingIdFromOrderId(String orderId) {
        // Giả sử orderId có format: "BOOKING_{bookingId}_{timestamp}"
        return Long.parseLong(orderId.split("_")[1]);
    }
}
```

### Frontend: Hiển thị payment success notification

Khi user đang ở trang thanh toán và MoMo callback về, notification sẽ tự động hiện:

```javascript
// NotificationProvider.jsx (đã setup từ trước)
const handleNewNotification = (notification) => {
  // Notification type: PAYMENT_SUCCESS
  if (notification.typeName === "PAYMENT") {
    toast.success(
      <div>
        <strong>💳 {notification.tieuDe}</strong>
        <p>{notification.noiDung}</p>
      </div>,
      {
        position: "top-center",
        autoClose: 7000,
        onClick: () => {
          // Redirect đến trang booking details
          window.location.href = notification.maLienKet;
        },
      }
    );

    // Optional: Play success sound
    new Audio("/sounds/payment-success.mp3").play();
  }
};
```

---

## 🎨 UI/UX Enhancement

### Toast Notification với icon và style đẹp

```javascript
// Custom toast component
const PaymentSuccessToast = ({ notification }) => (
  <div className="payment-success-toast">
    <div className="icon">💳</div>
    <div className="content">
      <h4>{notification.tieuDe}</h4>
      <p>{notification.noiDung}</p>
      <button onClick={() => (window.location.href = notification.maLienKet)}>
        Xem chi tiết
      </button>
    </div>
  </div>
);

// Trong NotificationProvider
toast(<PaymentSuccessToast notification={notification} />, {
  className: "payment-success-toast-container",
  autoClose: 10000,
});
```

### CSS

```css
.payment-success-toast {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.payment-success-toast .icon {
  font-size: 32px;
  animation: bounce 1s ease-in-out infinite;
}

.payment-success-toast button {
  margin-top: 8px;
  padding: 8px 16px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
```

---

## 🧪 Testing Payment Flow với WebSocket

### Test 1: Mock MoMo callback

```bash
# Gửi mock callback
POST http://localhost:8080/api/payment/momo/callback
Content-Type: application/json

{
  "orderId": "BOOKING_123_1234567890",
  "resultCode": "0",
  "amount": "1000000",
  "orderInfo": "Thanh toan booking 123",
  "signature": "..."
}
```

**Kết quả mong đợi:**

- ✅ Booking status → PAID
- ✅ WebSocket notification gửi đến user
- ✅ Toast hiện ra với message "Thanh toán thành công..."

### Test 2: Test với ngrok (MoMo callback từ production)

```bash
# 1. Start ngrok
ngrok http 8080

# 2. Copy URL: https://abc123.ngrok.io

# 3. Tạo payment với notifyUrl
POST http://localhost:8080/api/payment/momo/create
{
  "bookingId": 123,
  "soTien": 1000000,
  "returnUrl": "http://localhost:3000/payment-result",
  "notifyUrl": "https://abc123.ngrok.io/api/payment/momo/callback"
}

# 4. Thanh toán trên MoMo app

# 5. Check WebSocket có nhận notification không
```

---

## 📊 Timeline: User thấy notification khi nào?

### Scenario 1: User đang ở trang thanh toán

```
0ms  : User click "Xác nhận thanh toán" trên MoMo app
100ms: MoMo callback đến backend
150ms: Backend xử lý + publish event
200ms: WebSocket push notification
250ms: Frontend nhận notification
300ms: Toast hiện ra
```

**➡️ User thấy notification SAU 300ms**

### Scenario 2: User đã tắt app

```
- MoMo callback về backend → notification lưu DB
- Khi user mở app lại:
  1. GET /api/notifications/unread → thấy notification mới
  2. WebSocket connect → subscribe nhận notification real-time
```

---

## 🔐 Security Best Practices

### 1. Validate MoMo Signature

```java
if (!moMoService.validateSignature(callbackData)) {
    log.error("❌ Invalid MoMo signature!");
    throw new SecurityException("Invalid callback signature");
}
```

### 2. Check Amount Match

```java
if (!booking.getTotalAmount().equals(callbackAmount)) {
    log.error("❌ Amount mismatch! Expected: {}, Got: {}",
              booking.getTotalAmount(), callbackAmount);
    throw new RuntimeException("Amount mismatch");
}
```

### 3. Prevent Duplicate Processing

```java
if ("PAID".equals(booking.getPaymentStatus())) {
    log.warn("⚠️ Payment already processed for booking: {}", bookingId);
    return; // Ignore duplicate callback
}
```

---

## 📈 Monitoring & Logging

### Log payment flow

```java
log.info("🔔 Payment notification flow:");
log.info("  1. Callback received: orderId={}, resultCode={}", orderId, resultCode);
log.info("  2. Booking updated: id={}, status=PAID", bookingId);
log.info("  3. Event published: PaymentSuccessEvent");
log.info("  4. Notification sent via WebSocket to user: {}", userId);
log.info("  5. ✅ Flow completed in {}ms", duration);
```

### Metrics to track

- Payment callback response time
- WebSocket notification delivery time
- Failed payment rate
- Duplicate callback rate

---

## 🎯 Checklist

### Backend Payment Integration

- [x] PaymentSuccessEvent created
- [x] PaymentEventListener created
- [ ] Inject ApplicationEventPublisher vào PaymentService/Handler
- [ ] Publish event sau khi payment success
- [ ] Test với mock callback
- [ ] Test với real MoMo callback (ngrok)

### Frontend

- [ ] Handle PAYMENT notification type
- [ ] Custom toast style cho payment success
- [ ] Play success sound (optional)
- [ ] Redirect to booking details
- [ ] Test notification hiển thị

---

**✅ Sau khi hoàn thành, user sẽ nhận notification thanh toán real-time ngay lập tức!**
