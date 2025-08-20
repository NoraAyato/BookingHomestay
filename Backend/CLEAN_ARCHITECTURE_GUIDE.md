# Clean Architecture Guide for BookingHomeStay Backend

## 1. Tổng quan Clean Architecture

Clean Architecture là mô hình thiết kế phần mềm giúp tách biệt rõ ràng các tầng (layer) trong hệ thống, đảm bảo tính độc lập, dễ mở rộng, dễ bảo trì và kiểm thử. Các tầng chính:

- **Presentation Layer (API/Controller):** Tiếp nhận request, trả về response, không xử lý nghiệp vụ.
- **Application Layer (UseCase/Service/Handler):** Điều phối luồng nghiệp vụ, gọi domain/service, không truy cập trực tiếp database/framework.
- **Domain Layer (Entity/Business Rule/Domain Service):** Chứa các entity, business rule, logic nghiệp vụ cốt lõi, không phụ thuộc framework.
- **Infrastructure Layer (Repository/External Service):** Chứa các implementation cho repository, truy cập database, tích hợp hệ thống ngoài.

## 2. Đánh giá kiến trúc hiện tại

### Đã làm tốt

- Tách Controller, Handler, Domain, Repository.
- Sử dụng CQRS cho nghiệp vụ booking.
- Domain model rõ ràng, có các entity, quan hệ, constructor hợp lý.
- Repository là interface, dễ thay thế implementation.

### Chưa chuẩn Clean Architecture

- Handler và Service vẫn phụ thuộc trực tiếp vào entity domain, xử lý cả business rule.
- Repository interface nằm ở infrastructure, nên đưa lên domain/application.
- Application layer chưa có các use case/service rõ ràng, Handler xử lý logic chi tiết.
- Business rule (quyền, chính sách, trạng thái) nên nằm ở domain/service.
- DTO và mapping chưa tách biệt rõ giữa các tầng.

## 3. Hướng giải quyết

- **Tách rõ các tầng:** Controller → Application Service/UseCase → Domain → Infrastructure
- **Đưa repository interface lên domain/application:** Interface ở domain/application, implementation ở infrastructure.
- **Đưa business rule vào domain/service:** Các rule như kiểm tra quyền, chính sách hủy phòng, trạng thái booking nên nằm ở domain/service.
- **Application layer chỉ orchestration:** Handler chỉ gọi service/use case, không xử lý logic chi tiết.
- **Tách DTO và mapping:** DTO chỉ dùng ở API, mapping sang domain nên tách riêng.
- **Đảm bảo dependency hướng vào trong:** Domain không phụ thuộc framework, infrastructure chỉ phụ thuộc vào interface của domain/application.

## 4. Ví dụ refactor use case hủy đặt phòng

**Trước:**

- Handler kiểm tra trạng thái, quyền, chính sách, tạo phiếu hủy, lưu repository.

**Sau:**

- Controller nhận request → gọi Application Service/UseCase (CancelBookingUseCase)
- UseCase gọi Domain Service (BookingDomainService) để kiểm tra quyền, trạng thái, chính sách
- Domain Service trả về kết quả, UseCase orchestration lưu repository
- Repository interface ở domain/application, implementation ở infrastructure

## 5. Sơ đồ phụ thuộc

```
API/Controller
    ↓
Application (UseCase/Service/Handler)
    ↓
Domain (Entity/Business Rule/Domain Service)
    ↓
Infrastructure (Repository Implementation, External Service)
```

## 6. Lợi ích khi refactor chuẩn Clean Architecture

- Dễ mở rộng, bảo trì, kiểm thử
- Business rule tập trung, dễ thay đổi
- Dễ tích hợp hệ thống ngoài
- Giảm phụ thuộc framework

## 7. Ví dụ cấu trúc source code chuẩn Clean Architecture

```plaintext
src/
└── main/
    └── java/
        └── com/
            └── bookinghomestay/
                ├── api/
                │   └── controller/
                │   └── dto/
                ├── application/
                │   └── booking/
                │       └── command/
                │       └── query/
                │       └── service/
                ├── domain/
                │   └── model/
                │   └── repository/
                │   └── service/
                ├── infrastructure/
                │   └── repository/
                │   └── exception/
                │   └── scheduler/
                │   └── adapter/
                └── config/
```

- `api/controller`: Controller nhận request từ client.
- `api/dto`: DTO cho request/response.
- `application/booking/command|query|service`: Command/Query/UseCase và các handler.
- `domain/model`: Entity, value object, aggregate root.
- `domain/repository`: Interface repository, không phụ thuộc framework.
- `domain/service`: Business service, chứa business rule.
- `infrastructure/repository`: Implementation repository, truy cập DB.
- `infrastructure/exception|scheduler|adapter`: Exception, scheduler, tích hợp ngoài.
- `config`: Cấu hình ứng dụng.

Bạn chỉ cần follow đúng cấu trúc này, tách biệt rõ các tầng, đảm bảo business rule nằm ở domain/service, repository interface ở domain, DTO chỉ dùng ở API.

---

**Nếu cần ví dụ refactor cụ thể cho một use case, hãy yêu cầu!**
