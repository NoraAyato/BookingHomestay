# BookingHomeStay - Project Documentation

## 📋 Tổng Quan Dự Án

**BookingHomeStay** là một hệ thống đặt phòng homestay toàn diện, bao gồm:
- **Backend**: Spring Boot REST API
- **Web Application**: React + Vite + TailwindCSS
- **Database**: SQL Server (chính) + MongoDB (chat) + Redis (cache)

---

## 🏗️ Kiến Trúc Hệ Thống

### 1. Backend (Spring Boot)

#### Thông Tin Cơ Bản
- **Framework**: Spring Boot 3.5.3
- **Java Version**: 17
- **Build Tool**: Maven
- **Architecture Pattern**: Clean Architecture / Domain-Driven Design (DDD)

#### Tech Stack
```xml
Core Technologies:
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- Spring Boot Starter WebSocket (STOMP)

Database:
- SQL Server (Primary Database)
- MongoDB (Chat Database)
- Redis (Caching)
- H2 Database (Testing)

Security & Authentication:
- Spring Security
- JWT Authentication
- Google OAuth2

Communication:
- Jakarta Mail (Email Service)
- WebSocket + STOMP (Real-time Chat)

Utilities:
- Lombok
- Jakarta Validation API
```

#### Cấu Trúc Thư Mục Backend

```
Backend/app/src/main/java/com/bookinghomestay/app/
├── api/                          # API Layer (Controllers)
│   ├── controller/
│   │   ├── admin/               # Admin endpoints
│   │   ├── auth/                # Authentication endpoints
│   │   ├── host/                # Host management endpoints
│   │   └── user/                # User endpoints
│   └── application/             # Application Services Layer
│       ├── admin/               # Admin business logic
│       ├── ai/                  # AI Chat services
│       ├── amenities/           # Amenities management
│       ├── auth/                # Authentication services
│       ├── booking/             # Booking management
│       ├── chat/                # Chat services
│       ├── homestay/            # Homestay management
│       ├── location/            # Location services
│       ├── news/                # News/Blog services
│       ├── notification/        # Notification services
│       ├── payment/             # Payment processing
│       ├── policies/            # Policies management
│       ├── promotion/           # Promotion/Discount services
│       ├── reviews/             # Review/Rating services
│       └── users/               # User management
├── common/                       # Shared Components
│   ├── constant/                # Application constants
│   ├── exception/               # Custom exceptions
│   ├── response/                # Standard response DTOs
│   └── util/                    # Utility classes
├── config/                       # Configuration Classes
│   ├── exception/               # Exception handling config
│   ├── factory/                 # Factory patterns
│   └── model/                   # Configuration models
├── domain/                       # Domain Layer (Business Logic)
│   └── [feature]/
│       ├── command/             # Write operations (CQRS)
│       ├── query/               # Read operations (CQRS)
│       ├── dto/                 # Data Transfer Objects
│       ├── event/               # Domain events
│       └── factory/             # Domain factories
└── infrastructure/              # Infrastructure Layer
    ├── adapter/                 # External service adapters
    │   ├── ai/                  # AI service integration
    │   ├── elasticsearch/       # Search integration
    │   ├── file/                # File storage
    │   ├── firebase/            # Firebase integration
    │   ├── mapper/              # Object mapping
    │   ├── payment/             # Payment gateway
    │   ├── persistence/         # Database adapters
    │   ├── scheduler/           # Scheduled tasks
    │   ├── security/            # Security implementation
    │   ├── service/             # External services
    │   └── websocket/           # WebSocket handling
    ├── repository/              # Data Access Layer
    │   ├── jpa/                 # SQL Server repositories
    │   └── mongodb/             # MongoDB repositories
    └── service/                 # Infrastructure services
        ├── activitylog/         # Activity logging
        ├── ai/                  # AI services
        └── chat/                # Chat services
```

#### Tính Năng Chính

##### 1. **Authentication & Authorization**
- Đăng ký/Đăng nhập với Email & Password
- Google OAuth2 Login
- JWT Token-based Authentication
- Role-based Access Control (User, Host, Admin)
- Email OTP Verification

##### 2. **User Management**
- User Profile Management
- Avatar Upload
- Activity Logging
- User Statistics

##### 3. **Homestay Management** (Host)
- Create/Update/Delete Homestay
- Room Type Management
- Amenities Configuration
- Image Upload (Multiple images)
- Pricing & Availability Management
- Service Management

##### 4. **Booking System**
- Search & Filter Homestays
- Check Availability
- Create Booking
- Payment Integration (MoMo)
- Booking Status Management
- Cancellation & Refund

##### 5. **Review & Rating**
- Rate Homestay after booking
- Review Management
- Average Rating Calculation
- Host Response to Reviews

