import 'package:dio/dio.dart';

class DioClient {
  final Dio dio = Dio(
    BaseOptions(
      baseUrl: 'http://192.168.1.131:8080/api', // Thay bằng IP của bạn
      connectTimeout: Duration(seconds: 5),
      receiveTimeout: Duration(seconds: 5),
      validateStatus: (status) {
        return status != null &&
            status >= 200 &&
            status < 500; // Chấp nhận 200-499
      },
    ),
  );

  DioClient() {
    dio.interceptors.add(LogInterceptor(responseBody: true)); // Log để debug
  }

  // Cung cấp instance Dio để sử dụng
  Dio get dioInstance => dio;
}
