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
          connectTimeout: const Duration(seconds: 5),
          receiveTimeout: const Duration(seconds: 3),
        ),
      ) {
    _dio.interceptors.add(
      AuthInterceptor(
        authService: _authService,
        refreshTokenUseCase: _refreshTokenUseCase,
      ),
    );
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
      if (e.response != null) {
        switch (e.response!.statusCode) {
          case 401:
            throw Exception('Unauthorized: Invalid credentials');
          case 404:
            throw Exception('Resource not found');
          default:
            throw Exception('GET request failed: ${e.message}');
        }
      } else {
        throw Exception('Network error: ${e.message}');
      }
    }
  }

  Future<Response> post(String endpoint, {Map<String, dynamic>? data}) async {
    try {
      final response = await _dio.post(endpoint, data: data);
      return response;
    } on DioException catch (e) {
      if (e.response != null) {
        switch (e.response!.statusCode) {
          case 400:
            throw Exception('Bad Request: ${e.response!.data}');
          case 401:
            throw Exception('Unauthorized: Invalid credentials');
          case 403:
            throw Exception('Forbidden: Access denied');
          case 404:
            throw Exception('Resource not found');
          case 500:
            throw Exception('Server error: Please try again later');
          default:
            throw Exception('POST request failed: ${e.message}');
        }
      } else {
        throw Exception('Network error: ${e.message}');
      }
    } catch (e) {
      throw Exception('Unexpected error: $e');
    }
  }
}
