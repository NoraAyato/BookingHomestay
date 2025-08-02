import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:home_feel/features/auth/data/models/auth_data.dart';
import 'package:home_feel/features/auth/data/models/auth_response.dart';
import 'package:home_feel/features/auth/data/services/auth_service.dart';
import 'package:home_feel/features/common/bloc/loading_bloc.dart';
import '../domain/usecases/login_usecase.dart';
import '../domain/usecases/register_usecase.dart';
import '../domain/usecases/google_login_usecase.dart';
import '../domain/usecases/refresh_token_usecase.dart';
import '../domain/usecases/change_password_usecase.dart';
import '../domain/usecases/forgot_password_usecase.dart';
import '../domain/usecases/verify_otp_usecase.dart';
import '../domain/usecases/reset_password_usecase.dart';
import '../domain/usecases/get_current_user_usecase.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase loginUseCase;
  final RegisterUseCase registerUseCase;
  final GoogleLoginUseCase googleLoginUseCase;
  final RefreshTokenUseCase refreshTokenUseCase;
  final ChangePasswordUseCase changePasswordUseCase;
  final ForgotPasswordUseCase forgotPasswordUseCase;
  final VerifyOtpUseCase verifyOtpUseCase;
  final ResetPasswordUseCase resetPasswordUseCase;
  final GetCurrentUserUseCase getCurrentUserUseCase;
  final AuthService authService;

  AuthBloc({
    required this.loginUseCase,
    required this.registerUseCase,
    required this.googleLoginUseCase,
    required this.refreshTokenUseCase,
    required this.changePasswordUseCase,
    required this.forgotPasswordUseCase,
    required this.verifyOtpUseCase,
    required this.resetPasswordUseCase,
    required this.getCurrentUserUseCase,
    required this.authService,
  }) : super(AuthInitial()) {
    on<LoginEvent>(_onLogin);
    on<RegisterEvent>(_onRegister);
    on<GoogleLoginEvent>(_onGoogleLogin);
    on<RefreshTokenEvent>(_onRefreshToken);
    on<ChangePasswordEvent>(_onChangePassword);
    on<ForgotPasswordEvent>(_onForgotPassword);
    on<VerifyOtpEvent>(_onVerifyOtp);
    on<ResetPasswordEvent>(_onResetPassword);
    on<LogoutEvent>(_onLogout);
    on<CheckAuthStatusEvent>(_onCheckAuthStatus);
  }

  Future<void> _onLogin(LoginEvent event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    final loadingBloc = GetIt.I<LoadingBloc>();
    loadingBloc.show();
    try {
      final response = await loginUseCase(
        event.email,
        event.password,
        rememberMe: event.rememberMe,
      );
      final accessToken = response.data?.accessToken ?? '';
      final userInfo = await getCurrentUserUseCase(accessToken);

      if (event.rememberMe) {
        await authService.saveAuthData(response.data!);
        await authService.saveUserInfo(userInfo);
      }

      emit(AuthSuccess(response, userInfo));
    } catch (e) {
      emit(_handleError(e));
    } finally {
      loadingBloc.hide();
    }
  }

  Future<void> _onRegister(RegisterEvent event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    final loadingBloc = GetIt.I<LoadingBloc>();
    loadingBloc.show();
    try {
      final response = await registerUseCase(
        event.email,
        event.password,
        event.firstName,
        event.lastName,
      );
      emit(AuthSuccess(response, null));
    } catch (e) {
      emit(_handleError(e));
    } finally {
      loadingBloc.hide();
    }
  }

  Future<void> _onRefreshToken(
    RefreshTokenEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    final loadingBloc = GetIt.I<LoadingBloc>();
    loadingBloc.show();
    try {
      final response = await refreshTokenUseCase(event.refreshToken);
      emit(AuthSuccess(response, null));
    } catch (e) {
      emit(_handleError(e));
    } finally {
      loadingBloc.hide();
    }
  }

  Future<void> _onChangePassword(
    ChangePasswordEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    final loadingBloc = GetIt.I<LoadingBloc>();
    loadingBloc.show();
    try {
      final response = await changePasswordUseCase(
        event.currentPassword,
        event.newPassword,
        event.rePassword,
      );
      emit(AuthSuccess(response, null));
    } catch (e) {
      emit(_handleError(e));
    } finally {
      loadingBloc.hide();
    }
  }

  Future<void> _onGoogleLogin(
    GoogleLoginEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    try {
      final response = await googleLoginUseCase(
        event.idToken,
        event.email,
        event.name,
        event.picture,
      );
      final accessToken = response.data?.accessToken ?? '';
      final userInfo = await getCurrentUserUseCase(accessToken);
      await authService.saveAuthData(response.data!);
      await authService.saveUserInfo(userInfo);
      emit(AuthSuccess(response, userInfo));
    } catch (e) {
      emit(_handleError(e));
    }
  }

  Future<void> _onForgotPassword(
    ForgotPasswordEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    final loadingBloc = GetIt.I<LoadingBloc>();
    loadingBloc.show();
    try {
      final response = await forgotPasswordUseCase(event.email);
      emit(AuthSuccess(response, null));
    } catch (e) {
      emit(_handleError(e));
    } finally {
      loadingBloc.hide();
    }
  }

  Future<void> _onVerifyOtp(
    VerifyOtpEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    final loadingBloc = GetIt.I<LoadingBloc>();
    loadingBloc.show();
    try {
      final response = await verifyOtpUseCase(event.email, event.otp);
      emit(AuthSuccess(response, null));
    } catch (e) {
      emit(_handleError(e));
    } finally {
      loadingBloc.hide();
    }
  }

  Future<void> _onResetPassword(
    ResetPasswordEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    final loadingBloc = GetIt.I<LoadingBloc>();
    loadingBloc.show();
    try {
      final response = await resetPasswordUseCase(
        event.token,
        event.newPassword,
      );
      emit(AuthSuccess(response, null));
    } catch (e) {
      emit(_handleError(e));
    } finally {
      loadingBloc.hide();
    }
  }

  Future<void> _onLogout(LogoutEvent event, Emitter<AuthState> emit) async {
    await authService.clearAuthData();
    emit(AuthLoggedOut());
  }

  Future<void> _onCheckAuthStatus(
    CheckAuthStatusEvent event,
    Emitter<AuthState> emit,
  ) async {
    final isLoggedIn = authService.isLoggedIn();
    if (!isLoggedIn) {
      emit(AuthInitial());
      return;
    }

    final accessToken = await authService.getAccessToken();
    final refreshToken = await authService.getRefreshToken();

    if (accessToken == null || refreshToken == null) {
      emit(AuthInitial());
      return;
    }

    try {
      // Luôn gọi API để lấy thông tin user mới nhất
      final userInfo = await getCurrentUserUseCase(accessToken);
      // Cập nhật cache
      await authService.saveUserInfo(userInfo);

      final response = AuthResponse(
        success: true,
        message: 'Đăng nhập thành công',
        data: AuthData(
          accessToken: accessToken,
          refreshToken: refreshToken,
          tokenType: 'Bearer',
          user: userInfo,
        ),
      );
      emit(AuthSuccess(response, userInfo));
    } catch (e) {
      // Nếu API thất bại, dùng dữ liệu cache
      final cachedUser = authService.getUserInfoObject();
      if (cachedUser != null) {
        final response = AuthResponse(
          success: true,
          message: 'Đăng nhập từ bộ nhớ đệm',
          data: AuthData(
            accessToken: accessToken,
            refreshToken: refreshToken,
            tokenType: 'Bearer',
            user: cachedUser,
          ),
        );
        emit(AuthSuccess(response, cachedUser));
      } else {
        emit(AuthInitial());
      }
    }
  }

  AuthFailure _handleError(dynamic e) {
    if (e is DioException && e.response != null) {
      try {
        final data = e.response!.data;
        final message =
            data['message'] ?? data['error'] ?? 'Lỗi không xác định';
        return AuthFailure(message);
      } catch (_) {
        return AuthFailure('Lỗi khi phân tích dữ liệu phản hồi từ server');
      }
    }
    return AuthFailure('Lỗi: ${e.toString()}');
  }
}
