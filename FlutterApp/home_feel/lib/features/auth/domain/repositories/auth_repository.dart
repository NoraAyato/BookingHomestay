import 'package:home_feel/shared/models/api_response.dart';
import '../../data/models/auth_data.dart';
import 'package:home_feel/features/auth/data/models/user_info.dart';

abstract class AuthRepository {
  Future<ApiResponse<AuthData>> login(
    String email,
    String password, {
    bool rememberMe = false,
  });
  Future<ApiResponse<AuthData>> register(
    String email,
    String password,
    String firstName,
    String lastName,
  );
  Future<ApiResponse<AuthData>> googleLogin(
    String idToken,
    String email,
    String name,
    String? picture,
  );
  Future<ApiResponse<AuthData>> refreshToken(String refreshToken);
  Future<ApiResponse<AuthData>> changePassword(
    String currentPassword,
    String newPassword,
    String rePassword,
  );
  Future<ApiResponse<AuthData>> forgotPassword(String email);
  Future<ApiResponse<AuthData>> verifyOtp(String email, String otp);
  Future<ApiResponse<AuthData>> resetPassword(String token, String newPassword);
  Future<UserInfo> getCurrentUser(String accessToken);
  Future<void> logout();
}
