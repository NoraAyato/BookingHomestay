import 'package:dio/dio.dart';
import 'package:home_feel/core/constants/api.dart';
import 'package:home_feel/core/models/api_response.dart';
import 'package:home_feel/core/services/api_service.dart';

class UserRemoteDataSource {
  final ApiService apiService;

  UserRemoteDataSource(this.apiService);

  Future<ApiResponse> uploadAvatar({
    required String filePath,
    required String accessToken,
  }) async {
    try {
      final file = await MultipartFile.fromFile(
        filePath,
        filename: filePath.split('/').last,
      );
      final formData = FormData.fromMap({'file': file});
      final response = await apiService.put(
        '/api/users/me/update-picture',
        data: formData,
        options: Options(headers: {'Authorization': 'Bearer $accessToken'}),
      );
      final responseData = response.data;
      return ApiResponse(
        success: responseData['success'] ?? false,
        message: responseData['message'] ?? 'Cập nhật ảnh đại diện thành công',
        data: responseData['data'],
      );
    } on DioException catch (e) {
      final errorData = e.response?.data;
      return ApiResponse(
        success: false,
        message: errorData?['message'] ?? 'Cập nhật ảnh đại diện thất bại',
        data: errorData?['data'],
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Có lỗi xảy ra khi cập nhật ảnh đại diện',
        data: null,
      );
    }
  }

  Future<ApiResponse> updateProfile({
    required String accessToken,
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
        options: Options(headers: {'Authorization': 'Bearer $accessToken'}),
      );
      final responseData = response.data;
      return ApiResponse(
        success: responseData['success'] ?? false,
        message: responseData['message'] ?? 'Cập nhật thông tin thành công',
        data: responseData['data'],
      );
    } on DioException catch (e) {
      final errorData = e.response?.data;
      return ApiResponse(
        success: false,
        message: errorData?['message'] ?? 'Cập nhật thông tin thất bại',
        data: errorData?['data'],
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
