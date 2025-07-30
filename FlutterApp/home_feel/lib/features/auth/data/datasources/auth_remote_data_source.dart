import 'package:dio/dio.dart';
import '../../../../core/constants/api.dart';
import '../models/auth_request.dart';
import '../models/google_auth_request.dart';
import '../models/auth_response.dart';

abstract class AuthRemoteDataSource {
  Future<AuthResponse> login(AuthRequest request);
  Future<AuthResponse> register(RegisterRequest request);
  Future<AuthResponse> googleLogin(GoogleAuthRequest request);
  Future<AuthResponse> refreshToken(RefreshTokenRequest request);
  Future<AuthResponse> changePassword(ChangePasswordRequest request);
  Future<AuthResponse> forgotPassword(ForgotPasswordRequest request);
  Future<AuthResponse> verifyOtp(VerifyOtpRequest request);
  Future<AuthResponse> resetPassword(ResetPasswordRequest request);
  Future<void> logout();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Dio dio;

  AuthRemoteDataSourceImpl(this.dio);

  @override
  Future<AuthResponse> login(AuthRequest request) async {
    try {
      final response = await dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.login}',
        data: request.toJson(),
      );
      return AuthResponse.fromJson(response.data);
    } catch (e) {
      throw Exception('Login failed: $e');
    }
  }

  @override
  Future<AuthResponse> register(RegisterRequest request) async {
    try {
      final response = await dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.register}',
        data: request.toJson(),
      );
      return AuthResponse.fromJson(response.data);
    } catch (e) {
      throw Exception('Register failed: $e');
    }
  }

  @override
  Future<AuthResponse> googleLogin(GoogleAuthRequest request) async {
    try {
      final response = await dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.googleLogin}',
        data: request.toJson(),
      );
      return AuthResponse.fromJson(response.data);
    } catch (e) {
      throw Exception('Google login failed: $e');
    }
  }

  @override
  Future<AuthResponse> refreshToken(RefreshTokenRequest request) async {
    try {
      final response = await dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.refreshToken}',
        data: request.toJson(),
      );
      return AuthResponse.fromJson(response.data);
    } catch (e) {
      throw Exception('Refresh token failed: $e');
    }
  }

  @override
  Future<AuthResponse> changePassword(ChangePasswordRequest request) async {
    try {
      final response = await dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.changePassword}',
        data: request.toJson(),
      );
      return AuthResponse.fromJson(response.data);
    } catch (e) {
      throw Exception('Change password failed: $e');
    }
  }

  @override
  Future<AuthResponse> forgotPassword(ForgotPasswordRequest request) async {
    try {
      final response = await dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.forgotPassword}',
        data: request.toJson(),
      );
      return AuthResponse.fromJson(response.data);
    } catch (e) {
      throw Exception('Forgot password failed: $e');
    }
  }

  @override
  Future<AuthResponse> verifyOtp(VerifyOtpRequest request) async {
    try {
      final response = await dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.verifyOtp}',
        data: request.toJson(),
      );
      return AuthResponse.fromJson(response.data);
    } catch (e) {
      throw Exception('Verify OTP failed: $e');
    }
  }

  @override
  Future<AuthResponse> resetPassword(ResetPasswordRequest request) async {
    try {
      final response = await dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.resetPassword}',
        data: request.toJson(),
      );
      return AuthResponse.fromJson(response.data);
    } catch (e) {
      throw Exception('Reset password failed: $e');
    }
  }

  @override
  Future<void> logout() async {
    try {
      await dio.post('${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.logout}');
    } catch (e) {
      throw Exception('Logout failed: $e');
    }
  }
} 