##### 6. **Chat System**
- Real-time Chat (WebSocket + STOMP)
- User-to-Host Chat
- AI Chatbot Assistant
- Chat History (MongoDB)
- Chat Sessions Management

##### 7. **Payment Integration**
- MoMo Payment Gateway
- Payment Status Tracking
- Transaction History

##### 8. **Notification System**
- Real-time Notifications
- Email Notifications
- Broadcast Notifications (Admin)
- Notification History

##### 9. **Promotion & Discount**
- Promotion Code Management
- Discount Rules
- Time-based Promotions

##### 10. **News/Blog**
- Create/Edit/Delete News Articles
- Topic/Category Management
- News Search

##### 11. **Admin Dashboard**
- System Statistics
- User Management
- Booking Management
- Homestay Approval
- Review Moderation
- Activity Logs
- Revenue Reports

##### 12. **Location Management**
- Province/City Management
- Location-based Search
- Popular Destinations

#### Database Configuration

**SQL Server** (Primary Database)
```properties
Database: DoAnCN
Port: 1433
Timezone: Asia/Ho_Chi_Minh
```

**MongoDB** (Chat Database)
```properties
Database: chat_db
Port: 27017
```

**Redis** (Cache)
```properties
Port: 6379
```

#### API Endpoints Structure

```
/api/auth/*           - Authentication endpoints
/api/users/*          - User management
/api/homestays/*      - Homestay operations
/api/bookings/*       - Booking management
/api/reviews/*        - Review & rating
/api/chat/*           - Chat system
/api/payments/*       - Payment processing
/api/notifications/*  - Notifications
/api/promotions/*     - Promotions
/api/news/*           - News/Blog
/api/locations/*      - Location services
/api/amenities/*      - Amenities management

Admin endpoints:
/api/admin/dashboard/*
/api/admin/users/*
/api/admin/homestays/*
/api/admin/bookings/*
/api/admin/reviews/*
/api/admin/news/*
/api/admin/promotions/*
/api/admin/activity-logs/*

Host endpoints:
/api/host/homestays/*
/api/host/bookings/*
/api/host/reviews/*
/api/host/services/*
/api/host/promotions/*
/api/host/dashboard/*
```

---

### 2. Web Application (Frontend)

#### Thông Tin Cơ Bản
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Language**: JavaScript (ES6+)
- **UI Framework**: TailwindCSS 3.4.17
- **Routing**: React Router DOM 7.8.1

#### Tech Stack
```json
Core:
- React 19.1.1
- React DOM 19.1.1
- Vite 7.1.2

UI/UX:
- TailwindCSS 3.4.17
- Framer Motion 12.23.12 (Animations)
- Lucide React 0.553.0 (Icons)

Communication:
- @stomp/stompjs 7.2.1 (WebSocket)
- sockjs-client 1.6.1

Utilities:
- date-fns 4.1.0 (Date formatting)
- recharts 3.3.0 (Charts)
- xlsx 0.18.5 (Excel export)

Firebase:
- firebase 12.4.0 (File storage, push notifications)
```

#### Cấu Trúc Thư Mục Web

