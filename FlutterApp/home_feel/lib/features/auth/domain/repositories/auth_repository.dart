import 'package:home_feel/features/auth/data/models/user_info.dart';

import '../../data/models/auth_response.dart';

abstract class AuthRepository {
  Future<AuthResponse> login(String email, String password, {bool rememberMe = false});
  Future<AuthResponse> register(String email, String password, String firstName, String lastName);
  Future<AuthResponse> googleLogin(String idToken, String email, String name, String? picture);
  Future<AuthResponse> refreshToken(String refreshToken);
  Future<AuthResponse> changePassword(String currentPassword, String newPassword, String rePassword);
  Future<AuthResponse> forgotPassword(String email);
  Future<AuthResponse> verifyOtp(String email, String otp);
  Future<AuthResponse> resetPassword(String token, String newPassword);
  Future<UserInfo> getCurrentUser(String accessToken);
  Future<void> logout();
} 