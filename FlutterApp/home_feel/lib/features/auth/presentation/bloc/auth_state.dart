import 'package:home_feel/shared/models/api_response.dart';
import 'package:home_feel/features/auth/data/models/auth_data.dart';
import 'package:home_feel/features/auth/data/models/user_info.dart';

abstract class AuthState {}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthSuccess extends AuthState {
  final ApiResponse<AuthData> authResponse;
  final UserInfo? userInfo;
  AuthSuccess(this.authResponse, this.userInfo);
}

class AuthFailure extends AuthState {
  final String message;
  final ApiResponse<AuthData>? error;

  AuthFailure(this.message, [this.error]);
}

class AuthLoggedOut extends AuthState {}

class AuthRequiresLogin extends AuthState {}
