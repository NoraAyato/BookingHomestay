import 'user_info.dart';

class AuthData {
  final String accessToken;
  final String refreshToken;
  final String tokenType;
  final UserInfo? user;

  AuthData({
    required this.accessToken,
    required this.refreshToken,
    this.tokenType = 'Bearer',
    this.user,
  });

  factory AuthData.fromJson(Map<String, dynamic> json) {
    return AuthData(
      accessToken: json['accessToken'] ?? '',
      refreshToken: json['refreshToken'] ?? '',
      tokenType: json['tokenType'] ?? 'Bearer',
      user: json['user'] != null ? UserInfo.fromJson(json['user']) : null,
    );
  }
}
  