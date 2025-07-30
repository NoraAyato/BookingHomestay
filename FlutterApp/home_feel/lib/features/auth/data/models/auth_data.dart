import 'user_info.dart';

class AuthData {
  final String accessToken;
  final String refreshToken;
  final UserInfo user;

  AuthData({
    required this.accessToken,
    required this.refreshToken,
    required this.user,
  });

  factory AuthData.fromJson(Map<String, dynamic> json) {
    return AuthData(
      accessToken: json['accessToken'] ?? '',
      refreshToken: json['refreshToken'] ?? '',
      user: UserInfo.fromJson(json['user'] ?? {}),
    );
  }
} 