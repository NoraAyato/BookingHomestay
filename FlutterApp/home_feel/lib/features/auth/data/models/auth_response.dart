import 'package:home_feel/features/auth/data/models/user_info.dart';

import 'auth_data.dart';

class AuthResponse {
  final bool success;
  final String message;
  final AuthData? data;

  AuthResponse({
    required this.success,
    required this.message,
    this.data,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      data: json['data'] != null ? AuthData.fromJson(json['data']) : null,
    );
  }
}

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
