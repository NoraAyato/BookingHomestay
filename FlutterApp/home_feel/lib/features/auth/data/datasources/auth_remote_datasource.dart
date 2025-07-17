import 'package:dio/dio.dart';
import 'package:home_feel/core/network/dio_client.dart';
import 'package:home_feel/features/auth/domain/entities/auth_response.dart';

class AuthRemoteDataSource {
  final Dio dio;
  final String baseUrl =
      'http://192.168.1.131:8080/api/auth'; // Thay bằng IP của bạn

  AuthRemoteDataSource(this.dio);

  Future<AuthResponse> login(String email, String password) async {
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
      }
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Register failed: $e');
    }
  }
}
