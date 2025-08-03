// lib/core/services/api_service.dart
import 'package:dio/dio.dart';
import 'package:home_feel/features/auth/data/services/auth_service.dart';
import 'package:home_feel/features/auth/domain/usecases/refresh_token_usecase.dart';
import '../constants/api.dart';
import 'auth_interceptor.dart';

class ApiService {
  final Dio _dio;
  final AuthService _authService;
  final RefreshTokenUseCase _refreshTokenUseCase;
  ApiService(this._authService, this._refreshTokenUseCase)
    : _dio = Dio(
        BaseOptions(
          baseUrl: ApiConstants.baseUrl,
          connectTimeout: const Duration(seconds: 15),
          receiveTimeout: const Duration(seconds: 10),
          sendTimeout: const Duration(seconds: 10),
        ),
      ) {
    _dio.interceptors.add(
      AuthInterceptor(
        authService: _authService,
        refreshTokenUseCase: _refreshTokenUseCase,
      ),
    );
  }

  Future<Response> put(
    String endpoint, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.put(
        endpoint,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return response;
    } on DioException {
      rethrow;
    }
  }

  Future<Response> get(
    String endpoint, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await _dio.get(
        endpoint,
        queryParameters: queryParameters,
      );
      return response;
    } on DioException catch (e) {
      rethrow;
    }
  }

  Future<Response> post(String endpoint, {Map<String, dynamic>? data}) async {
    try {
      final response = await _dio.post(endpoint, data: data);
      return response;
    } on DioException catch (e) {
      rethrow;
    }
  }
}
