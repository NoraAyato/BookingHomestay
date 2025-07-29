# Cấu trúc thư mục dự án Flutter: Home Feel

```
lib/
├── app/                # Cấu hình app, theme, routes
│   ├── app.dart
│   ├── theme.dart
│   └── routes.dart
├── core/               # Thành phần dùng chung (service, constants, utils)
│   ├── services/
│   │   ├── service_locator.dart
│   │   └── api_service.dart
│   ├── constants/
│   │   └── api.dart
│   └── utils/
├── features/           # Chia module theo tính năng (feature-based)
│   ├── home/
│   │   ├── bloc/           # State management (BLoC)
│   │   ├── data/           # Model, repository
│   │   ├── domain/         # Usecase
│   │   └── presentation/   # UI (screens, widgets)
│   │       ├── screens/
│   │       │   └── home_screen.dart
│   │       └── widgets/
│   │           ├── homestay_card.dart
│   │           └── filter_chips.dart
│   ├── auth/
│   │   ├── bloc/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── screens/
│   │       │   ├── login_screen.dart
│   │       │   └── register_screen.dart
│   │       └── widgets/
│   ├── profile/
│   │   └── presentation/
│   │       └── screens/
│   │           └── profile_screen.dart
│   ├── bookings/
│   │   └── presentation/
│   │       └── screens/
│   │           └── bookings_screen.dart
│   ├── promotions/
│   │   └── presentation/
│   │       └── screens/
│   │           └── promotions_screen.dart
│   └── explore/
├── main.dart           # Entry point
assets/
└── icons/
    └── google.png      # Icon Google login
pubspec.yaml            # Khai báo dependencies, assets
```

## Giải thích nhanh
- **app/**: Cấu hình app, theme, routes, widget gốc.
- **core/**: Thành phần dùng chung cho toàn app (service, constants, utils).
- **features/**: Mỗi tính năng là một module độc lập, chia nhỏ theo clean architecture (data/domain/presentation/bloc).
- **presentation/screens/**: Các màn hình UI chính.
- **presentation/widgets/**: Các widget UI nhỏ, dùng lại nhiều nơi.
- **assets/icons/**: Chứa icon, hình ảnh dùng trong app.
- **main.dart**: Điểm khởi động ứng dụng.
- **pubspec.yaml**: Khai báo package, assets, fonts, ...

> Dự án tổ chức theo clean architecture, dễ mở rộng, bảo trì và phát triển tính năng mới.