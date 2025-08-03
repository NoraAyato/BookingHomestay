import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:home_feel/core/models/api_response.dart';
import '../../../../core/constants/api.dart';
import '../../../../core/utils/network_utils.dart';
import '../../../../core/widgets/app_dialog.dart';
import '../models/auth_request.dart';
import '../models/google_auth_request.dart';
import '../models/auth_data.dart';
import '../models/user_info.dart';

abstract class AuthRemoteDataSource {
  Future<ApiResponse<AuthData>> login(AuthRequest request);
  Future<ApiResponse<AuthData>> register(RegisterRequest request);
  Future<ApiResponse<AuthData>> googleLogin(GoogleAuthRequest request);
  Future<ApiResponse<AuthData>> refreshToken(RefreshTokenRequest request);
  Future<ApiResponse<AuthData>> changePassword(ChangePasswordRequest request);
  Future<ApiResponse<AuthData>> forgotPassword(ForgotPasswordRequest request);
  Future<ApiResponse<AuthData>> verifyOtp(VerifyOtpRequest request);
  Future<ApiResponse<AuthData>> resetPassword(ResetPasswordRequest request);
  Future<UserInfo> getCurrentUser(String accessToken);
  Future<void> logout();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Dio dio;

  AuthRemoteDataSourceImpl(this.dio);

  @override
  Future<ApiResponse<AuthData>> login(AuthRequest request) async {
    final response = await dio.post(
      '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.login}',
      data: request.toJson(),
    );
    return ApiResponse<AuthData>.fromJson(
      response.data,
      (data) => AuthData.fromJson(data),
    );
  }

  @override
  Future<ApiResponse<AuthData>> register(RegisterRequest request) async {
    final response = await dio.post(
      '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.register}',
      data: request.toJson(),
    );
    return ApiResponse<AuthData>.fromJson(
      response.data,
      (data) => AuthData.fromJson(data),
    );
  }

  @override
  Future<ApiResponse<AuthData>> googleLogin(GoogleAuthRequest request) async {
    final response = await dio.post(
      '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.googleLogin}',
      data: request.toJson(),
    );
    return ApiResponse<AuthData>.fromJson(
      response.data,
      (data) => AuthData.fromJson(data),
    );
  }

  @override
  Future<ApiResponse<AuthData>> refreshToken(
    RefreshTokenRequest request,
  ) async {
    final response = await dio.post(
      '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.refreshToken}',
      data: request.toJson(),
    );
    return ApiResponse<AuthData>.fromJson(
      response.data,
      (data) => AuthData.fromJson(data),
    );
  }

  @override
  Future<ApiResponse<AuthData>> changePassword(
    ChangePasswordRequest request,
  ) async {
    final response = await dio.post(
      '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.changePassword}',
      data: request.toJson(),
    );
    return ApiResponse<AuthData>.fromJson(
      response.data,
      (data) => AuthData.fromJson(data),
    );
  }

  @override
  Future<ApiResponse<AuthData>> forgotPassword(
    ForgotPasswordRequest request,
  ) async {
    final response = await dio.post(
      '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.forgotPassword}',
      data: request.toJson(),
    );
    return ApiResponse<AuthData>.fromJson(
      response.data,
      (data) => AuthData.fromJson(data),
    );
  }

  @override
  Future<ApiResponse<AuthData>> verifyOtp(VerifyOtpRequest request) async {
    final response = await dio.post(
      '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.verifyOtp}',
      data: request.toJson(),
    );
    return ApiResponse<AuthData>.fromJson(
      response.data,
      (data) => AuthData.fromJson(data),
    );
  }

  @override
  Future<ApiResponse<AuthData>> resetPassword(
    ResetPasswordRequest request,
  ) async {
    final response = await dio.post(
      '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.resetPassword}',
      data: request.toJson(),
    );
    return ApiResponse<AuthData>.fromJson(
      response.data,
      (data) => AuthData.fromJson(data),
    );
  }

  @override
  Future<UserInfo> getCurrentUser(String accessToken) async {
    final response = await dio.get(
      '${ApiConstants.baseUrl}${ApiConstants.users}${ApiConstants.currentUser}',
      options: Options(headers: {'Authorization': 'Bearer $accessToken'}),
    );
    return UserInfo.fromJson(response.data['data']);
  }

  @override
  Future<void> logout() async {
    await dio.post(
      '${ApiConstants.baseUrl}${ApiConstants.auth}${ApiConstants.logout}',
    );
  }
}
