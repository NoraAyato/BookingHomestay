import 'package:home_feel/core/models/api_response.dart';

abstract class UserRepository {
  Future<ApiResponse> uploadAvatar(String token, String filePath);
  Future<ApiResponse> updateProfile({
    required String token,
    required String userName,
    required String phoneNumber,
    required bool gender,
    required DateTime birthday,
  });
}
