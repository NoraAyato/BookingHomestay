import 'package:dio/dio.dart';
import 'package:home_feel/core/network/dio_exception_mapper.dart';
import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/core/services/api_service.dart';
import 'package:home_feel/core/exceptions/auth_exception.dart';

class UserRemoteDataSource {
  final ApiService apiService;

  UserRemoteDataSource(this.apiService);

  Future<ApiResponse> uploadAvatar({required String filePath}) async {
    try {
      final file = await MultipartFile.fromFile(
        filePath,
        filename: filePath.split('/').last,
      );
      final formData = FormData.fromMap({'file': file});
      final response = await apiService.put(
        '/api/users/me/update-picture',
        data: formData,
      );
      final responseData = response.data;
      return ApiResponse(
        success: responseData['success'] ?? false,
        message: responseData['message'] ?? 'Cập nhật ảnh đại diện thành công',
        data: responseData['data'],
      );
    } on DioException catch (e) {
      print('UploadAvatar DioException: ${e.type} - ${e.message}');

      final appException = DioExceptionMapper.map(e);
      return ApiResponse(
        success: false,
        message: appException.message,
        data: appException is AuthException
            ? {'shouldLogout': appException.shouldLogout}
            : null,
      );
    }
  }

  Future<ApiResponse> updateProfile({
    required String userName,
    required String phoneNumber,
    required bool gender,
    required DateTime birthday,
  }) async {
    try {
      final response = await apiService.put(
        '/api/users/me/update-profile',
        data: {
          'userName': userName,
          'phoneNumber': phoneNumber,
          'gender': gender,
          'birthday': birthday.toIso8601String(),
        },
      );
      final responseData = response.data;
      return ApiResponse(
        success: responseData['success'] ?? false,
        message: responseData['message'] ?? 'Cập nhật thông tin thành công',
        data: responseData['data'],
      );
    } on DioException catch (e) {
      print('UpdateProfile DioException: ${e.type} - ${e.message}');

      final appException = DioExceptionMapper.map(e);
      return ApiResponse(
        success: false,
        message: appException.message,
        data: appException is AuthException
            ? {'shouldLogout': appException.shouldLogout}
            : null,
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Có lỗi xảy ra khi cập nhật thông tin',
        data: null,
      );
    }
  }
}
