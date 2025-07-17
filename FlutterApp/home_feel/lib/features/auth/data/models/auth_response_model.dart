import 'package:home_feel/features/auth/domain/entities/auth_response.dart';

class AuthResponse {
  final String? accessToken; // Có thể null nếu lỗi
  final String? errorMessage; // Thêm trường cho thông điệp lỗi

  AuthResponse({this.accessToken, this.errorMessage});

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    if (json.containsKey('accessToken')) {
      final accessToken = json['accessToken'] as String?;
      if (accessToken == null || accessToken.isEmpty) {
        throw Exception('Access token is missing or invalid');
      }
      return AuthResponse(accessToken: accessToken);
    } else if (json.containsKey('message')) {
      final errorMessage = json['message'] as String?;
      return AuthResponse(errorMessage: errorMessage ?? 'Unknown error');
    }
    throw Exception('Invalid API response format');
  }
}
