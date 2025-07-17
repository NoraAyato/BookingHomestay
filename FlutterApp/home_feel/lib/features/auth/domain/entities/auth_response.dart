class AuthResponse {
  final String? accessToken; // Làm nullable để xử lý lỗi
  final String? errorMessage; // Thêm trường cho thông điệp lỗi

  AuthResponse({this.accessToken, this.errorMessage});

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    if (json.containsKey('accessToken')) {
      final accessToken = json['accessToken'] as String?;
      if (accessToken == null || accessToken.isEmpty) {
        throw Exception('Access token is missing or invalid');
      }
      return AuthResponse(
        accessToken: accessToken,
        errorMessage: null, // Không có lỗi khi thành công
      );
    } else if (json.containsKey('message')) {
      final errorMessage = json['message'] as String?;
      return AuthResponse(
        errorMessage: errorMessage ?? 'Unknown error',
        accessToken: null, // Không có token khi lỗi
      );
    }
    throw Exception('Invalid API response format');
  }
}
