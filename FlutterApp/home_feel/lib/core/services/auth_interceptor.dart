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
        // Gọi refresh token với token hiện tại
        final response = await refreshTokenUseCase.call(refreshToken);
        if (!response.success || response.data == null) {
          _isRefreshing = false;
          await authService.clearAuthData();
          return handler.reject(err);
        }

        // Lưu token mới
        final authData = response.data!;
        await authService.saveAuthData(authData);

        if (authData.accessToken.isEmpty) {
          _isRefreshing = false;
          await authService.clearAuthData();
          return handler.reject(err);
        }

        // Retry tất cả request đang đợi
        for (final retry in _retryQueue) {
          retry(authData.accessToken);
        }
        _retryQueue.clear();

        // Retry request hiện tại
        err.requestOptions.headers['Authorization'] =
            'Bearer ${authData.accessToken}';
        final retryResponse = await Dio().fetch(err.requestOptions);

        _isRefreshing = false;
        return handler.resolve(retryResponse);
      } catch (e) {
        _isRefreshing = false;
        _retryQueue.clear();
        await authService.clearAuthData();
        return handler.reject(err);
      }
    }

    handler.next(err);
  }
}