```
Web/src/
├── api/                         # API Integration Layer
│   ├── admin/                   # Admin API calls
│   ├── host/                    # Host API calls
│   ├── amenities.js
│   ├── auth.js
│   ├── bookings.js
│   ├── chat.js
│   ├── config.js               # API base URL configuration
│   ├── firebase.js             # Firebase configuration
│   ├── homestay.js
│   ├── http.js                 # HTTP client
│   ├── location.js
│   ├── news.js
│   ├── notifications.js
│   ├── reviews.js
│   ├── socket.js               # WebSocket configuration
│   └── users.js
├── components/                  # React Components
│   ├── admin/                   # Admin components
│   │   ├── activity/           # Activity logs
│   │   ├── amenities/          # Amenities management
│   │   ├── bookings/           # Booking management
│   │   ├── common/             # Shared admin components
│   │   ├── dashboard/          # Dashboard widgets
│   │   ├── homestays/          # Homestay management
│   │   ├── locations/          # Location management
│   │   ├── news/               # News management
│   │   ├── promotions/         # Promotion management
│   │   ├── reviews/            # Review moderation
│   │   ├── roomtypes/          # Room type management
│   │   ├── services/           # Service management
│   │   └── usermanager/        # User management
│   ├── auth/                    # Authentication components
│   │   ├── AuthPopup.jsx
│   │   ├── EmailOtpForm.jsx
│   │   ├── ForgotPasswordForm.jsx
│   │   ├── LoginForm.jsx
│   │   └── RegisterForm.jsx
│   ├── booking/                 # Booking flow components
│   │   ├── AddRoomModal.jsx
│   │   ├── PromotionsSection.jsx
│   │   └── ServicesSection.jsx
│   ├── chat/                    # Chat components
│   │   ├── AIChatButton.jsx
│   │   ├── AIChatHistory.jsx
│   │   ├── AIChatManager.jsx
│   │   ├── AIChatSessions.jsx
│   │   ├── ChatBox.jsx
│   │   └── ChatButton.jsx
│   ├── common/                  # Shared components
│   ├── home/                    # Home page components
│   ├── homestay/                # Homestay display components
│   ├── host/                    # Host dashboard components
│   ├── layout/                  # Layout components
│   ├── news/                    # News/Blog components
│   └── user/                    # User profile components
├── contexts/                    # React Context
│   ├── AuthContext.jsx         # Authentication state
│   └── AuthPopupProvider.jsx   # Auth popup state
├── hooks/                       # Custom React Hooks
│   ├── admin/                   # Admin hooks
│   ├── host/                    # Host hooks
│   ├── useAIChat.js
│   ├── useAmenities.js
│   ├── useAuth.js
│   ├── useBookings.js
│   ├── useChat.js
│   ├── useDebounce.js
│   ├── useHomestay.js
│   ├── useInView.js
│   ├── useLocation.js
│   ├── useNews.js
│   ├── useNotification.js
│   ├── usePayment.js
│   ├── useReviews.js
│   └── useUser.js
├── pages/                       # Page Components
│   ├── aboutus/                # About us page
│   ├── admin/                  # Admin pages
│   ├── auth/                   # Auth pages
│   ├── booking/                # Booking pages
│   ├── error/                  # Error pages (404, etc.)
│   ├── home/                   # Home page
│   ├── homestay/               # Homestay pages
│   ├── host/                   # Host dashboard pages
│   ├── news/                   # News pages
│   └── user/                   # User profile pages
├── utils/                       # Utility Functions
│   ├── apiHelper.js            # API helpers
│   ├── cache.js                # Cache utilities
│   ├── date.js                 # Date formatting
│   ├── excelExport.js          # Excel export
│   ├── homestayParser.js       # Parse homestay data
│   ├── imageUrl.js             # Image URL helpers
│   ├── momoResultCodes.js      # MoMo payment codes
│   ├── notificationConfig.js   # Notification config
│   ├── price.js                # Price formatting
│   ├── session.js              # Session storage
│   ├── string.js               # String utilities
│   └── useReloadNavigate.js    # Navigation helper
├── App.jsx                      # Root component
├── main.jsx                     # Entry point
└── index.css                    # Global styles
```

#### Tính Năng Web Application

##### User Features
- **Home Page**: Search homestays, featured listings, popular destinations
- **Homestay Search**: Filter by location, price, amenities, rating
- **Homestay Detail**: View photos, amenities, reviews, availability
- **Booking Flow**: Select dates, rooms, add services, apply promotions
- **Payment**: MoMo payment integration
- **User Profile**: Edit profile, view booking history
- **Reviews**: Rate and review homestays
- **Chat**: Real-time chat with hosts, AI chatbot assistant
- **Notifications**: Real-time notifications
- **News/Blog**: Read travel articles

##### Host Features
- **Dashboard**: Statistics, revenue, bookings overview
- **Homestay Management**: Create/edit homestays, upload images
- **Room Management**: Manage room types, pricing
- **Booking Management**: View, accept, reject bookings
- **Service Management**: Add extra services
- **Promotion Management**: Create discount codes
- **Review Management**: Respond to reviews
- **Chat**: Chat with guests

##### Admin Features
- **Dashboard**: System overview, charts, statistics
- **User Management**: View/edit/delete users
- **Homestay Management**: Approve/reject listings
- **Booking Management**: View all bookings
- **Review Moderation**: Manage reviews
- **News Management**: Create/edit news articles
- **Promotion Management**: System-wide promotions
- **Location Management**: Manage locations
- **Activity Logs**: View system activity
- **Reports**: Revenue, booking, user reports (Excel export)

#### Routing Structure

```
Public Routes:
/                     - Home page
/homestay/:id         - Homestay detail
/homestay/search      - Search results
/news                 - News listing
/news/:id             - News detail
/about                - About us

Auth Routes:
/login                - Login page (handled by popup)
/register             - Register page (handled by popup)

User Routes:
/user/profile         - User profile
/user/bookings        - Booking history
/user/reviews         - My reviews
/user/notifications   - Notifications

Host Routes:
/host/dashboard       - Host dashboard
/host/homestays       - Manage homestays
/host/bookings        - Manage bookings
/host/reviews         - Manage reviews
/host/services        - Manage services
/host/promotions      - Manage promotions

Admin Routes:
/admin/dashboard      - Admin dashboard
/admin/users          - User management
/admin/homestays      - Homestay management
/admin/bookings       - Booking management
/admin/reviews        - Review management
/admin/news           - News management
/admin/promotions     - Promotion management
/admin/locations      - Location management
/admin/activity-logs  - Activity logs
```

