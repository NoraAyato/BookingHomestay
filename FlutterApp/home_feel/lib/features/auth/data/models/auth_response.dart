import 'auth_data.dart';

class AuthResponse {
  final bool success;
  final String message;
  final AuthData? data;

  AuthResponse({required this.success, required this.message, this.data});

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    final bool hasSuccess = json.containsKey('success');
    return AuthResponse(
      success: hasSuccess ? json['success'] : false,
      message: json['message'] ?? json['error'] ?? 'Lỗi không xác định',
      data: hasSuccess && json['data'] != null
          ? AuthData.fromJson(json['data'])
          : null,
    );
  }
}
