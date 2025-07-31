import 'package:home_feel/features/auth/data/models/user_info.dart';

import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_data_source.dart';
import '../models/auth_request.dart';
import '../models/google_auth_request.dart';
import '../models/auth_response.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;

  AuthRepositoryImpl(this.remoteDataSource);

  @override
  Future<AuthResponse> login(String email, String password, {bool rememberMe = false}) async {
    final request = AuthRequest(
      email: email, 
      password: password,
      rememberMe: rememberMe,
    );
    return await remoteDataSource.login(request);
  }

  @override
  Future<AuthResponse> register(String email, String password, String firstName, String lastName) async {
    final request = RegisterRequest(
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    );
    return await remoteDataSource.register(request);
  }

  @override
  Future<AuthResponse> googleLogin(String idToken, String email, String name, String? picture) async {
    final request = GoogleAuthRequest(
      idToken: idToken,
      email: email,
      name: name,
      picture: picture,
    );
    return await remoteDataSource.googleLogin(request);
  }

  @override
  Future<AuthResponse> refreshToken(String refreshToken) async {
    final request = RefreshTokenRequest(refreshToken: refreshToken);
    return await remoteDataSource.refreshToken(request);
  }

  @override
  Future<AuthResponse> changePassword(String currentPassword, String newPassword, String rePassword) async {
    final request = ChangePasswordRequest(
      currentPassword: currentPassword,
      newPassword: newPassword,
      rePassword: rePassword,
    );
    return await remoteDataSource.changePassword(request);
  }

  @override
  Future<AuthResponse> forgotPassword(String email) async {
    final request = ForgotPasswordRequest(email: email);
    return await remoteDataSource.forgotPassword(request);
  }

  @override
  Future<AuthResponse> verifyOtp(String email, String otp) async {
    final request = VerifyOtpRequest(email: email, otp: otp);
    return await remoteDataSource.verifyOtp(request);
  }

  @override
  Future<AuthResponse> resetPassword(String token, String newPassword) async {
    final request = ResetPasswordRequest(token: token, newPassword: newPassword);
    return await remoteDataSource.resetPassword(request);
  }

  @override
  Future<void> logout() async {
    await remoteDataSource.logout();
  }

  @override
  Future<UserInfo> getCurrentUser(String accessToken) async {
    return await remoteDataSource.getCurrentUser(accessToken);
  }
} 