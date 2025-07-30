# BookingHomeStay Backend Project Structure

## Tổng quan
Project backend được xây dựng bằng Spring Boot 3.5.3 với kiến trúc Clean Architecture, sử dụng JWT cho authentication và SQL Server làm database.

## Công nghệ sử dụng
- **Framework**: Spring Boot 3.5.3
- **Database**: SQL Server
- **Authentication**: JWT (JSON Web Token)
- **Cache**: Redis
- **Search Engine**: Elasticsearch
- **Email**: Spring Mail (Gmail SMTP)
- **OAuth**: Google OAuth 2.0
- **Build Tool**: Maven
- **Java Version**: 17

## Cấu trúc thư mục

```
Backend/
├── app/
│   ├── src/main/java/com/bookinghomestay/app/
│   │   ├── api/                    # API Layer
│   │   │   ├── controller/         # REST Controllers
│   │   │   ├── dto/               # Data Transfer Objects
│   │   │   ├── constant/          # Constants
│   │   │   └── exception/         # API Exceptions
│   │   ├── application/           # Application Layer (Use Cases)
│   │   │   ├── auth/              # Authentication use cases
│   │   │   ├── homestay/          # Homestay use cases
│   │   │   ├── khuvuc/            # Location use cases
│   │   │   ├── promotion/         # Promotion use cases
│   │   │   └── users/             # User management use cases
│   │   ├── domain/                # Domain Layer
│   │   │   ├── model/             # Domain Entities
│   │   │   ├── repository/        # Repository Interfaces
│   │   │   ├── service/           # Domain Services
│   │   │   └── exception/         # Domain Exceptions
│   │   ├── infrastructure/        # Infrastructure Layer
│   │   │   ├── persistence/       # Database Implementation
│   │   │   ├── security/          # Security Implementation
│   │   │   ├── elasticsearch/     # Search Implementation
│   │   │   └── adapter/           # External Adapters
│   │   └── config/                # Configuration
│   │       ├── SecurityConfig.java
│   │       └── ElasticsearchConfig.java
│   └── src/main/resources/
│       ├── application.properties  # Main configuration
│       ├── application-docker.properties
│       ├── db/migration/          # Database migrations
│       ├── static/                # Static resources
│       └── templates/             # Email templates
├── docker-compose.yml
└── pom.xml
```

## Kiến trúc Clean Architecture

### 1. API Layer (Controllers)
- **Chức năng**: Xử lý HTTP requests/responses
- **Vị trí**: `api/controller/`
- **Ví dụ**: `AuthController`, `HomestayController`

### 2. Application Layer (Use Cases)
- **Chức năng**: Orchestrate business logic
- **Vị trí**: `application/`
- **Pattern**: Command/Query pattern
- **Ví dụ**: `LoginUserCommandHandler`, `RegisterUserCommandHandler`

### 3. Domain Layer (Core Business Logic)
- **Chức năng**: Business entities và rules
- **Vị trí**: `domain/`
- **Components**:
  - `model/`: Domain entities (User, Homestay, etc.)
  - `repository/`: Repository interfaces
  - `service/`: Domain services

### 4. Infrastructure Layer (External Concerns)
- **Chức năng**: External dependencies implementation
- **Vị trí**: `infrastructure/`
- **Components**:
  - `persistence/`: Database implementation
  - `security/`: JWT, authentication
  - `elasticsearch/`: Search functionality
  - `adapter/`: External services

## Security Implementation

### JWT Authentication Flow
1. **Login**: User đăng nhập với email/password
2. **Token Generation**: Server tạo JWT token với userId làm subject
3. **Token Validation**: Mỗi request được validate qua JwtAuthenticationFilter
4. **User Context**: SecurityContextHolder lưu thông tin user

### Vấn đề với getCurrentUsername()

**Vấn đề**: Phương thức `getCurrentUsername()` trả về email thay vì username

**Nguyên nhân**:
1. **JWT Token**: Token được tạo với `userId` làm subject (không phải email)
2. **CustomUserDetailsService**: Load user bằng `userName` từ database
3. **Authentication**: Spring Security sử dụng `userName` làm principal name

**Luồng xử lý**:
```
JWT Token (subject = userId) 
→ JwtAuthenticationFilter.getUserId(token) 
→ CustomUserDetailsService.loadUserByUsername(userId) 
→ User.getUserName() 
→ Authentication.getName() = userName
```

**Giải pháp**:
1. **Option 1**: Thay đổi JWT token để sử dụng email làm subject
2. **Option 2**: Tạo method riêng `getCurrentEmail()` 
3. **Option 3**: Sử dụng custom principal chứa cả username và email

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    user_name VARCHAR(255),
    pass_word VARCHAR(255),
    first_name NVARCHAR(20),
    last_name NVARCHAR(20),
    email VARCHAR(255),
    picture VARCHAR(255),
    phone_number VARCHAR(255),
    is_recieve_email VARCHAR(255),
    gender BIT,
    birthday DATE,
    created_at DATETIME2,
    status VARCHAR(255),
    role_id BIGINT
);
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/change-password` - Đổi mật khẩu
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/verify-otp` - Xác thực OTP
- `POST /api/auth/refresh-token` - Refresh token
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/reset-password` - Reset password

### Public APIs
- `GET /api/homestays/**` - Homestay data
- `GET /api/search/**` - Search functionality
- `GET /api/locations/**` - Location data
- `GET /api/promotions/**` - Promotion data
- `GET /img/**` - Static images

## Configuration Files

### application.properties
- Database connection (SQL Server)
- JWT configuration
- Email settings (Gmail SMTP)
- Redis configuration
- Google OAuth settings
- Elasticsearch configuration

### Security Configuration
- CORS configuration
- JWT filter setup
- Public endpoints configuration
- Password encoder

## Dependencies

### Core Dependencies
- `spring-boot-starter-web` - Web framework
- `spring-boot-starter-security` - Security framework
- `spring-boot-starter-data-jpa` - JPA/Hibernate
- `spring-boot-starter-data-redis` - Redis cache
- `spring-boot-starter-mail` - Email service

### External Libraries
- `jjwt` - JWT implementation
- `google-api-client` - Google OAuth
- `elasticsearch-java` - Elasticsearch client
- `lombok` - Code generation
- `hibernate-validator` - Validation

## Deployment

### Docker Support
- `Dockerfile` - Container configuration
- `docker-compose.yml` - Multi-container setup
- `application-docker.properties` - Docker-specific config

### Build
```bash
mvn clean install
mvn spring-boot:run
```

## Issues và Recommendations

### 1. getCurrentUsername Issue
**Vấn đề**: Method trả về email thay vì username
**Giải pháp**: 
```java
// Tạo method mới
public static String getCurrentEmail() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated())
        return null;
    return authentication.getName(); // Hiện tại trả về email
}

public static String getCurrentUsername() {
    // Implement logic để trả về username thực sự
}
```

### 2. Security Improvements
- Implement rate limiting
- Add request logging
- Implement audit trails
- Add input validation

### 3. Performance Optimizations
- Implement caching strategies
- Add database indexing
- Optimize JPA queries
- Implement pagination

### 4. Code Quality
- Add comprehensive unit tests
- Implement integration tests
- Add API documentation (Swagger)
- Implement proper error handling 