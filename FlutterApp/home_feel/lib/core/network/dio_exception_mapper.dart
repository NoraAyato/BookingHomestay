import 'package:dio/dio.dart';
import 'package:home_feel/core/exceptions/app_exception.dart';
import 'package:home_feel/core/exceptions/network_exception.dart';

class DioExceptionMapper {
  static AppException map(DioException dioException) {
    switch (dioException.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return NetworkException('Kết nối mạng chậm. Vui lòng thử lại.');
      case DioExceptionType.connectionError:
        return NetworkException(
          'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
        );
      case DioExceptionType.badResponse:
        final errorData = dioException.response?.data;
        final statusCode = dioException.response?.statusCode;

        if (statusCode == 401) {
          return AuthException(
            errorData?['message'] ?? 'Xác thực không thành công.',
            shouldLogout: true,
          );
        }

        return ServerException(
          errorData?['message'] ?? 'Lỗi từ máy chủ',
          code: statusCode,
        );
      case DioExceptionType.cancel:
        return RequestCancelledException('Yêu cầu đã bị hủy.');
      default:
        return UnknownException('Đã xảy ra lỗi không xác định.');
    }
  }
}
