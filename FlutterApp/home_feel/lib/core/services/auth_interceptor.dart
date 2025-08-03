import 'package:dio/dio.dart';
import 'package:get_it/get_it.dart';
import 'package:home_feel/features/auth/data/services/auth_service.dart';
import 'package:home_feel/features/auth/domain/usecases/refresh_token_usecase.dart';
import 'package:home_feel/features/auth/bloc/auth_bloc.dart';
import 'package:home_feel/features/auth/bloc/auth_event.dart';
import 'package:home_feel/core/exceptions/auth_exception.dart';

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
    await _addTokenToRequest(options, handler);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (!_is401Error(err) || _isRefreshTokenCall(err)) {
      return handler.next(err);
    }

    if (await _handleInvalidToken(err, handler)) return;
    if (await _handleEmptyRefreshToken(err, handler)) return;
    if (await _handleRefreshingState(err, handler)) return;

    await _handleTokenRefresh(err, handler);
  }

  Future<void> _addTokenToRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await authService.getAccessToken();
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  bool _is401Error(DioException err) => err.response?.statusCode == 401;

  bool _isRefreshTokenCall(DioException err) =>
      err.requestOptions.path.contains('/auth/refresh');

  Future<bool> _handleInvalidToken(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final errorData = err.response?.data as Map<String, dynamic>;
    final errorMessage =
        errorData['error'] as String? ?? errorData['message'] as String?;

    if (errorMessage?.toLowerCase().contains('invalid') != true) {
      return false;
    }

    await _logout();
    handler.reject(
      _createAuthException(
        err.requestOptions,
        'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.',
      ),
    );
    return true;
  }

  Future<bool> _handleEmptyRefreshToken(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final refreshToken = await authService.getRefreshToken();
    if (refreshToken != null && refreshToken.isNotEmpty) {
      return false;
    }

    await _logout();
    handler.reject(
      _createAuthException(
        err.requestOptions,
        'Không thể làm mới phiên đăng nhập. Vui lòng đăng nhập lại.',
      ),
    );
    return true;
  }

  Future<bool> _handleRefreshingState(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (!_isRefreshing) return false;

    _retryQueue.add((String token) {
      err.requestOptions.headers['Authorization'] = 'Bearer $token';
      Dio().fetch(err.requestOptions).then(handler.resolve);
    });
    return true;
  }

  Future<void> _handleTokenRefresh(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    _isRefreshing = true;
    try {
      await _performTokenRefresh(err, handler);
    } catch (e) {
      await _handleRefreshError(err, handler);
    }
  }

  Future<void> _performTokenRefresh(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final refreshToken = await authService.getRefreshToken();
    final response = await refreshTokenUseCase.call(refreshToken!);

    if (!response.success || response.data == null) {
      throw Exception('Refresh token failed');
    }

    final authData = response.data!;
    await authService.saveAuthData(authData);

    if (authData.accessToken.isEmpty) {
      throw Exception('Empty access token');
    }

    await _retryQueuedRequests(authData.accessToken);
    await _retryCurrentRequest(err, handler, authData.accessToken);
    _isRefreshing = false;
  }

  Future<void> _retryQueuedRequests(String newToken) async {
    for (final retry in _retryQueue) {
      retry(newToken);
    }
    _retryQueue.clear();
  }

  Future<void> _retryCurrentRequest(
    DioException err,
    ErrorInterceptorHandler handler,
    String newToken,
  ) async {
    err.requestOptions.headers['Authorization'] = 'Bearer $newToken';
    final retryResponse = await Dio().fetch(err.requestOptions);
    handler.resolve(retryResponse);
  }

  Future<void> _handleRefreshError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    _isRefreshing = false;
    _retryQueue.clear();
    await _logout();
    handler.reject(
      _createAuthException(
        err.requestOptions,
        'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
      ),
    );
  }

  Future<void> _logout() async {
    await authService.clearAuthData();
    GetIt.I<AuthBloc>().add(LogoutEvent());
  }

  DioException _createAuthException(
    RequestOptions requestOptions,
    String message,
  ) {
    return DioException(
      requestOptions: requestOptions,
      error: AuthException(message: message, shouldLogout: true),
    );
  }
}
