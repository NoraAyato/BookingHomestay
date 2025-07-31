import 'package:dio/dio.dart';
import '../../../../core/constants/api.dart';
import '../models/auth_request.dart';
import '../models/google_auth_request.dart';
import '../models/auth_response.dart';
import '../models/user_info.dart';

abstract class AuthRemoteDataSource {
  Future<AuthResponse> login(AuthRequest request);
  Future<AuthResponse> register(RegisterRequest request);
  Future<AuthResponse> googleLogin(GoogleAuthRequest request);
  Future<AuthResponse> refreshToken(RefreshTokenRequest request);
  Future<AuthResponse> changePassword(ChangePasswordRequest request);
  Future<AuthResponse> forgotPassword(ForgotPasswordRequest request);
  Future<AuthResponse> verifyOtp(VerifyOtpRequest request);
  Future<AuthResponse> resetPassword(ResetPasswordRequest request);
  Future<UserInfo> getCurrentUser(String accessToken);
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
      rethrow;
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
      rethrow;
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
      rethrow;
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
      rethrow;
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
      rethrow;
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
      rethrow;
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
      rethrow;
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
      rethrow;
    }
  }

  @override
  Future<UserInfo> getCurrentUser(String accessToken) async {
    try {
      final response = await dio.get(
        '${ApiConstants.baseUrl}${ApiConstants.users}${ApiConstants.currentUser}',
        options: Options(headers: {'Authorization': 'Bearer $accessToken'}),
      );
      return UserInfo.fromJson(response.data['data']);
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<void> logout() async {
    try {
      await dio.post(
        '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.logout}',
      );
    } catch (e) {
      rethrow;
    }
  }
}
