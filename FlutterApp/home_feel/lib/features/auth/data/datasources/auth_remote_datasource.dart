import 'package:dio/dio.dart';
import 'package:home_feel/core/network/dio_client.dart';
import 'package:home_feel/features/auth/domain/entities/auth_response.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

class AuthRemoteDataSource {
  final Dio dio;
  final String baseUrl =
      'http://192.168.5.109:8080/api/auth'; // Thay bằng IP của bạn
  final Connectivity _connectivity = Connectivity();
  AuthRemoteDataSource(this.dio);
  Future<bool> _checkInternetConnection() async {
    final connectivityResult = await _connectivity.checkConnectivity();
    return connectivityResult != ConnectivityResult.none;
  }

  Future<AuthResponse> login(String email, String password) async {
    if (!await _checkInternetConnection()) {
      return AuthResponse(errorMessage: 'No internet connection');
    }
    try {
      final response = await dio.post(
        '$baseUrl/login',
        data: {'email': email, 'password': password},
      );
      print('API Response: ${response.data}'); // Log để kiểm tra
      return AuthResponse.fromJson(response.data);
    } on DioException catch (e) {
      if (e.response != null) {
        final errorData = e.response!.data as Map<String, dynamic>?;
        print('Error Response: ${e.response!.data}'); // Log lỗi chi tiết
        return AuthResponse(
          errorMessage: errorData?['message'] ?? 'Login failed',
        );
      } else if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.connectionError) {
        return AuthResponse(
          errorMessage: 'Server is unavailable or not responding',
        );
      }
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Login failed: $e');
    }
  }

  Future<AuthResponse> register(
    String email,
    String password,
    String firstName,
    String lastName,
  ) async {
    if (!await _checkInternetConnection()) {
      return AuthResponse(errorMessage: 'No internet connection');
    }
    try {
      final response = await dio.post(
        '$baseUrl/register',
        data: {
          'email': email,
          'passWord': password,
          'firstName': firstName,
          'lastName': lastName,
        },
      );
      print('API Response: ${response.data}'); // Log để kiểm tra
      return AuthResponse.fromJson(response.data);
    } on DioException catch (e) {
      if (e.response != null) {
        final errorData = e.response!.data as Map<String, dynamic>?;
        print('Error Response: ${e.response!.data}'); // Log lỗi chi tiết
        return AuthResponse(
          errorMessage: errorData?['message'] ?? 'Register failed',
        );
      } else if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.connectionError) {
        return AuthResponse(
          errorMessage: 'Server is unavailable or not responding',
        );
      }
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Register failed: $e');
    }
  }
}
