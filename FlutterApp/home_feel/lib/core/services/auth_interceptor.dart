import 'package:dio/dio.dart';
import 'package:home_feel/features/auth/data/services/auth_service.dart';
import 'package:home_feel/features/auth/domain/usecases/refresh_token_usecase.dart';

class AuthInterceptor extends Interceptor {
  final AuthService authService;
  final RefreshTokenUseCase refreshTokenUseCase;
  bool _isRefreshing = false;
  final List<Function(String)> _retryQueue = [];

  AuthInterceptor({
    required this.authService,
    required this.refreshTokenUseCase,
  });

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await authService.getAccessToken();
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    final is401 = err.response?.statusCode == 401;
    final isRefreshCall = err.requestOptions.path.contains('/auth/refresh');

    if (is401 && !isRefreshCall) {
      final refreshToken = await authService.getRefreshToken();
      if (refreshToken == null || refreshToken.isEmpty) {
        return handler.reject(err);
      }

      if (_isRefreshing) {
        _retryQueue.add((String token) {
          err.requestOptions.headers['Authorization'] = 'Bearer $token';
          Dio().fetch(err.requestOptions).then((response) {
            handler.resolve(response);
          });
          return;
        });
        return;
      }

      _isRefreshing = true;

      try {
        final response = await refreshTokenUseCase(refreshToken);
        final newAccessToken = response.data?.accessToken;

        if (newAccessToken != null && newAccessToken.isNotEmpty) {
          await authService.saveAuthData(response.data!);

          // Retry tất cả request đã đợi
          for (final retry in _retryQueue) {
            retry(newAccessToken);
          }
          _retryQueue.clear();

          // Retry chính request hiện tại
          err.requestOptions.headers['Authorization'] =
              'Bearer $newAccessToken';
          final retryResponse = await Dio().fetch(err.requestOptions);
          return handler.resolve(retryResponse);
        }
      } catch (e) {
        await authService.clearAuthData();
        return handler.reject(err);
      } finally {
        _isRefreshing = false;
      }
    }

    handler.next(err);
  }
}