---

## 🚀 Cài Đặt & Chạy Dự Án

### Backend Setup

#### Prerequisites
- Java 17+
- Maven 3.6+
- SQL Server
- MongoDB
- Redis

#### Steps
```bash
cd Backend/app

# Configure database
# Edit src/main/resources/application.properties

# Run the application
mvn spring-boot:run

# Or build and run
mvn clean package
java -jar target/app-0.0.1-SNAPSHOT.jar
```

**Backend runs on**: `http://localhost:8080`

#### Database Setup
```sql
-- Create SQL Server database
CREATE DATABASE DoAnCN;

-- MongoDB and Redis will auto-create databases
```

### Web Application Setup

#### Prerequisites
- Node.js 16+
- npm or yarn

#### Steps
```bash
cd Web

# Install dependencies
npm install

# Configure API endpoint
# Edit src/api/config.js if needed

# Run development server
npm run dev

# Build for production
npm run build
```

**Web app runs on**: `http://localhost:5173`

---

## 🔧 Configuration

### Backend Configuration

Key files in `Backend/app/src/main/resources/`:

**application.properties**
```properties
# Database
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=DoAnCN
spring.datasource.username=sa
spring.datasource.password=your_password

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/chat_db
spring.data.mongodb.database=chat_db

# Redis
spring.data.redis.host=localhost
spring.data.redis.port=6379

# Email
spring.mail.host=smtp.gmail.com
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password

# JWT
jwt.secret=your_secret_key
jwt.expiration=86400000

# Google OAuth
google.oauth.client-id=your_client_id
google.oauth.client-secret=your_client_secret
```

### Frontend Configuration

**src/api/config.js**
```javascript
export const BASE_URL = "http://localhost:8080";
```

**Firebase configuration** (src/api/firebase.js)
- Add your Firebase config for file storage and push notifications

---

## 📊 Database Schema

### SQL Server (Main Database)

**Core Tables:**
- `users` - User accounts
- `homestays` - Homestay listings
- `rooms` - Room types
- `bookings` - Booking records
- `booking_details` - Booking room details
- `reviews` - Reviews and ratings
- `payments` - Payment transactions
- `amenities` - Amenity types
- `homestay_amenities` - Homestay-amenity relations
- `services` - Extra services
- `promotions` - Promotion codes
- `locations` - Provinces/cities
- `news` - News articles
- `topics` - News categories
- `notifications` - User notifications
- `activity_logs` - System activity logs

### MongoDB (Chat Database)

**Collections:**
- `chat_sessions` - Chat session metadata
- `chat_messages` - Chat messages
- `ai_chat_sessions` - AI chatbot sessions
- `ai_chat_messages` - AI chatbot messages

---

## 🔐 Security

- **Authentication**: JWT-based authentication
- **Password**: BCrypt encryption
- **CORS**: Configured for cross-origin requests
- **API Security**: Role-based access control
- **SQL Injection**: Prevented by JPA/Hibernate
- **XSS Protection**: React's built-in protection

---

## 📝 Development Notes

### Backend
- Follow **Clean Architecture** principles
- Use **CQRS** pattern for domain operations
- Implement **Domain Events** for cross-module communication
- Use **Repository Pattern** for data access
- Apply **Factory Pattern** for object creation

### Frontend
- Use **Custom Hooks** for business logic
- Implement **Context API** for global state
- Follow **Component Composition** pattern
- Use **TailwindCSS** for styling
- Implement **Code Splitting** for optimization

---

## 📦 Deployment

### Backend
```bash
# Build Docker image
cd Backend
docker build -t bookinghomestay-backend .

# Run with Docker Compose
docker-compose up -d
```

### Frontend
```bash
# Build production bundle
cd Web
npm run build

# Deploy dist/ folder to hosting service
# (Vercel, Netlify, AWS S3, etc.)
```

---

## 👥 User Roles

1. **Guest/User**
   - Browse and search homestays
   - Make bookings
   - Leave reviews
   - Chat with hosts

2. **Host**
   - Manage homestay listings
   - Manage bookings
   - Communicate with guests
   - View statistics

3. **Admin**
   - Full system access
   - User management
   - Content moderation
   - System configuration

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

This project is private and proprietary.

---

## 📞 Support

For support or questions, please contact the development team.

---

**Last Updated**: December 19, 2025
